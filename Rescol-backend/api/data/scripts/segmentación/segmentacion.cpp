

#include "global.h"

bool conecta(vector<calle*> lista, calle* c){
    int cantidad_calles = lista.size();
    for(int i=0;i<cantidad_calles;i++){
        if((lista[i]->i==c->i || lista[i]->i == c->j || lista[i]->j==c->i || lista[i]->j == c->j) && c->id != lista[i]->id){
            return true;
        }
    }
    return false;
}

double basura_segmento(vector<calle*> segmento){
    double basura = 0.0;
    for(auto calle : segmento){
        basura += calle->basura;
    }
    return basura;
}

void calcular_lat_lon(vector<calle*> segmento, double &lat_max, double &lat_min, double &lon_max, double &lon_min){
    int num_calles = segmento.size();
    for(int i=0;i<num_calles;i++){
        /* Punto inicial */
        if(segmento[i]->inicial.lat > lat_max) lat_max = segmento[i]->inicial.lat;
        if(segmento[i]->inicial.lat < lat_min) lat_min = segmento[i]->inicial.lat;
        if(segmento[i]->inicial.lon > lon_max) lon_max = segmento[i]->inicial.lon;
        if(segmento[i]->inicial.lon < lon_min) lon_min = segmento[i]->inicial.lon;
        /* Punto final */
        if(segmento[i]->final.lat > lat_max) lat_max = segmento[i]->final.lat;
        if(segmento[i]->final.lat < lat_min) lat_min = segmento[i]->final.lat;
        if(segmento[i]->final.lon > lon_max) lon_max = segmento[i]->final.lon;
        if(segmento[i]->final.lon < lon_min) lon_min = segmento[i]->final.lon;
    }
}

void ordenar_segmento(vector<calle*> &segmento, double lat_max, double lat_min, double lon_max, double lon_min){
    double suma_lat = 0.0;
    double suma_lon = 0.0;
    for(auto& calle : segmento){
        suma_lat += (lat_max - calle->medio.lat)/(lat_max - lat_min);
        suma_lon += (lon_max - calle->medio.lon)/(lon_max - lon_min);
    }

    int sizeSegmento = segmento.size();
    double promedio_lat = suma_lat/sizeSegmento;
    double promedio_lon = suma_lon/sizeSegmento;

    double desv_lat = 0.0;
    double desv_lon = 0.0;
    for(int j=0;j<sizeSegmento;j++){
        desv_lat += powf64(((lat_max - segmento[j]->medio.lat)/(lat_max - lat_min)) - promedio_lat, 2.0);
        desv_lon += powf64(((lon_max - segmento[j]->medio.lon)/(lon_max - lon_min)) - promedio_lon, 2.0);
    }
    desv_lat = sqrtf64(desv_lat/sizeSegmento);
    desv_lon = sqrtf64(desv_lon/sizeSegmento);

    vector<pair<double,calle*>> segmento_ordenar;
    if(desv_lat>desv_lon){
        for(int j=0;j<sizeSegmento;j++){
            pair<double,calle*> aux = make_pair(segmento[j]->medio.lat,segmento[j]);
            segmento_ordenar.emplace_back(aux);
        }
    }else{
        for(int j=0;j<sizeSegmento;j++){
            pair<double,calle*> aux = make_pair(segmento[j]->medio.lon,segmento[j]);
            segmento_ordenar.emplace_back(aux);
        }
    }
    sort(segmento_ordenar.begin(),segmento_ordenar.end());

    segmento.clear();
    for(auto par : segmento_ordenar){
        segmento.emplace_back(par.second);
    }
}

void dividir_segmento(vector<calle*> segmento_inicial, int num_divisiones, double basura_segmento, vector<vector<calle*>> &seg_final){
    vector<calle*> lista_calles;
    for(auto calle :segmento_inicial){
        lista_calles.emplace_back(calle);
    }
    int k = 0;
    int tam_seg = segmento_inicial.size();
    int id_actual = seg_final.size();
    
    for(int i=0;i<num_divisiones-1;i++){
        seg_final.emplace_back(vector<calle*>());
        double total_basura = 0.0;
        bool flag = true;
        while(!lista_calles.empty() && total_basura < basura_segmento/num_divisiones && flag){
            if(seg_final[id_actual+i].empty()){
                if(conecta(lista_calles,lista_calles[k])){
                    lista_calles[k]->segmento = id_actual+i;
                    seg_final[id_actual+i].emplace_back(lista_calles[k]);
                    total_basura += lista_calles[k]->basura;
                    lista_calles.erase(lista_calles.begin()+k);
                    k=0;
                }else{
                    k++;
                }
            }else if(conecta(seg_final[id_actual+i],lista_calles[k])){
                lista_calles[k]->segmento = id_actual+i;
                seg_final[id_actual+i].emplace_back(lista_calles[k]);
                total_basura += lista_calles[k]->basura;
                lista_calles.erase(lista_calles.begin()+k);
                k=0;
            }else{
                k++;
            }
            tam_seg = lista_calles.size();
            if(k==tam_seg){
                flag = false;
                k=0;
            }
        }
    }
    seg_final.emplace_back(vector<calle*>());
    tam_seg = lista_calles.size();
    k=0;
    while(k<tam_seg){
        lista_calles[k]->segmento = id_actual+num_divisiones-1;
        seg_final[id_actual+num_divisiones-1].emplace_back(lista_calles[k]);
        k++;
    }
}

void segmentar(vector<vector<calle*>> &seg_finales, int iteraciones, int divisiones){
    vector<vector<calle*>> auxiliar;
    for(int i=0;i<iteraciones;i++){
        int cantidad_segmentos = seg_finales.size();
        double lat_max = -INF;
        double lon_max = -INF;
        double lat_min = INF;
        double lon_min = INF;
        for(int j=0;j<cantidad_segmentos;j++){
            calcular_lat_lon(seg_finales[j],lat_max,lat_min,lon_max,lon_min);
            double basura_seg = basura_segmento(seg_finales[j]);
            ordenar_segmento(seg_finales[j],lat_max,lat_min,lon_max,lon_min);
            if(basura_seg > 10000){
                dividir_segmento(seg_finales[j],divisiones,basura_seg,auxiliar);
            }else{
                auxiliar.emplace_back(seg_finales[j]);
            }
        }
        seg_finales.clear();
        for(auto aux : auxiliar){
            seg_finales.emplace_back(aux);
        }
        auxiliar.clear();
    }
}

double calcular_parametros(vector<vector<calle*>> seg_finales, int div1, int div2, int div3){
    segmentar(seg_finales,1,div1);
    segmentar(seg_finales,1,div2);
    segmentar(seg_finales,1,div3);
    segmentar(seg_finales,10,2);
    int cantidad_segmentos = seg_finales.size();

    double min = INF;
    double max = -INF;
    double promedio = 0.0;
    for(int i=0;i<cantidad_segmentos;i++){
        double bas = basura_segmento(seg_finales[i]);
        if(bas>max){max = bas;}
        if(bas<min){min = bas;}
        promedio+= bas;
    }

    //cout << div1 << "-" << div2 << "-" << div3 << " #Seg: " << cantidad_segmentos << " Prom: " << promedio/cantidad_segmentos << " dif " << max - min  << " Prom - dif " << (promedio/cantidad_segmentos) - max + min << endl;
    return (promedio/cantidad_segmentos) - max + min;
}