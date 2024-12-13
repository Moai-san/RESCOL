#Django modules
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework import viewsets
from rest_framework.decorators import action
from .serializer import *

#Others modules
from shapely.geometry import Point, Polygon, mapping
import os
import zipfile
import json
import geopandas as gpd
import shapefile
import uuid 
import tempfile
from pyproj import Proj, transform, Transformer
import bcrypt
import ast
import subprocess
import random
import numpy as np
import math

from shutil import rmtree


#Funciones importanters
def geo_to_rect(lat, lon): #Transformar sistema de coordenadas
    
    transformer = Transformer.from_crs("EPSG:4326", 'EPSG:32719') # Definir sistemas de coordenadas de entrada y salida

    x, y = transformer.transform(lat, lon) # Transformar coordenadas

    return (x,y)


def file_to_geo(archivo_upload): #Transformar archivo a shapefile
    file_name = archivo_upload.name[0:-4]

    # Crear un directorio temporal
    with tempfile.TemporaryDirectory() as temp_dir:
        # Guardar el archivo cargado en el directorio temporal
        ruta_archivo_temporal = os.path.join(temp_dir, archivo_upload.name)

        with open(ruta_archivo_temporal, 'wb+') as destino:
            for chunk in archivo_upload.chunks():
                destino.write(chunk)

        # Descomprimir el archivo en el directorio temporal
        with zipfile.ZipFile(ruta_archivo_temporal, 'r') as zip_ref:
            for nombre_archivo in zip_ref.namelist():
                if not nombre_archivo.startswith('__MACOSX'):
                    zip_ref.extract(nombre_archivo, temp_dir)

        # Obtener una lista de nombres de archivos en el directorio
        archivos = os.listdir(temp_dir)

        # Imprimir los nombres de los archivos
        # Ahora los archivos están descomprimidos en el directorio temporal
        # Obtener una lista de nombres de archivos en el directorio
        if(len(archivos) <= 2):
            files_path = '{}/{}'.format(temp_dir,file_name)
        else:
            files_path = '{}/'.format(temp_dir)


        shapefile = gpd.read_file(files_path)

        b = ['NOMBRE_VIA', 'DISTANCIA', 'SENTIDO', 'i', 'j', 'ZONAS', 'ID'] 
        contiene_todos = all(elem in shapefile.columns for elem in b)
        faltantes = [elem for elem in b if elem not in shapefile.columns]

        if not contiene_todos:
            raise ValueError("Faltan propiedades en el shapefile: {}".format(', '.join(faltantes)))

        crs = str(shapefile.crs)
        shapefile = shapefile.to_crs(4326)

    shapefile = shapefile.to_json()

    shapefile = json.loads(shapefile)

    return shapefile

