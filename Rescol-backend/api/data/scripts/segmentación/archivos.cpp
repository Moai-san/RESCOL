#include <iostream>
#include <fstream>
#include <jsoncpp/json/json.h>

#include "global.h"

void escribir_archivo(vector<calle*> lista, string nombre_archivo){
    int num_calles = lista.size();
    ofstream file("api/data/segmentos/" + nombre_archivo);

    Json::Value info_archivo;
    Json::Value listas(Json::arrayValue);

    info_archivo["type"] = "FeatureCollection";

    for(int i=0;i<num_calles;i++){
        Json::Value calle;

        calle["id"] = lista[i]->id;
        calle["geometry"]["type"] = "LineString";
        Json::Value lista_coords(Json::arrayValue);
        Json::Value lines(Json::arrayValue);

        int num_coords = lista[i]->lista_coords.size();
        for(int j=0;j<num_coords;j++){
            Json::Value coords(Json::arrayValue);
            coords.append(lista[i]->lista_coords[j].lon);
            coords.append(lista[i]->lista_coords[j].lat);
            lines.append(coords);
        }

        calle["type"] = "Feature";
        calle["properties"]["ID"] = lista[i]->id_arco;
        calle["properties"]["NOMBRE_VIA"] = lista[i]->nombre;
        calle["properties"]["zona"] = lista[i]->zona;
        calle["properties"]["i"] = lista[i]->i;
        calle["properties"]["j"] = lista[i]->j;
        calle["properties"]["SENTIDO"] = lista[i]->sentido;
        calle["properties"]["DISTANCIA"] = lista[i]->distancia;
        calle["properties"]["RESIDUOS"] = lista[i]->basura;
        calle["properties"]["SEGMENTO"] = lista[i]->segmento;
        calle["properties"]["SEGMENTO EXTRAIDO"] = lista[i]->segmento_extraido;
        calle["geometry"]["coordinates"] = lines;
        listas.append(calle);
    }

    info_archivo["features"] = listas;

    Json::StyledWriter styledWriter;
    file << styledWriter.write(info_archivo);
    file.close();
}

void escribir_instancia(vector<calle*> lista,vector<calle*> lista_opcional,vector<pair<string,pair<double,double>>> distancias_nodos, string nombre_archivo, string nombre_instancia){
    int cantidad_calles = lista.size(); 
    int cantidad_aristas = cantidad_calles;
    int cantidad_aristas_opcionales = lista_opcional.size();
    vector<pair<string,int>> nodos_seg;
    nodos_segmento(lista, nodos_seg);
    vector<string> Nodos;
    for(auto calle: lista){
        if(count(Nodos.begin(),Nodos.end(),calle->i)==0){
            Nodos.emplace_back(calle->i);
        }
        if(count(Nodos.begin(),Nodos.end(),calle->j)==0){
            Nodos.emplace_back(calle->i);
        }
    }
    for(auto calle: lista_opcional){
        if(count(Nodos.begin(),Nodos.end(),calle->i)==0){
            Nodos.emplace_back(calle->i);
        }
        if(count(Nodos.begin(),Nodos.end(),calle->j)==0){
            Nodos.emplace_back(calle->i);
        }
    }
    int cantidad_nodos = Nodos.size();

    ofstream file;
    file.open("api/data/temp/" + nombre_archivo);
    file << "NOMBRE : " << nombre_instancia << endl;
    file << "COMENTARIO : " << endl;
    file << "VERTICES : " << cantidad_nodos << endl;
    file << "ARISTAS_REQ : " << cantidad_aristas << endl;
    file << "ARISTAS_NOREQ : " << cantidad_aristas_opcionales << endl;
    file << "RESTRICCIONES : 0" << endl;
    file << "NODOS_INICIALES : 1" << endl;
    file << "NODOS_TERMINO : 1" << endl;
    file << "LISTA_ARISTAS_REQ :" << endl;
    for(int i=0; i<cantidad_calles;i++){
        if(lista[i]->sentido>0){
            file << "uni " << lista[i]->i << " " << lista[i]->j << " " << lista[i]->distancia << " " << "1" << endl;
        }else if (lista[i]->sentido<0){
            file << "uni " << lista[i]->j << " " << lista[i]->i << " " << lista[i]->distancia << " " << "1" << endl;
        }else{
            file << "bi " << lista[i]->i << " " << lista[i]->j << " " << lista[i]->distancia << " " << "1" << endl;
        }
    }
    file << "LISTA_ARISTAS_NOREQ :" << endl;
    for(int i=0; i<cantidad_aristas_opcionales;i++){
        if(lista_opcional[i]->sentido>0){
            file << "uni " << lista_opcional[i]->i << " " << lista_opcional[i]->j << " " << lista_opcional[i]->distancia << " " << "0" << endl;
        }else if (lista_opcional[i]->sentido<0){
            file << "uni " << lista_opcional[i]->j << " " << lista_opcional[i]->i << " " << lista_opcional[i]->distancia << " " << "0" << endl;
        }else{
            file << "bi " << lista_opcional[i]->i << " " << lista_opcional[i]->j << " " << lista_opcional[i]->distancia << " " << "0" << endl;
        }
    }
    file << "CORDENADAS_NODOS :" << endl;
    file << "RESTRICCIONES :" << endl;
    file << "NODOS_INICIALES:" << endl;
    string nodo_entrada = buscar_nodo(nodos_seg,distancias_nodos,true);
    file << nodo_entrada << endl;
    file << "NODOS_TERMINO:" << endl;
    string nodo_salida = buscar_nodo(nodos_seg,distancias_nodos,false);
    file << nodo_salida << endl;
    file.close();
}

