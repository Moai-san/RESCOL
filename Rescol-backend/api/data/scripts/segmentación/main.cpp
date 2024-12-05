#include <stdio.h>
#include <stdlib.h>
#include <iostream>
#include <fstream>
#include <jsoncpp/json/json.h>
#include <algorithm>

#include "global.h"

using namespace std;

double distancia_segmento(vector<calle*> segmento){
    double distancia = 0.0;
    for(calle* c : segmento){
        distancia +=c->distancia;
    }
    return distancia;
}

int main(int argc, char *argv[]){
    /* Variables */
    bool debug = false;
    bool generar_rutas = true;
    int num_calles;
    int num_pasajes;
    int num_nodos_totales;
    double capacidad_camiones;
    double porcentaje_residuos;
    double velocidad_obligatoria;
    double velocidad_opcional;
    int costo_transporte;
    int dias_basura;
    string id_archivo;
    string nombre_instancia;
    double basura_total = 0.0;
    Json::Value data;
    vector<calle*> lista;
    vector<calle*> agregadas;
    vector<vector<calle*>> seg_finales;

    /* Verificar cantidad de parametros ingresados */
    if(argc < 6){
        printf("Utilizar ./seg_rescol nombre_archivo capacidad_camion dias_basura porcentaje_residuos costo_transporte id_archivo_final\n");
        exit(1);
    }

    /* Verificar capacidad del camion */
    capacidad_camiones = (double) atof(argv[2]);
    if(!(capacidad_camiones == 6500.0 || capacidad_camiones == 10000.0 || capacidad_camiones == 12500.0)){
        printf("Ingresar una capacidad de camion valida: 6500.0 | 10000.0 | 12500.0\n");
        exit(1);
    }
    if (debug) printf("Capacidad camiones: %.1f\n",capacidad_camiones);

    /* Verificar dias de basura */
    dias_basura = (int) atoi(argv[3]);
    if(dias_basura < 1 || dias_basura > 3){
        printf("Ingresar una cantidad de dias valida: 1 | 2 | 3\n");
        exit(1);
    }
    if (debug) printf("Dias de basura: %d\n",dias_basura);

    /* Verificar porcentaje residuos */
    porcentaje_residuos = (double) atof(argv[4]);
    if((porcentaje_residuos < -2.0 || porcentaje_residuos > 2.0)){
        printf("Ingresar un porcentaje de residuos valido: -2.0 <= % <= 2.0\n");
        exit(1);
    }
    if (debug) printf("Porcentaje de residuos: %.1f\n",porcentaje_residuos);

    /* Verificar costo transporte */
    costo_transporte = (int) atoi(argv[5]);
    if((costo_transporte < 100 || costo_transporte > 2000)){
        printf("Ingresar un costo de transporte valido: 100 <= % <= 2000\n");
        exit(1);
    }
    if (debug) printf("Costo de transporte: %d\n",costo_transporte);

    /* Verificar id archivo */
    id_archivo = argv[6];
    if (debug) printf("Id archivo: %s\n",id_archivo.c_str());
    
    /* Apertura del archivo .json */
    if (debug) printf("Nombre de archivo leido: %s\n", argv[1]);
    ifstream file(argv[1], ifstream::binary);
    file >> data;
    data = data["features"];
    num_calles = data.size();
    if (debug) printf("Cantidad de datos archivo: %d\n",num_calles);

    /* Verificar nombre_instancia */
    nombre_instancia = argv[7];
    if (debug) printf("Nombre Instancia: %s\n",nombre_instancia.c_str());

    velocidad_obligatoria = (double) atof(argv[8]);
    if (debug) printf("Velocidad obligatoria: %.2f [m/s]\n", velocidad_obligatoria);

    velocidad_opcional = (double) atof(argv[9]);
    if (debug) printf("Velocidad opcional: %.2f [m/s]\n", velocidad_opcional);

    /* Lectura de la informacion */
    for(int k=0;k<num_calles;k++){
        calle *c = new calle;

        c->id = data[k]["id"].asString();
        c->nombre = data[k]["properties"]["NOMBRE_VIA"].asString();
        c->zona = data[k]["properties"]["ZONAS"].asString();
        c->i = data[k]["properties"]["i"].asString();
        c->j = data[k]["properties"]["j"].asString();
        c->id_arco = data[k]["properties"]["ID"].asInt();
        c->sentido = data[k]["properties"]["SENTIDO"].asInt();
        c->distancia = data[k]["properties"]["DISTANCIA"].asDouble();
        c->basura = data[k]["properties"]["RESIDUOS"].asDouble() * dias_basura;

        int num_coords = data[k]["geometry"]["coordinates"].size();
        for(int n=0;n<num_coords;n++){
            coords cd;
            cd.lat = data[k]["geometry"]["coordinates"][n][1].asDouble();
            cd.lon = data[k]["geometry"]["coordinates"][n][0].asDouble();
            c->lista_coords.emplace_back(cd);
        }
        
        c->inicial = c->lista_coords[0];
        c->final = c->lista_coords[num_coords-1];

        c->medio.lat = (c->inicial.lat + c->final.lat)/2;
        c->medio.lon = (c->inicial.lon + c->final.lon)/2;

        c->segmento = -1;
        c->segmento_extraido = -1;

        lista.emplace_back(c);
    }

    if (debug) printf("Cantidad de calles leidas: %ld\n",lista.size());

    /* Se realizan dos iteraciones de eliminacion de pasajes */
    vector<calle*> pasajes;
    vector<pair<string,calle*>> pasajes_eliminados;
    for(int iter=0;iter<2;iter++){
        /* Identificar los nodos asociados a las calles */
        vector<pair<string,int>> nodos_calles;
        nodos_segmento(lista,nodos_calles);
        int num_nodos = nodos_calles.size();
        //if (debug) printf("Cantidad de nodos identificados: %d\n", num_nodos);
        /* Eliminar pasajes */
        for(int i=0;i<num_nodos;i++){
            if(nodos_calles[i].second == 1){
                string nodo = nodos_calles[i].first;
                string nodo_asociado = "";
                auto it = find_if(lista.begin(),lista.end(),[nodo](calle* c){return c->i == nodo || c->j == nodo;});
                int pos = distance(lista.begin(),it);
                if(lista[pos]->i == nodo){
                    nodo_asociado = lista[pos]->j;
                }else{
                    nodo_asociado = lista[pos]->i;
                }
                pasajes_eliminados.emplace_back(make_pair(nodo_asociado,lista[pos]));
                pasajes.emplace_back(lista[pos]);
                lista.erase(lista.begin()+pos);
            }
        }
        //if (debug) printf("Cantidad de pasajes eliminados: %ld\n",pasajes_eliminados.size());
    }

    vector<pair<string,int>> nodos_calles;
    nodos_segmento(lista,nodos_calles);
    num_pasajes = pasajes_eliminados.size();
    for(int i=0;i<num_pasajes;i++){
        string nodo = pasajes_eliminados[i].first;
        auto it = find_if(nodos_calles.begin(),nodos_calles.end(),[nodo](auto element){return element.first == nodo;});
        if(it == nodos_calles.end()){
            auto it2 = find_if(pasajes_eliminados.begin(),pasajes_eliminados.end(),[nodo](pair<string,calle*> el){return nodo == el.second->i || nodo == el.second->j ;});
            if(it2 != pasajes_eliminados.end()){
                int pos = distance(pasajes_eliminados.begin(),it2);
                pasajes_eliminados[pos].second->basura += pasajes_eliminados[i].second->basura;
            }
        }
    }

    nodos_calles.clear();
    nodos_segmento(lista,nodos_calles);
    num_pasajes = pasajes_eliminados.size();
    for(int i=0;i<num_pasajes;i++){
        string nodo = pasajes_eliminados[i].first;
        /* Identificar los nodos asociados a las calles */
        auto it = find_if(nodos_calles.begin(),nodos_calles.end(),[nodo](auto element){return element.first == nodo;});
        if(it != nodos_calles.end()){
            auto it2 = find_if(lista.begin(),lista.end(),[nodo](calle* el){return nodo == el->i || nodo == el->j ;});
            if(it2 != lista.end()){
                int pos = distance(lista.begin(),it2);
                lista[pos]->basura += pasajes_eliminados[i].second->basura;
            }
        }
    }

    //escribir_archivo(pasajes,"Pasajes_eliminados.json");
    vector<pair<string,coords>> coordenadas;
    vector<pair<string,pair<double,double>>> distancias_nodos;
    coordenadas_nodos(lista,coordenadas);
    calcular_distancias(coordenadas, distancias_nodos);

    /* Identificar nodos del segmento y calles asociadas */
    vector<pair<pair<string,int>,vector<calle*>>> lista_nodos;
    calles_nodos(lista,lista_nodos);
    num_nodos_totales = lista_nodos.size();

    if (debug) printf("basura total: %.1f\n", basura_segmento(lista));
    seg_finales.emplace_back(lista);

    /* Realizar segmentacion */
    double mejor_seg = -INF;
    double m_i = 0;
    double m_j = 0;
    double m_k = 0;
    for(int i=2;i<10;i++){
        for(int j=2;j<10;j++){
            for(int k=2;k<6;k++){
                double actual_seg = calcular_parametros(seg_finales,i,j,k);
                if(actual_seg > mejor_seg){
                    mejor_seg = actual_seg;
                    m_i = i;
                    m_j = j;
                    m_k = k;
                }
            }
        }
    }
    //cout << "Cortes escogidos: " << m_i << "-" << m_j << "-"<< m_k << endl;

    segmentar(seg_finales,1,m_i);
    segmentar(seg_finales,1,m_j);
    segmentar(seg_finales,1,m_k);

    segmentar(seg_finales,10,2);
    int num_segm = seg_finales.size();
    for(int i=0;i<num_segm;i++){
        if(basura_segmento(seg_finales[i]) > capacidad_camiones){
            printf("El segmento %d sobrepasa la capacidad\n", i);
        }
    }


    vector<vector<calle*>> seg_finales_opcionales(num_segm,vector<calle*>());

    /* Eliminar calles no conectadas */
    vector<calle*> calles_noconectadas;
    for(int i=0;i<num_segm;i++){
        int num_calles = seg_finales[i].size();
        for(int j=0; j<num_calles; j++){
            seg_finales[i][j]->segmento = i;
            if(!conecta(seg_finales[i],seg_finales[i][j])){
                seg_finales[i][j]->segmento_extraido = i;
                calles_noconectadas.emplace_back(seg_finales[i][j]);
                seg_finales[i].erase(seg_finales[i].begin()+j);
                num_calles--;
                j--;
            }
        }
    }

    //if (debug) printf("Cantidad de calles no conectadas %ld\n", calles_noconectadas.size());

    /* Reparacion tipo I */
    for(int i=0;i<num_segm;i++){
        vector<pair<string,int>> nodos_seg;
        nodos_segmento(seg_finales[i],nodos_seg);
        int num_nodos = nodos_seg.size();
        for(int j=0;j<num_nodos;j++){
            if(nodos_seg[j].second == 1){
                string nodo = nodos_seg[j].first;
                auto it = find_if(lista_nodos.begin(),lista_nodos.end(),[nodo](pair<pair<string,int>,vector<calle*>> element){return element.first.first == nodo;});
                if(it != lista_nodos.end()){
                    for(auto & c: (*it).second){
                        string nodo_seleccionado;
                        if(c->i == nodo){
                            nodo_seleccionado = c->j;
                        }else{
                            nodo_seleccionado = c->i;
                        }
                        auto it2 = find_if(nodos_seg.begin(),nodos_seg.end(),[nodo_seleccionado](pair<string,int> element){return element.first == nodo_seleccionado;});
                        if(it2 != nodos_seg.end()){
                            if(c->segmento != i){
                                string inicial = c->i;
                                string final = c->j;
                                auto it3 = find_if(calles_noconectadas.begin(),calles_noconectadas.end(),[inicial,final](calle* &e){return (e->i == inicial && e->j == final)||(e->j == inicial && e->i == final);});
                                if(it3 == calles_noconectadas.end()){
                                    c->segmento_extraido = i;
                                    seg_finales_opcionales[i].emplace_back(c);
                                }else{
                                    c->segmento = i;
                                    calles_noconectadas.erase(calles_noconectadas.begin()+distance(calles_noconectadas.begin(),it3));
                                    seg_finales[i].emplace_back(c);
                                }
                                agregadas.emplace_back(c);
                            }
                        }
                    }
                }
            }
        }
        nodos_seg.clear();
    }
    //if (debug) printf("Cantidad de calles agregadas reparacion tipo I: %ld\n", agregadas.size());
    //escribir_archivo(agregadas,"Calles_agregadas.json");

    /* Asignar calles no conectadas a un segmento */
    for(auto c: calles_noconectadas){
        bool asignada = false;
        for(int i=0;i<num_segm;i++){
            if(conecta(seg_finales[i],c) && !asignada){
                asignada = true;
                seg_finales[i].emplace_back(c);
            }
        }
    }

    vector<vector<pair<string,int>>> lista_nodos_seg;
    for(int i=0;i<num_segm;i++){
        vector<pair<string,int>> nodos_seg;
        nodos_segmento(seg_finales[i],nodos_seg);
        lista_nodos_seg.emplace_back(nodos_seg);
    }

    vector<vector<pair<string,bool>>> lista_nodos_visitados; //Conectividad Inicial -> Todos;
    vector<vector<pair<string,bool>>> lista_nodos_visitados_inverso; //Conectividad Todos -> Inicial;
    for(int i=0;i<num_segm;i++){
        int num_nodos = lista_nodos_seg[i].size();
        lista_nodos_visitados.emplace_back(vector<pair<string,bool>>());
        lista_nodos_visitados_inverso.emplace_back(vector<pair<string,bool>>());
        for(int j=0;j<num_nodos;j++){
            pair<string,bool> nodo = make_pair(lista_nodos_seg[i][j].first,false);
            lista_nodos_visitados[i].emplace_back(nodo);
            lista_nodos_visitados_inverso[i].emplace_back(nodo);
        }
    }

    /* Crear lista de adyacencia de los nodos en base al sentido de las calles. */
    vector<vector<pair<string,vector<string>>>> lista_nodos_vecinos; //Conectividad Inicial -> Todos;
    vector<vector<pair<string,vector<string>>>> lista_nodos_vecinos_inverso; //Conectividad Todos -> Inicial;
    for(int i=0;i<num_segm;i++){
        lista_nodos_vecinos.emplace_back(vector<pair<string,vector<string>>>());
        lista_nodos_vecinos_inverso.emplace_back(vector<pair<string,vector<string>>>());
        int num_nodos = lista_nodos_seg[i].size();
        for(int j=0;j<num_nodos;j++){
            pair<string,vector<string>> nodo = make_pair(lista_nodos_seg[i][j].first,vector<string>());
            lista_nodos_vecinos[i].emplace_back(nodo);
            lista_nodos_vecinos_inverso[i].emplace_back(nodo);
        }
        crear_lista_adyacencia(seg_finales[i],lista_nodos_vecinos[i],true);
        crear_lista_adyacencia(seg_finales[i],lista_nodos_vecinos_inverso[i],false);
    }

    for(int i=0;i<num_segm;i++){
        //if (debug) printf("Nodo inicial seg %d: %s\n",i,seg_finales[i][0]->i.c_str());
        DFS(seg_finales[i][0]->i,lista_nodos_vecinos[i], lista_nodos_visitados[i]);
        DFS(seg_finales[i][0]->i,lista_nodos_vecinos_inverso[i],lista_nodos_visitados_inverso[i]);

        auto it = find_if(lista_nodos_visitados[i].begin(),lista_nodos_visitados[i].end(),[](const pair<string, bool>&element){return element.second == false;});
        if(it != lista_nodos_visitados[i].end()){
            //if (debug) printf("Segmento %d: No se puede llegar a todos los nodos\n",i);
            int num_nodos_visitados = lista_nodos_visitados[i].size();
            for(int j=0;j<num_nodos_visitados;j++){
                if(lista_nodos_visitados[i][j].second == false){
                    //if (debug) printf("%s-",lista_nodos_visitados[i][j].first.c_str());
                    vector<calle*> ListaAgregar = extender_nodo(lista_nodos_visitados[i][j].first,lista_nodos,lista_nodos_visitados[i]);
                    for(auto calle: ListaAgregar){
                        lista_nodos_visitados[i].emplace_back(make_pair(calle->i,true));
                        lista_nodos_visitados[i].emplace_back(make_pair(calle->j,true));
                        seg_finales_opcionales[i].emplace_back(calle);
                    }
                }
            }
            //if (debug) printf("\n");
        }else{
            //if (debug) printf("Segmento %d: Si se puede llegar a todos los nodos :D\n",i);
        }

        auto it2 = find_if(lista_nodos_visitados_inverso[i].begin(),lista_nodos_visitados_inverso[i].end(),[](const pair<string, bool>&element){return element.second == false;});
        if(it2 != lista_nodos_visitados_inverso[i].end()){
            //if (debug) printf("Segmento %d: No todos los nodos pueden llegar al inicial\n",i);
            int num_nodos_visitados = lista_nodos_visitados_inverso[i].size();
            for(int j=0;j<num_nodos_visitados;j++){
                if(lista_nodos_visitados_inverso[i][j].second == false){
                    //if (debug) printf("%s-",lista_nodos_visitados_inverso[i][j].first.c_str());
                    vector<calle*> ListaAgregar = extender_nodo_sumidero(lista_nodos_visitados_inverso[i][j].first,lista_nodos,lista_nodos_visitados_inverso[i]);
                    for(auto calle: ListaAgregar){
                        lista_nodos_visitados_inverso[i].emplace_back(make_pair(calle->i,true));
                        lista_nodos_visitados_inverso[i].emplace_back(make_pair(calle->j,true));
                        seg_finales_opcionales[i].emplace_back(calle);
                    }
                }
            }
            //if (debug) printf("\n");
        }else{
            //if (debug) printf("Segmento %d: Todos los nodos pueden llegar al inicial :D\n",i);
        }

        set<calle*> s1(seg_finales_opcionales[i].begin(),seg_finales_opcionales[i].end());
        set<calle*> s2(seg_finales[i].begin(),seg_finales[i].end());

        seg_finales_opcionales[i].assign(s1.begin(),s1.end());
        seg_finales[i].assign(s2.begin(),s2.end());

        int tam = seg_finales_opcionales[i].size();
        for(int j=0;j<tam;j++){
            string id = seg_finales_opcionales[i][j]->id;
            auto it = find_if(seg_finales[i].begin(),seg_finales[i].end(),[id](calle* &e){return e->id == id;});
            if(it != seg_finales[i].end()){
                seg_finales_opcionales[i].erase(seg_finales_opcionales[i].begin()+j);
                tam--;
                j--;
            }
        }
    }

    if (debug) printf("Cantidad de segmentos finales: %d\n", num_segm);
    for(int i=0;i<num_segm;i++){
        if (debug) printf("basura seg %d: %.1f\n",i, basura_segmento(seg_finales[i]));
        int size_seg = seg_finales[i].size();
        for(int j=0;j<size_seg;j++){
            if(seg_finales[i][j]->basura == 0.0 || seg_finales[i][j]->basura == 0){
                seg_finales_opcionales[i].emplace_back(seg_finales[i][j]);
                seg_finales[i].erase(seg_finales[i].begin()+j);
                size_seg--;
                j--;
            }
        }
        //escribir_archivo(seg_finales[i],"SEG_"+to_string(i)+".json");
        //escribir_archivo(seg_finales_opcionales[i],"Opcionales_seg_"+to_string(i)+".json");
        escribir_instancia(seg_finales[i],seg_finales_opcionales[i],distancias_nodos,nombre_instancia+"_Seg_"+to_string(i)+".txt","Seg_"+to_string(i));
    }
    vector<vector<calle*>> contorno;
    vector<vector<calle*>> seg_finales_comprobacion(num_segm,vector<calle*>());
    for(int i=0;i<num_segm;i++){
        lista_nodos_vecinos[i].clear();
        lista_nodos_vecinos_inverso[i].clear();
        lista_nodos_visitados[i].clear();
        lista_nodos_visitados_inverso[i].clear();
        lista_nodos_seg[i].clear();
        for(auto c:seg_finales[i]){
            seg_finales_comprobacion[i].emplace_back(c);
            c->zona="S"+to_string(i+1);
        }
        for(auto c:seg_finales_opcionales[i]){
            seg_finales_comprobacion[i].emplace_back(c);
            c->zona="S"+to_string(i+1);
        }
        nodos_segmento(seg_finales_comprobacion[i],lista_nodos_seg[i]);
        int num_nodos = lista_nodos_seg[i].size();
        for(int j=0;j<num_nodos;j++){
            pair<string,vector<string>> nodo1 = make_pair(lista_nodos_seg[i][j].first,vector<string>());
            lista_nodos_vecinos[i].emplace_back(nodo1);
            lista_nodos_vecinos_inverso[i].emplace_back(nodo1);
            pair<string,bool> nodo2 = make_pair(lista_nodos_seg[i][j].first,false);
            lista_nodos_visitados[i].emplace_back(nodo2);
            lista_nodos_visitados_inverso[i].emplace_back(nodo2);
        }
        crear_lista_adyacencia(seg_finales_comprobacion[i],lista_nodos_vecinos[i],true);
        crear_lista_adyacencia(seg_finales_comprobacion[i],lista_nodos_vecinos_inverso[i],false);

        DFS(seg_finales_comprobacion[i][0]->i,lista_nodos_vecinos[i], lista_nodos_visitados[i]);
        DFS(seg_finales_comprobacion[i][0]->i,lista_nodos_vecinos_inverso[i],lista_nodos_visitados_inverso[i]);

        if (debug) printf("distancia seg %d: %.1f\n",i, distancia_segmento(seg_finales_comprobacion[i]));

        auto it = find_if(lista_nodos_visitados[i].begin(),lista_nodos_visitados[i].end(),[](const pair<string, bool>&element){return element.second == false;});
        if(it != lista_nodos_visitados[i].end()){
            if (debug) printf("Segmento %d: No se puede llegar a todos los nodos\n",i);
            int num_nodos_visitados = lista_nodos_visitados[i].size();
            for(int j=0;j<num_nodos_visitados;j++){
                if(lista_nodos_visitados[i][j].second == false){
                    //if (debug) printf("%s-",lista_nodos_visitados[i][j].first.c_str());
                }
            }
            //if (debug) printf("\n");
        }else{
            // if (debug) printf("Segmento %d: Si se puede llegar a todos los nodos :D\n",i);
        }
        auto it2 = find_if(lista_nodos_visitados_inverso[i].begin(),lista_nodos_visitados_inverso[i].end(),[](const pair<string, bool>&element){return element.second == false;});
        if(it2 != lista_nodos_visitados_inverso[i].end()){
            if (debug) printf("Segmento %d: No todos los nodos pueden llegar al inicial\n",i);
            int num_nodos_visitados = lista_nodos_visitados_inverso[i].size();
            for(int j=0;j<num_nodos_visitados;j++){
                if(lista_nodos_visitados_inverso[i][j].second == false){
                    //if (debug) printf("%s-",lista_nodos_visitados_inverso[i][j].first.c_str());
                }
            }
            //if (debug) printf("\n");
        }else{
            // if (debug) printf("Segmento %d: Todos los nodos pueden llegar al inicial :D\n",i);
        }
    }
    set<calle*> zona_completa;
    vector<calle*> zona_completa_json;
    for(int i=0;i<num_segm;i++){
        //escribir_archivo(seg_finales_comprobacion[i],"Final_"+to_string(i)+".json");
        for(auto c : seg_finales_comprobacion[i]){
            zona_completa.emplace(c);
        }
    }
    zona_completa_json.assign(zona_completa.begin(),zona_completa.end());
    escribir_archivo(zona_completa_json,id_archivo+".json");

    if(generar_rutas){
        ofstream rutesFile("api/data/outputs/"+id_archivo+".json");
        Json::Value root;
        Json::Value properties;
        Json::Value routes(Json::arrayValue);
        properties["c_rutas"] = num_segm;
        root["propierties"] = properties;
        root["routes"] = routes;
        Json::StyledWriter styledWriter;
        rutesFile << styledWriter.write(root);
        rutesFile.close();

        vector<double> kilometros_segmentos;
        double kilometros_totales = 0.0;
        vector<double> tiempos;
        vector<double> basura_finales;
        
        for(int i=0;i<num_segm;i++){
            double tiempo = 0.0;
            double kilometros = 0.0;
            double basura = 0.0;
            string parametros = "--metodo 0 --num-hormigas 11 --salida-dijkstra --beta0 --alfa 3.67 --rho 0.07 --tau-as 1.3 --valor-limitador 4 --epocas 1 --valor-sin-nuevas-visitas 1 --usar-tiempo --tiempo-max 2  --silence false --dir-salida ./api/data/temp ";
            string salida = "--prefijo-salida "+nombre_instancia+ "_Seg_" + to_string(i) + " --rescol";
            string comando = "./api/data/scripts/rutas/RESCOL api/data/temp/"+nombre_instancia+"_Seg_" + to_string(i) + ".txt " + parametros + salida + "> out.txt";

            cout << comando << endl;
            if(system(comando.c_str())==0){
                //if (debug) printf("Ruta %d generada con exito!\n",i);
                vector<pair<calle*,int>> lista_orden;
                leer_solucion(seg_finales[i],seg_finales_opcionales[i],pasajes_eliminados,lista_orden,nombre_instancia+"_Seg_"+to_string(i)+"_camino.txt");
                escribir_respuesta(lista_orden, kilometros,tiempo,basura,velocidad_obligatoria,velocidad_opcional,id_archivo + ".json");
                tiempos.emplace_back(tiempo);
                kilometros_segmentos.emplace_back(kilometros);
                basura_finales.emplace_back(basura);
            }else{
                if (debug) printf("Error al generar ruta %d :c\n",i);
                tiempos.emplace_back(tiempo);
                kilometros_segmentos.emplace_back(kilometros);
            }
            kilometros_totales+= kilometros;
        }

        ifstream File("api/data/outputs/"+id_archivo+".json");
        Json::Value root2;
        File >> root2;
        File.close();
        Json::Value tiemposJSON(Json::arrayValue);
        Json::Value kilometrosJSON(Json::arrayValue);
        Json::Value costosJson(Json::arrayValue);
        Json::Value porcentajeJson(Json::arrayValue);
        Json::Value basuraJSON(Json::arrayValue);
        root2["propierties"]["km_total"] = kilometros_totales/1000;
        root2["propierties"]["c_total"] = kilometros_totales/1000 * costo_transporte;
        for(auto t : tiempos){
            tiemposJSON.append(t);
        }
        for(auto k : kilometros_segmentos){
            kilometrosJSON.append(k/1000);
            costosJson.append((k/1000)* costo_transporte);
        }
        for(auto bas : basura_finales){
            basuraJSON.append(bas);
            porcentajeJson.append((bas/capacidad_camiones) * 100);
        }
        root2["propierties"]["tiempos"] = tiemposJSON;
        root2["propierties"]["distancias"] = kilometrosJSON;
        root2["propierties"]["basura"] = basuraJSON;
        root2["propierties"]["utilidad"] = porcentajeJson;
        root2["propierties"]["costos"] = costosJson;

        for(int i=0; i< num_segm; i++){
            if (debug) {printf("seg: %d KM: %.1f Coste: %.1f Tiempo: %1.f Basura: %.1f\n",i,kilometros_segmentos[i], kilometros_segmentos[i]/1000 * costo_transporte, tiempos[i], basura_finales[i]);}
        }
        if (debug) {printf("Coste total: %.1f Kilometros totales: %.1f\n",kilometros_totales/1000 * costo_transporte, kilometros_totales);}

        ofstream LastFile("api/data/outputs/"+id_archivo+".json");

        Json::StyledWriter styledWriter2;
        LastFile << styledWriter2.write(root2);
        LastFile.close();
    }

    /* Limpieza de la memoria */
    num_calles = lista.size();
    for(int i=0;i<num_calles;i++){
        delete lista[i];
    }
    num_pasajes = pasajes.size();
    for(int i=0;i<num_pasajes;i++){
        delete pasajes[i];
    }

    return 0;
}