# API VIEWS
class redesVialesViewSet(viewsets.ModelViewSet):

    serializer_class = redesSerializaer
    queryset = redesViales.objects.all()

    #Extrear modelos por usuario y red
    @action(detail=False, methods=['get'], url_path='getModelsByRed')
    def getModelsByRed(self, request):

        id = request.query_params.get('id', None)

        queryset = redesViales.objects.all()

        response = []
        for red in queryset:
            # Ahora accedemos a las comunas asociadas
            comunas_asociadas = red.comunas.all()

            comunas = []
            # Iteramos sobre las comunas asociadas para imprimir sus nombres, por ejemplo
            for comuna in comunas_asociadas:
                comunas.append(comuna.id)

            instance_modelo = modelos.objects.filter(user_id=id, 
                                                     red_id=red.id ).values()

            response.append({
                                "id": red.id,
                                "colaborativo": red.colaborativo,
                                "nombre": red.nombre,
                                "comuna": comunas,
                                "modelos": len(instance_modelo)
                            })
       
        return Response(response) 

    #Get all
    def list(self, request):
        queryset = redesViales.objects.all()
        user_id = request.query_params.get('user_id')
        response = []

        for red in queryset:
            # Ahora accedemos a las comunas asociadas
            comunas_asociadas = red.comunas.all()

            comunas = []
            # Iteramos sobre las comunas asociadas para imprimir sus nombres, por ejemplo
            for comuna in comunas_asociadas:
                comunas.append(comuna.id)

            instance_modelo = modelos.objects.filter(user_id=user_id, 
                                                     red_id=red.id ).values()
            

            response.append({
                                "id": red.id,
                                "colaborativo": red.colaborativo,
                                "nombre": red.nombre,
                                "comuna": comunas,
                                "modelos": len(instance_modelo)
                            })
       
        return Response(response, status=200) 

    #GET BY ID
    def retrieve(self, request, *args, **kwargs):
        self.serializer_class = redesSerializaer

        instance_id = kwargs.get('pk')

        instance_redes = redesViales.objects.get(id=instance_id)

        fileName = "".join(instance_redes.nombre.split(' '))

        # Intentamos obtener la instancia del modelo
        file = "api/data/redes/{}.json".format(fileName)

        with open(file, encoding='utf-8') as fh:
            geojson = json.load(fh)

        response = {
            'data': geojson
        }

        return Response(response)
        
    #POST
    def create(self, request):
        self.serializer_class = redesSerializaer

        archivo_upload = request.FILES['files']

        red_id = request.data.get('id')
        red_isColab = request.data.get('colaborativo')
        red_name = request.data.get('name')
        red_comunas = eval(f"[{request.data.get('comunas')}]")

        valor_bool = red_isColab.lower() == "true"
        
        if not valor_bool:
            comuna = comunas.objects.create(nombre=red_name)
            red_comunas.append(comuna.id)

        fileName = "".join(red_name.split(' '))

        try:
            shapefile = file_to_geo(archivo_upload)
        except ValueError as e:
            return Response(str(e), status=400)

        #Escribir json creado por la app
        with open("api/data/redes/{}.json".format(fileName), "w", encoding="utf-8") as outfile:
            json.dump(shapefile, outfile, indent=4)

        serializer = redesSerializaer(data={
                                            'id': red_id,
                                            'colaborativo': valor_bool,
                                            'nombre': red_name,
                                            'comunas': red_comunas
                                           })
        if serializer.is_valid():
            serializer.save()
            return Response({"geojson" : shapefile})

    #DELETE
    def destroy(self, request, *args, **kwargs):

        instance = self.get_object()

        instance_redes = redesViales.objects.get(id=instance.id)

        if not instance_redes.colaborativo:
            comunas = []
            # Iteramos sobre las comunas asociadas para imprimir sus nombres, por ejemplo
            for comuna in instance_redes.comunas.all():
                comuna.delete()
            

        fileName = "".join(instance_redes.nombre.split(' '))

        os.remove("api/data/redes/{}.json".format(fileName))

        self.perform_destroy(instance)

        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_destroy(self, instance):
        instance.delete()

    def update(self, request, pk=None):
            self.serializer_class = redesSerializaer

            archivo_upload = request.FILES['files']
            red_id = request.data.get('id')
            
            try:
                shapefile = file_to_geo(archivo_upload)
            except ValueError as e:
                return Response(str(e), status=400)

            instance_red = redesViales.objects.get(id=red_id)

            fileName = instance_red.nombre.replace(' ','')

            #Escribir json creado por la app
            with open("api/data/redes/{}.json".format(fileName), "w", encoding="utf-8") as outfile:
                json.dump(shapefile, outfile, indent=4)

            return Response({"geojson" : shapefile})

    #Extrear modelos por usuario y red
    @action(detail=False, methods=['get'], url_path='getSegmentMap')
    def getSegment(self, request):

        id = request.query_params.get('id', None)

        # Intentamos obtener la instancia del modelo
        file = "api/data/segmentos/{}.json".format(id)

        with open(file, encoding='utf-8') as fh:
            geojson = json.load(fh)


        s = set()

        for feature in geojson['features']:
            s.add(feature['properties']['zona'])

        d = {}
        for i,v in enumerate(s):
            color = list(np.random.choice(range(256), size=3))

            d[v]='#%02x%02x%02x' % tuple(color)
        
        return Response({'id': id,
                         'colores': d,
                         'data': geojson})
     