string calcular_direccion(calle* calle, coords interseccion){
    double diflat, diflon;

    string direccion;
    if(calle->inicial == interseccion){
        diflat = interseccion.lat - calle->final.lat; 
        diflon = interseccion.lon - calle->final.lon;
    }else{
        diflat = interseccion.lat - calle->inicial.lat; 
        diflon = interseccion.lon - calle->inicial.lon;
    }

    if(abs(diflat) > abs(diflon)){
        if(diflat > 0){
            direccion = "Norte";
        }else{
            direccion = "Sur";
        }
    }else{
        if(diflon > 0){
            direccion = "Este";
        }else{
            direccion = "Oeste";
        }
    }
    
    return direccion;
}

void leer_solucion(vector<calle*> lista, vector<calle*> lista_opcionales, vector<pair<string,calle*>> &pasajes, vector<pair<calle*,int>> &lista_orden, string nombre_archivo){
    
    vector<pair<calle*,bool>> recorrido;

    for(calle* c : lista){
        recorrido.emplace_back(make_pair(c,false));
    }
    //cout << recorrido.size() << endl;

    ifstream solucion("api/data/temp/"+nombre_archivo);

    string linea;
    
    string act = "";
    string ant = "";
    getline(solucion, linea);
    act = linea;

    while(!solucion.eof()){
        getline(solucion, linea);
        if(linea == ""){
            continue;
        }
        ant = act;
        act = linea;
        auto it = find_if(recorrido.begin(),recorrido.end(),[ant,act](const pair<calle*,bool> e){return (e.first->i == ant && e.first->j == act) || (e.first->j == ant && e.first->i == act);});
        if(it != recorrido.end()){
            pair<calle*,int> aux;
            if(!(*it).second){
                if((*it).first->i == ant){
                    aux = make_pair((*it).first,1);
                }else{
                    aux = make_pair((*it).first,-1);
                }
                lista_orden.emplace_back(aux);
                recorrido[distance(recorrido.begin(),it)].second = true;
                auto it3 = find_if(pasajes.begin(),pasajes.end(),[act](const pair<string,calle*> e){return e.first == act;});
                if(it3 != pasajes.end()){
                    lista_orden.emplace_back((*it3).second,0);
                }
            }else{
                if((*it).first->i == ant){
                    aux = make_pair((*it).first,3);
                }else{
                    aux = make_pair((*it).first,-3);
                }
                lista_orden.emplace_back(aux);
            }
        }else{
            auto it2 = find_if(lista_opcionales.begin(),lista_opcionales.end(),[ant,act](const calle* e){return (e->i == ant && e->j == act) || (e->j == ant && e->i == act);});
            pair<calle*,int> aux;
            if((*it2)->i == ant){
                aux = make_pair((*it2),2);
            }else{
                aux = make_pair((*it2),-2);
            }
            lista_orden.emplace_back(aux);
        }
    }
}

