#include <string>
#include <vector>
#include <cmath>
#include <algorithm>
#include <iostream>
#include <stack>
#include <queue>
#include <set>
#include <jsoncpp/json/json.h>

#ifndef _GLOBAL_H_
#define _GLOBAL_H_

#define INF 1.0e14

using namespace std;

typedef struct coords{
    double lat;
    double lon;
    bool operator==(const coords& a) const{
        return (lat == a.lat) && (lon == a.lon);
    }
    bool operator!=(const coords& a) const{
        return (lat != a.lat) || (lon != a.lon);
    }
}coords;

typedef struct calle{
    string id;
    string nombre;
    string zona;
    string i;
    string j;

    int id_arco;
    int segmento;
    int segmento_extraido;
    int sentido;

    double distancia;
    double basura;

    coords inicial;
    coords medio;
    coords final;
    vector<coords> lista_coords;

}calle;


void escribir_archivo(vector<calle*> lista, string nombre_archivo);

void nodos_segmento(vector<calle*> segmento, vector<pair<string,int>> &nodos_segmento);

void calles_nodos(vector<calle*> segmento, vector<pair<pair<string,int>,vector<calle*>>> &calles_nodos);

void ordenar_segmento(vector<calle*> &segmento, double lat_max, double lat_min, double lon_max, double lon_min);

void dividir_segmento(vector<calle*> segmento_inicial, int num_divisiones, double basura_segmento, vector<vector<calle*>> &seg_final);

bool conecta(vector<calle*> lista, calle* c);

double basura_segmento(vector<calle*> segmento);

void calcular_lat_lon(vector<calle*> segmento, double &lat_max, double &lat_min, double &lon_max, double &lon_min);

void segmentar(vector<vector<calle*>> &seg_finales, int iteraciones, int divisiones);

void DFS(string inicial, vector<pair<string,vector<string>>> vecinos, vector<pair<string,bool>> &visitados);

void crear_lista_adyacencia(vector<calle*> segmento, vector<pair<string,vector<string>>> &lista_nodos_vecinos, bool sentido_correcto);

vector<calle*> extender_nodo(string nodo_inicial,vector<pair<pair<string,int>,vector<calle*>>> lista_nodos, vector<pair<string,bool>> lista_nodos_accesibles);

vector<calle*> extender_nodo_sumidero(string nodo_inicial,vector<pair<pair<string,int>,vector<calle*>>> lista_nodos, vector<pair<string,bool>> lista_nodos_accesibles);

void leer_solucion(vector<calle*> lista, vector<calle*> lista_opcionales, vector<pair<string,calle*>> &pasajes, vector<pair<calle*,int>> &lista_orden, string nombre_archivo);

string calcular_direccion(calle* calle, coords interseccion);

void escribir_instancia(vector<calle*> lista,vector<calle*> lista_opcional,vector<pair<string,pair<double,double>>> distancias_nodos, string nombre_archivo, string nombre_instancia);

void escribir_respuesta(vector<pair<calle*,int>> lista_orden, double &kilometros, double &tiempo, double &basura, double velocidad_obligatoria, double velocidad_opcional, string archivo_rutas);

void escribir_instruccion(Json::Value &instruccion,int sentido, bool opcional, calle* c, calle* calle_final, double basura_ac, double kilometros_ac, double tiempo_ac, double velocidad);

void coordenadas_nodos(vector<calle*> segmento, vector<pair<string,coords>> &coordenadas);

string buscar_nodo(vector<pair<string,int>> nodos_segmento,vector<pair<string,pair<double,double>>> &distancias_nodos,bool entrada);

void calcular_distancias(vector<pair<string,coords>> coordenadas_nodos, vector<pair<string,pair<double,double>>> &distancias_nodos);

double calcular_parametros(vector<vector<calle*>> seg_finales, int div1, int div2, int rest);

#endif