class modelosViewSet(viewsets.ModelViewSet):

    serializer_class = modelosSerializaer
    queryset = modelos.objects.all()


    #Extrear modelos por usuario y red
    @action(detail=False, methods=['get'], url_path='getModelByRed')
    def getModelByRed(self, request):
        # Obtener los parámetros del request
        id_usuario = request.query_params.get('id_usuario', None)
        id_red = request.query_params.get('id_red', None)

        
        instance_modelo = modelos.objects.filter(user_id=id_usuario, 
                                                 red_id=id_red ).values()

        response = []

        for instance in instance_modelo:
            
            nombre     = instance['nombre']
            residuos   = instance['residuos']
            costo      = instance['costo']
            capacidad  = instance['capacidad']
            jornada    = instance['jornada']
            frecuencia = instance['frecuencia']
            fecha      = instance['fecha']
            hora       = instance['hora']
            model_id   = instance['id']
            red_id     = instance['red_id']

            # Suponiendo que ya tienes el red_id definido
            instance_red = redesViales.objects.get(id=red_id)  # Obtenemos la instancia de redesViales

            # Ahora accedemos a las comunas asociadas
            comunas_asociadas = instance_red.comunas.all()

            comunas = []
            # Iteramos sobre las comunas asociadas para imprimir sus nombres, por ejemplo
            for comuna in comunas_asociadas:
                comunas.append({'id': comuna.id, 'nombre': comuna.nombre})

            #==============================Extraer data del geojson=====================================
            # Intentamos obtener la instancia del modelo
            file = "api/data/outputs/{}.json".format(model_id)

            with open(file, encoding='utf-8') as fh:
                geojson = json.load(fh)
            
            c = round(geojson['propierties']['c_total'])
            c_camion = geojson['propierties']['c_camiones']
            shifts = len(geojson['propierties']['shifts_with_tours'])
            c_km = round(geojson['propierties']['km_total'],2)
            c_real = round(geojson['propierties']['costo_real'])
            tiempo = sum(geojson['propierties']['tiempos'])
            c_rutas = geojson['propierties']['c_rutas']

            #============================================================================================ 

            response.append({
                'id'         : model_id,
                'nombre'     : nombre,
                'residuos'   : residuos,
                'costo'      : costo,
                'capacidad'  : capacidad,
                'jornada'    : jornada,
                'frecuencia' : frecuencia,
                'comuna'     : comunas,
                'fecha'      : fecha,
                'hora'       : hora,
                'red'        : red_id,
                'c_total'    : c,
                'c_camion'   : c_camion,
                'c_rutas'   : c_rutas,
                'c_km'       : c_km,
                'tiempo'     : tiempo,
                'costo_real' : c_real,
                'shifts'     : shifts
            })

        # Devolver una respuesta con status 200
        return Response({'modelos':response}, status=200)

    #Extrear modelos por usuario y comuna
    @action(detail=False, methods=['post'], url_path='filterModelByComuna')
    def filterModelByComuna(self, request):
        
        model_data = request.data

        comunas = model_data.get('comuna')
        

        redes = []

        for comuna in comunas:
            nombre = comuna['nombre']
            instance_red = redesViales.objects.filter(nombre=nombre).values()

            for red in instance_red:
                redes.append(red)

        user_id = model_data.get('user')
        frecuencia = model_data.get('frecuencia')
        costo = model_data.get('costo')
        residuos = model_data.get('residuos')
        jornada = model_data.get('jornada')
        capacidad = model_data.get('capacidad')

        models =[]

        for red_id in redes:
            instance_modelo = modelos.objects.filter(
                                                        user_id=user_id,
                                                        red_id=red_id['id'],
                                                        frecuencia=frecuencia,
                                                        costo=costo,
                                                        residuos=residuos,
                                                        jornada=jornada,
                                                        capacidad=capacidad
                                                    ).values()

            #agregar caso que no exista modelo para la comuna => {id:comunas[i].id, red: null, comuna: comunas[i].nombre}
            
            for instance in instance_modelo:
                instance['comuna'] = [red_id]
                #==============================BORRAR=====================================
                model_id   = instance['id']

                # Intentamos obtener la instancia del modelo
                file = "api/data/outputs/{}.json".format(model_id )

                with open(file, encoding='utf-8') as fh:
                    geojson = json.load(fh)
                
                instance['c_total'] = round(geojson['propierties']['c_total'])
                instance['c_camion'] = geojson['propierties']['c_camiones']
                instance['c_km'] = round(geojson['propierties']['km_total'],2)
                instance['costo_real'] = round(geojson['propierties']['costo_real'])
                instance['shifts'] = len(geojson['propierties']['shifts_with_tours'])


                #============================================================================   
                models.append(instance)


        # Devolver una respuesta con status 200
        return Response({'response':models}, status=200)

    #GET 
    def retrieve(self, request, *args, **kwargs):
        
        self.serializer_class = modelosSerializaer

        instance_id = kwargs.get('pk')

        instance_modelo = modelos.objects.filter(user_id=instance_id).values()

        response = {}

        instance_red = redesViales.objects.all()

        for red in instance_red:

            red_id = red.id

            response[str(red_id)] = []
                

        for instance in instance_modelo:
            
            nombre     = instance['nombre']
            residuos   = instance['residuos']
            costo      = instance['costo']
            capacidad  = instance['capacidad']
            jornada    = instance['jornada']
            frecuencia = instance['frecuencia']
            fecha      = instance['fecha']
            hora       = instance['hora']
            model_id   = instance['id']
            red_id     = instance['red_id']

            # Suponiendo que ya tienes el red_id definido
            instance_red = redesViales.objects.get(id=red_id)  # Obtenemos la instancia de redesViales

            # Ahora accedemos a las comunas asociadas
            comunas_asociadas = instance_red.comunas.all()

            

            #==============================BORRAR=====================================


            # Intentamos obtener la instancia del modelo
            file = "api/data/outputs/{}.json".format(model_id )

            with open(file, encoding='utf-8') as fh:
                geojson = json.load(fh)
            
            c = round(geojson['propierties']['c_total'])
            c_camion = geojson['propierties']['c_camiones']
            c_km = round(geojson['propierties']['km_total'],2)
            c_real = round(geojson['propierties']['costo_real'])
            shifts = len(geojson['propierties']['shifts_with_tours'])

            #============================================================================   


            comunas = []
            # Iteramos sobre las comunas asociadas para imprimir sus nombres, por ejemplo
            for comuna in comunas_asociadas:
                comunas.append({'id': comuna.id, 'nombre': comuna.nombre})
            
            parser = {
                'id'         : model_id,
                'nombre'     : nombre,
                'residuos'   : residuos,
                'costo'      : costo,
                'capacidad'  : capacidad,
                'jornada'    : jornada,
                'frecuencia' : frecuencia,
                'comuna'     : comunas,
                'fecha'      : fecha,
                'hora'       : hora,
                'red'        : red_id,
                'c_total'    : c,
                'c_camion'   : c_camion,
                'c_km'       : c_km,
                'costo_real' : c_real,
                'shifts'     : shifts

            }

            response[str(red_id)].append(parser)
        
        return Response(response)
    
    #READ MODEL
    @action(detail=False, methods=['get'], url_path='getCropByUser/(?P<id>[^/.]+)')
    def getCropByUser(self, request,id=None):

        query = modelos.objects.filter(id=id).values()

        #print(query)
        if id is not None and len(query) !=0:

            file = "api/data/outputs/{}.json".format(id)

            with open(file, encoding='utf-8') as fh:
                geojson = json.load(fh)

            response = {
                'data': geojson
            }
            

            #OBTENEMOS LOS SEGMENTOS
            # Intentamos obtener la instancia del modelo
            file = "api/data/segmentos/{}.json".format(id)

            with open(file, encoding='utf-8') as fh:
                geojson = json.load(fh)


            s = set()

            for feature in geojson['features']:
                s.add(feature['properties']['zona'])

            d = {}
            for i,v in enumerate(s):
                color = list(np.random.choice(range(256), size=3))

                d[v]='#%02x%02x%02x' % tuple(color)

            response['segmentos'] = {'id': id,
                                     'colores': d,
                                     'data': geojson}

            
            return Response(response)
        else:
            # Manejar el caso en que no se proporciona un ID
            return Response({'error': 'No se proporcionó un ID válido'}, status=400)

    #POST
    def create(self, request, pk=None):
        print('comienza')
            
        self.serializer_class = modelosSerializaer


        #Extraer datos de la request
        id         = request.data.get('data_id')
        nombre     = request.data.get('nombre') 
        residuos   = request.data.get('residuos')
        costo      = request.data.get('costo')
        capacidad  = request.data.get('capacidad')
        jornada    = request.data.get('jornada')
        frecuencia = request.data.get('frecuencia')
        fecha      = request.data.get('fecha')
        hora       = request.data.get('hora')
        input_data = request.data.get('data')
        user       = str(request.data.get('user_id'))
        red        = str(request.data.get('red_id'))


        #Generrar objeto para guardar en la BD
        inputObj = {'id'  : id, 
                    'nombre': nombre,  
                    'residuos': residuos,
                    'costo': costo,
                    'capacidad': capacidad,
                    'jornada': jornada,
                    'frecuencia': frecuencia,
                    'fecha': fecha,
                    'hora': hora,
                    'user': user,
                    'red': red}

        #Verificar existencia o duplicidad en la BD
        name_filter = modelos.objects.filter(user_id=user,nombre=nombre)

        if len(name_filter) != 0:
            return Response({'code': 'MODEL_NAME_ALREADY_EXIST'}, status=status.HTTP_412_PRECONDITION_FAILED)


        instance_modelo = modelos.objects.filter(user_id=user, 
                                                 red_id=red, 
                                                 residuos=residuos,
                                                 costo=costo,
                                                 capacidad=capacidad,
                                                 jornada=jornada,
                                                 frecuencia=frecuencia).values()

        # Si todos los atributos coinciden, has encontrado la instancia correspondiente
        if len(instance_modelo) != 0:
                return Response({'code': 'MODEL_ALREADY_EXIST'},status=status.HTTP_412_PRECONDITION_FAILED)
        
        
        #Generara Planificaciones
        try:    
            #============================[ EEJECUTAR CODIGO EN C ]=========================
            
            #Preparar segemntos
            red_instance = redesViales.objects.get(id=red)
            #Fijo 2 días (cambiar)
            
            '''if red_instance.nombre == 'Cerro Navia':
                p = 'CN{}'.format(frecuencia)
            elif(red_instance.nombre == 'Quinta Normal'):
                p = 'QN{}'.format(frecuencia)
            else:
                p = 'QNCN{}'.format(frecuencia)'''

    
            p = 'archivo_segmetación'
            # Obtener la ruta absoluta del archivo ejecutable a.out
            ruta_ejecutable = os.path.join(os.path.dirname(__file__), 'data/scripts/segmentación', 'main')


            # Argumentos adicionales para el ejecutable
            #Nombre, Capacidad, Días de recolección, porcentaje de generación, costo, nombre instancia, v obl, v opc.
            argumentos = ['api/data/redes/{}.json'.format(red_instance.nombre.replace(" ","")), str(float(capacidad)*1000), str(frecuencia), str(residuos), str(costo), id, p, str(2.7), str(16.6)]

            # Ejecutar el ejecutable de C con argumentos
            print('comenzando segmentacióm...')
            p = subprocess.run([ruta_ejecutable] + argumentos, capture_output=False)

            #=============================================================================

             #-------Extraemos datos de la instancia generada en el bloque anterior--------

            file = "api/data/outputs/{}.json".format(id)

            with open(file, encoding='utf-8') as fh:
                geojson = json.load(fh)
                
            distancias = geojson['propierties']['distancias']

            tiempos = geojson['propierties']['tiempos']

            for t in tiempos:
                if t> (float(jornada)-1)*60*60:
                    raise ValueError(f"Error: El tiempo {t/3600} segundos excede el límite de {jornada} horas.")

            tiempos = [i/3600 for i in tiempos]

            n_rutas = geojson['propierties']['c_rutas']

            #=======================[ EEJECUTAR CODIGO DE ALEJANDRO ]=====================

            #--------------------------Generar listas de centroides---------------------
            file = "api/data/segmentos/{}.json".format(id)

            cent_list = []
            with open(file, encoding='utf-8') as fh:
                gdf = gpd.read_file(file)

                for i in range(n_rutas):
                    gdf_filtrado = gdf[gdf['zona'] == 'S{}'.format(i+1)]

                    poligono = gdf_filtrado.unary_union

                    centroide = poligono.centroid

                    # Convierte el centroide a un diccionario GeoJSON
                    centroide_geojson = mapping(centroide)
                    
                    pos = geo_to_rect(centroide_geojson['coordinates'][1], centroide_geojson['coordinates'][0])

                    cent_list.append(pos)

            x = [i[0] for i in cent_list]
            y = [i[1] for i in cent_list]

            #-------------------------Establecemos Parámetros-----------------------------
            #Coordenadas KDM
            KDM = (341714.2, 6306163.2)

            #Coordenadas Cerro Navia
            CN_GARAGE = (340477.7,6311242.1)

            #Coordenadas QN
            QN_GARAGE = (341812.2, 6287094.1)

            #APLICAR LÓGICA SEGÚN RED VIAL A CONSIDERAR (GARAGE DE CN POR DEFECTO)
            if red_instance.nombre == 'Cerro Navia':
                GARAGE = CN_GARAGE
            elif(red_instance.nombre == 'Quinta Normal'):
                GARAGE = QN_GARAGE
            else:
                GARAGE = CN_GARAGE

            x.append(GARAGE[0])
            y.append(GARAGE[1])

            x.append(KDM[0])
            y.append(KDM[1])

            resultado = subprocess.check_output(['python', 'api/data/scripts/Shifts.py', str(n_rutas), str(x), str(y), str(tiempos), str(distancias), str(costo), str(frecuencia)])
            # Decodificar la salida para convertirla a una cadena de texto
            resultado_str = eval(resultado.decode('utf-8'))

            if len(resultado_str['shifts_with_tours']) == 0:
                raise ValueError("No hay posibles combinaciones")

            #Actualizar datos del geojson
            geojson["propierties"]['shifts_with_tours'] = resultado_str['shifts_with_tours']
            geojson["propierties"]['time_per_shifts'] = resultado_str['time_per_shifts']
            geojson["propierties"]['costo_real'] = resultado_str['cost']
            geojson["propierties"]['c_camiones'] = resultado_str['n_camiones']
  
            file = "api/data/outputs/{}.json".format(id)
            with open(file, 'w') as archivo:
                json.dump(geojson, archivo, indent=4) 
            #=============================================================================

            serializer = modelosSerializaer(data=inputObj)

            if serializer.is_valid():
                serializer.save()
                response = Response(
                    {'title': 'ÉXITO', 'text': 'Optimización realizada satisfactoriamente.', 'type': 'success'},
                    status=200
                )

            else:
                response = Response(
                    { 'title': 'ERROR', 'text': 'Hubo un problema con la solicitud.', 'type': 'error' },
                    status=400
                )

            #Borrar Archivos temporales
            if os.path.exists("api/data/temp/"):
                rmtree("api/data/temp/")  # Elimina la carpeta y todo su contenido
                os.makedirs("api/data/temp/")  # Crea la carpeta nuevamente vacía

            return response 

        except Exception as error:
            print('error:',error)

            #Borrar output 
            if os.path.exists("api/data/outputs/{}.json".format(id)):
                os.remove("api/data/outputs/{}.json".format(id))

            #Borrar segementos
            if os.path.exists("api/data/segmentos/{}.json".format(id)):
                os.remove("api/data/segmentos/{}.json".format(id))
            
            #Borrar Archivos temporales
            if os.path.exists("api/data/temp/"):
                rmtree("api/data/temp/")  # Elimina la carpeta y todo su contenido
                os.makedirs("api/data/temp/")  # Crea la carpeta nuevamente vacía


            response = Response(
                    { 'title': 'ERROR', 'text': 'Hubo un problema con la solicitud.', 'type': 'error' },
                   status=status.HTTP_400_BAD_REQUEST
                )

            return response 

    #DELETE
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        
        #id del usuario
        model_id = instance.id

        os.remove("api/data/outputs/{}.json".format(model_id))
        os.remove("api/data/segmentos/{}.json".format(model_id))

        modelos.objects.filter(id=model_id).delete()

        self.perform_destroy(instance)

        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_destroy(self, instance):
        instance.delete()     
    