void escribir_respuesta(vector<pair<calle*,int>> lista_orden, double &kilometros, double &tiempo, double &basura, double velocidad_obligatoria, double velocidad_opcional, string archivo_rutas){
    Json::Value datos_archivo;
    Json::Value rutas(Json::arrayValue);
    int id = 0;
    int size_lista = lista_orden.size();

    for(int i=0;i<size_lista;i++){
        Json::Value instruccion;
        instruccion["id"] = id;
        id++;
        calle* calle_final;
        if(i==lista_orden.size()-1){
            calle_final = lista_orden[i].first;
        }else{
            calle_final = lista_orden[i+1].first;
        }
        double velocidad;
        kilometros+=lista_orden[i].first->distancia;
        if(lista_orden[i].second == 0){
            velocidad = velocidad_obligatoria;
            tiempo+=lista_orden[i].first->distancia/velocidad;
            //basura+=lista_orden[i].first->basura;
            escribir_instruccion(instruccion,lista_orden[i].second,false,lista_orden[i].first,calle_final,basura,kilometros,tiempo,velocidad);
        }else if(lista_orden[i].second % 2 == 0){
            velocidad = velocidad_opcional;
            tiempo+=lista_orden[i].first->distancia/velocidad;
            escribir_instruccion(instruccion,lista_orden[i].second,true,lista_orden[i].first,calle_final,basura,kilometros,tiempo,velocidad);
        }else if(lista_orden[i].second % 3 == 0){
            velocidad = velocidad_opcional;
            tiempo+=lista_orden[i].first->distancia/velocidad;
            escribir_instruccion(instruccion,lista_orden[i].second,false,lista_orden[i].first,calle_final,basura,kilometros,tiempo,velocidad);
        }else{
            velocidad = velocidad_obligatoria;
            tiempo+=lista_orden[i].first->distancia/velocidad;
            basura+=lista_orden[i].first->basura;      
            escribir_instruccion(instruccion,lista_orden[i].second,false,lista_orden[i].first,calle_final,basura,kilometros,tiempo,velocidad);
        }

        rutas.append(instruccion);

        if(i!=lista_orden.size()-1){
            coords inteserccion;
            string dire1;
            if(lista_orden[i].second == 0){;
                dire1 = "pasaje"; 
            }else if(lista_orden[i].second>0){
                inteserccion = lista_orden[i].first->final;
                dire1 = calcular_direccion(lista_orden[i].first,inteserccion);
            }else{
                inteserccion = lista_orden[i].first->inicial;
                dire1 = calcular_direccion(lista_orden[i].first,inteserccion);
            }
            coords inteserccion2;
            if(lista_orden[i+1].second>0){
                inteserccion2 = lista_orden[i+1].first->final;
            }else{
                inteserccion2 = lista_orden[i+1].first->inicial;
            }
            string dire2 = calcular_direccion(lista_orden[i+1].first,inteserccion2);
            if(dire1 != dire2 && dire1 != "pasaje"){
                Json::Value instruccion2;
                Json::Value coordenadas_giro(Json::arrayValue);
                coordenadas_giro.append(inteserccion.lat);
                coordenadas_giro.append(inteserccion.lon);
                instruccion2["id"] = id;
                id++;
                instruccion2["COORDENADAS"] = coordenadas_giro;
                instruccion2["giro"] = true;

                string sentido_giro;
                if((dire1=="Norte" && dire2=="Este")||(dire1=="Sur" && dire2=="Oeste")||(dire1=="Este" && dire2=="Sur")||(dire1=="Oeste" && dire2=="Norte")){
                    sentido_giro = "Derecha";
                    instruccion2["distancia"] = 2.12;
                    kilometros+= 2.12;
                    instruccion2["tiempo"] = 2.12/velocidad_obligatoria;
                    tiempo+=2.12/velocidad_obligatoria;
                }else if((dire1=="Norte" && dire2=="Oeste")||(dire1=="Sur" && dire2=="Este")||(dire1=="Este" && dire2=="Norte")||(dire1=="Oeste" && dire2=="Sur")){
                    sentido_giro = "Izquierda";
                    instruccion2["distancia"] = 6.44;
                    kilometros+= 6.44;
                    instruccion2["tiempo"] = 6.44/velocidad_obligatoria;
                    tiempo+=6.44/velocidad_obligatoria;
                }else{
                    sentido_giro = "Vuelta";
                    instruccion2["distancia"] = 0.0;
                    instruccion2["tiempo"] = 0.0;
                }

                instruccion2["sentido"] = sentido_giro;
                instruccion2["calle_i"] = lista_orden[i+1].first->nombre + " " + lista_orden[i+1].first->id;
                instruccion2["tiempo_ac"] = tiempo;
                instruccion2["distancia_ac"] = kilometros;
                instruccion2["coste_ac"] = kilometros/1000 * 760;
                instruccion2["basura_ac"] = basura;

                rutas.append(instruccion2);
            }
        }
    }

    ifstream rutesFile("api/data/outputs/"+ archivo_rutas);
    Json::Value root;

    rutesFile >> root;
    rutesFile.close();
    root["routes"].append(rutas);

    ofstream File("api/data/outputs/"+ archivo_rutas);

    Json::StyledWriter styledWriter;
    File << styledWriter.write(root);
    File.close();
}

