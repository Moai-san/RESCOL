

#include "global.h"

void nodos_segmento(vector<calle*> segmento, vector<pair<string,int>> &nodos_segmento){
    int cantidad_calles = segmento.size();
    int nodos_agregados = 0;
    for(int i=0;i<cantidad_calles;i++){
        if(nodos_agregados == 0){
            pair<string,int> inicial = make_pair(segmento[i]->i,1);
            nodos_segmento.emplace_back(inicial);
            nodos_agregados++;

            pair<string,int> final = make_pair(segmento[i]->j,1);
            nodos_segmento.emplace_back(final);
            nodos_agregados++;
        }else{
            bool nodo_inicial = false;
            bool nodo_final = false;
            for(int j=0;j<nodos_agregados;j++){
                if(segmento[i]->i == nodos_segmento[j].first){
                    nodos_segmento[j].second++;
                    nodo_inicial = true;
                }
                if(segmento[i]->j == nodos_segmento[j].first){
                    nodos_segmento[j].second++;
                    nodo_final = true;
                }
            }
            if(!nodo_inicial){
                pair<string,int> inicial = make_pair(segmento[i]->i,1);
                nodos_segmento.emplace_back(inicial);
                nodos_agregados++;
            }
            if(!nodo_final){
                pair<string,int> final = make_pair(segmento[i]->j,1);
                nodos_segmento.emplace_back(final);
                nodos_agregados++;
            }
        }
    }
}

void calles_nodos(vector<calle*> segmento, vector<pair<pair<string,int>,vector<calle*>>> &calles_nodos){
    int cantidad_calles = segmento.size();
    int nodos_agregados = 0;
    for(int i=0;i<cantidad_calles;i++){
        if(nodos_agregados == 0){
            pair<string,int> nodo_inicial = make_pair(segmento[i]->i,1);
            calles_nodos.emplace_back(nodo_inicial,vector<calle*>());
            calles_nodos[0].second.emplace_back(segmento[i]);
            nodos_agregados++;

            pair<string,int> nodo_final = make_pair(segmento[i]->j,1);
            calles_nodos.emplace_back(nodo_final,vector<calle*>());
            calles_nodos[1].second.emplace_back(segmento[i]);
            nodos_agregados++;
        }else{
            bool nodo_inicial_agregado = false;
            bool nodo_final_agregado = false;
            for(int m=0;m<nodos_agregados;m++){
                if(segmento[i]->i == calles_nodos[m].first.first){
                    calles_nodos[m].first.second++;
                    calles_nodos[m].second.emplace_back(segmento[i]);
                    nodo_inicial_agregado = true;
                }
                if(segmento[i]->j == calles_nodos[m].first.first){
                    calles_nodos[m].first.second++;
                    calles_nodos[m].second.emplace_back(segmento[i]);
                    nodo_final_agregado = true;
                }
            }
            if(!nodo_inicial_agregado){
                pair<string,int> nodo_inicial = make_pair(segmento[i]->i,1);
                calles_nodos.emplace_back(nodo_inicial,vector<calle*>());
                calles_nodos[nodos_agregados].second.emplace_back(segmento[i]);
                nodos_agregados++;
            }
            if(!nodo_final_agregado){
                pair<string,int> nodo_final = make_pair(segmento[i]->j,1);
                calles_nodos.emplace_back(nodo_final,vector<calle*>());
                calles_nodos[nodos_agregados].second.emplace_back(segmento[i]);
                nodos_agregados++;
            }
        }
    }
}

void calcular_distancias(vector<pair<string,coords>> coordenadas_nodos, vector<pair<string,pair<double,double>>> &distancias_nodos){
    vector<pair<double,double>> entrada;
    vector<pair<double,double>> salida;
    entrada.emplace_back(make_pair(-33.4132797,-70.7469998));
    entrada.emplace_back(make_pair(-33.412195,-70.7219881));
    entrada.emplace_back(make_pair(-33.4259287,-70.7666186));
    entrada.emplace_back(make_pair(-33.4306176,-70.7202553));

    salida.emplace_back(make_pair(-33.4132157,-70.7450988));
    salida.emplace_back(make_pair(-33.4124029,-70.7213768));
    salida.emplace_back(make_pair(-33.4259287,-70.7666186));
    salida.emplace_back(make_pair(-33.4306176,-70.7202553));

    for(pair<string,coords> p : coordenadas_nodos){
        double distancia_entrada = INF;
        double distancia_salida = INF;
        for(pair<double,double> e : entrada){
            double dist = powf64(((p.second.lat-e.first)+(p.second.lon - e.second)),2.0);
            dist = sqrtf64(dist);
            if(dist < distancia_entrada ){
                distancia_entrada = dist;
            }
        }
        for(pair<double,double> e : salida){
            double dist = powf64(((p.second.lat-e.first)+(p.second.lon - e.second)),2.0);
            dist = sqrtf64(dist);
            if(dist < distancia_salida ){
                distancia_salida = dist;
            }
        }
        distancias_nodos.emplace_back(make_pair(p.first,make_pair(distancia_entrada,distancia_salida)));
    }
}

string buscar_nodo(vector<pair<string,int>> nodos_segmento,vector<pair<string,pair<double,double>>> &distancias_nodos,bool entrada){
    pair<string, double> mejor_distancia = {"",INF};
    for(auto p : nodos_segmento){
        string nodo = p.first;
        auto it = find_if(distancias_nodos.begin(),distancias_nodos.end(),[nodo](const pair<string,pair<double,double>> e){return e.first == nodo;});
        if(entrada){
            if((*it).second.first < mejor_distancia.second){
                mejor_distancia.first = p.first;
                mejor_distancia.second = (*it).second.first;
            }
        }else{
            if((*it).second.second < mejor_distancia.second){
                mejor_distancia.first = p.first;
                mejor_distancia.second = (*it).second.second;
            }
        }
    }
    return mejor_distancia.first;
}

void coordenadas_nodos(vector<calle*> segmento, vector<pair<string,coords>> &coordenadas){
    int cantidad_calles = segmento.size();
    int nodos_agregados = 0;
    for(int i=0;i<cantidad_calles;i++){
        if(nodos_agregados == 0){
            pair<string,coords> inicial = make_pair(segmento[i]->i,segmento[i]->lista_coords[0]);
            coordenadas.emplace_back(inicial);
            nodos_agregados++;

            int id_final = segmento[i]->lista_coords.size() - 1;
            pair<string,coords> final = make_pair(segmento[i]->j,segmento[i]->lista_coords[id_final]);
            coordenadas.emplace_back(final);
            nodos_agregados++;
        }else{
            bool nodo_inicial = false;
            bool nodo_final = false;
            for(int j=0;j<nodos_agregados;j++){
                if(segmento[i]->i == coordenadas[j].first){
                    nodo_inicial = true;
                }
                if(segmento[i]->j == coordenadas[j].first){
                    nodo_final = true;
                }
            }
            if(!nodo_inicial){
                pair<string,coords> inicial = make_pair(segmento[i]->i,segmento[i]->lista_coords[0]);
                coordenadas.emplace_back(inicial);
            }
            if(!nodo_final){
                int id_final = segmento[i]->lista_coords.size() - 1;
                pair<string,coords> final = make_pair(segmento[i]->j,segmento[i]->lista_coords[id_final]);
                coordenadas.emplace_back(final);
            }
        }
    }
}