class comunasViewSet(viewsets.ModelViewSet):

    serializer_class = comunasSerializaer
    queryset = comunas.objects.all()

    def list(self, request):
        queryset = comunas.objects.all()
        serializer = comunasSerializaer(queryset, many=True)
        return Response(serializer.data)   

class usuariosViewSet(viewsets.ModelViewSet):

    serializer_class = usuariosSerializaer
    queryset = usuarios.objects.all()


    #POST
    def create(self, request):

        self.serializer_class = usuariosSerializaer

        request_data = request.data

        pwd = request_data['password'].encode('utf-8')

        sal = bcrypt.gensalt()

        encrypt = bcrypt.hashpw(pwd, sal) 

        print(type(encrypt))

        serializer = usuariosSerializaer(data={
                                            "id": request_data['id'],
                                            "username": request_data['username'],
                                            "password": str(encrypt),
                                            "nombre": request_data['nombre'],
                                            "apellido": request_data['apellido'],
                                            "correo": request_data['correo'],
                                            "admin": request_data['admin']
                                        })

        if serializer.is_valid():
            serializer.save()
            response_data = serializer.data  # Acceder a los datos serializados

            response = {
                'message': 'Usuario creado exitosamente'
            }

        else:
            response = {
                'message': 'Invalid data'
            }

        return Response(response) 

    #DELETE
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        
        #id del usuario
        user_id = instance.id

        #Listar modelos por el usuario
        model_obj= modelos.objects.filter(user_id=user_id).values()

        #Borrar datos de los modelos que se encuentran fisico en el backend
        for i in model_obj:
            model_id = i['id']

            os.remove("api/data/outputs/{}.json".format(model_id))

            modelos.objects.filter(id=model_id).delete()

        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_destroy(self, instance):
        instance.delete()

    #AUTH SERVICES
    @action(detail=False, methods=['get'], url_path='autenticateUser/(?P<username>[a-zA-Z0-9_@.]+)')
    def autenticateUser(self, request,username=None):
        
        query = usuarios.objects.filter(username=username).values()

        if id is not None and len(query) !=0:  
            return Response({'id':query[0]['id'], 'username':query[0]['username'], 'admin':query[0]['admin']})
        
        else:
            # Manejar el caso en que no se proporciona un ID
            return Response({'code': 'USER_NOT_FOUND'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'], url_path='autenticatePassword/(?P<username>[a-zA-Z0-9_@.]+)/(?P<password>[a-zA-Z0-9_@.]+)')
    def autenticatePassword(self, request,username=None, password=None):
        
        query = usuarios.objects.filter(username=username).values()

        pwd = ast.literal_eval(query[0]['password'])

        a = bcrypt.checkpw(bytes(password,'utf-8'), pwd)

        return Response({'password': a}, status=200)

@api_view(['POST'])
def procesarCostos(request):
    if request.method == 'POST':

        # inputs from the logitic part
        id = request.data['id']
        data = request.data['data']

        cost = []
        dist = []
        label = []

        for d in data:
            cost.append(d['costo'])
            dist.append(d['distancia'])

            if(d['label'] != 'colaborativo'):
                label.append(d['label'])

        resultado = subprocess.check_output(['python', 'api/data/scripts/Allocation.py', str(cost), str(dist), str(id)])

        # Decodificar la salida para convertirla a una cadena de texto
        resultado_str = eval(resultado.decode('utf-8'))


        perf = []
        _type = ['General', 'Costo per cápita',  'Costo por prod. per cápita', 'Ahorro porcentual', 'Costo como prop. del ingreso por hogar']
        for i, v in enumerate(resultado_str):

            if i != 0:
                v = [i/sum(v) for i in v]

            perf.append(
                {
                    "id": i,
                    "values": v,
                    "labels": label,
                    "type": _type[i]
                }
            )

        
        return Response({'performance': perf},status=200)