void escribir_instruccion(Json::Value &instruccion,int sentido, bool opcional, calle* c, calle* calle_final, double basura_ac, double kilometros_ac, double tiempo_ac, double velocidad){
    Json::Value coorde(Json::arrayValue);
    int cantidad_coords = c->lista_coords.size();
    for(int j=0;j<cantidad_coords;j++){
        Json::Value cor(Json::arrayValue);
        cor.append(c->lista_coords[j].lat);
        cor.append(c->lista_coords[j].lon);
        coorde.append(cor);
    }

    Json::Value c_inicial(Json::arrayValue);
    Json::Value c_final(Json::arrayValue);
    coords inteserccion;
    string direccion;
    if(sentido == 0){
        c_inicial.append(c->inicial.lat);
        c_inicial.append(c->inicial.lon);

        c_final.append(c->final.lat);
        c_final.append(c->final.lon);
        direccion = "pasaje"; 
    }else if(sentido>0){
        inteserccion = c->final;
        c_inicial.append(c->inicial.lat);
        c_inicial.append(c->inicial.lon);

        c_final.append(c->final.lat);
        c_final.append(c->final.lon);
        direccion = calcular_direccion(c,inteserccion);
    }else{
        inteserccion = c->inicial;
        c_final.append(c->inicial.lat);
        c_final.append(c->inicial.lon);

        c_inicial.append(c->final.lat);
        c_inicial.append(c->final.lon);
        direccion = calcular_direccion(c,inteserccion);
    }

    instruccion["COORDENADAS"] = coorde;
    instruccion["giro"] = false;
    instruccion["basura"] = c->basura;
    instruccion["distancia"] = c->distancia;
    instruccion["tiempo"] = c->distancia/velocidad;
    instruccion["tiempo_ac"] = tiempo_ac;
    instruccion["distancia_ac"] = kilometros_ac;
    instruccion["coste_ac"] = kilometros_ac/1000 * 760;
    instruccion["basura_ac"] = basura_ac;
    instruccion["sentido"] = direccion;
    instruccion["opcional"] = opcional;
    instruccion["calle_i"] = c->nombre + " " + c->id;
    instruccion["calle_f"] = calle_final->nombre + " " + calle_final->id;
    instruccion["coord_i"] = c_inicial;
    instruccion["coord_f"] = c_final;
}