
#include "global.h"

void DFS(string inicial, vector<pair<string,vector<string>>> vecinos, vector<pair<string,bool>> &visitados){
    stack<string> s;

    s.push(inicial);

    while(!s.empty()){
        string actual = s.top();
        s.pop();
        
        auto it = find_if(visitados.begin(),visitados.end(),[actual](const pair<string, bool>&element){return element.first == actual;});
        if(it != visitados.end()){
            if((*it).second==false){
                (*it).second = true;

                auto it2 = find_if(vecinos.begin(),vecinos.end(),[actual](const pair<string, vector<string>>&element){return element.first == actual;});
                if(it2 != vecinos.end()){
                    int cantidadVecinos = (*it2).second.size();
                    for(int i=0;i<cantidadVecinos;i++){
                        s.push((*it2).second[i]);
                    }
                }
            }
        }
    }
}

void crear_lista_adyacencia(vector<calle*> segmento ,vector<pair<string,vector<string>>> &lista_nodos_vecinos, bool sentido_correcto){
    int size_seg = segmento.size();

    for(int j=0; j<size_seg; j++){
        if(segmento[j]->sentido>=0){
            string inicial =segmento[j]->i;
            string final = segmento[j]->j;
            if(sentido_correcto){
                auto it = find_if(lista_nodos_vecinos.begin(),lista_nodos_vecinos.end(),[inicial](const pair<string, vector<string>>&element){return element.first == inicial;});
                if(it != lista_nodos_vecinos.end()){
                    (*it).second.emplace_back(segmento[j]->j);
                }
            }else{
                auto it = find_if(lista_nodos_vecinos.begin(),lista_nodos_vecinos.end(),[final](const pair<string, vector<string>>&element){return element.first == final;});
                if(it != lista_nodos_vecinos.end()){
                    (*it).second.emplace_back(segmento[j]->i);
                }
            }
        }
        if(segmento[j]->sentido<=0){
            string final =segmento[j]->j;
            string inicial = segmento[j]->i;
            if(sentido_correcto){
                auto it = find_if(lista_nodos_vecinos.begin(),lista_nodos_vecinos.end(),[final](const pair<string, vector<string>>&element){return element.first == final;});
                if(it != lista_nodos_vecinos.end()){
                    (*it).second.emplace_back(segmento[j]->i);
                }

            }else{
                auto it = find_if(lista_nodos_vecinos.begin(),lista_nodos_vecinos.end(),[inicial](const pair<string, vector<string>>&element){return element.first == inicial;});
                if(it != lista_nodos_vecinos.end()){
                    (*it).second.emplace_back(segmento[j]->j);
                }
            }
        }
        
    }
}

vector<calle*> extender_nodo(string nodo_inicial,vector<pair<pair<string,int>,vector<calle*>>> lista_nodos, vector<pair<string,bool>> lista_nodos_accesibles){
    //Agregar Nodos Accesibles DFS
    //Verificar que el nodo de termino es accesible
    queue<string> Nodos;
    Nodos.push(nodo_inicial);
    vector<string> Visitados;
    vector<pair<string,string>> NodosAnteriores;
    vector<calle*> CallesAgregar;
    bool flag = true;
    string nodo_actual;

    while(!Nodos.empty() && flag){
        nodo_actual = Nodos.front();
        Visitados.emplace_back(nodo_actual);
        // cout << "NODO ACTUAL: " << nodo_actual << endl;
        Nodos.pop();
        auto it = find_if(lista_nodos.begin(),lista_nodos.end(),[nodo_actual](const pair<pair<string,int>,vector<calle*>>&element){return element.first.first == nodo_actual;});
        for(auto& calle : (*it).second){
            // cout << calle->id << " " << calle->nombre << " " << calle->i << " " << calle->j << endl;
            auto it2 = find_if(lista_nodos_accesibles.begin(),lista_nodos_accesibles.end(),[nodo_actual](const pair<string,bool> &e){return e.first == nodo_actual;});
            if(it2 != lista_nodos_accesibles.end() && (*it2).second == true){
                nodo_actual = (*it2).first;
                flag = false;
            }else{
                if(calle->i == nodo_actual && calle->sentido <=0){
                    string nod = calle->j;
                    auto it3 = find_if(Visitados.begin(),Visitados.end(),[nod](const string &e){return e == nod;});
                    if(it3 == Visitados.end()){
                        pair <string,string> aux = make_pair(calle->j,calle->i);
                        NodosAnteriores.emplace_back(aux);
                        Nodos.push(calle->j);
                    }
                }else if(calle->j == nodo_actual && calle->sentido >=0){
                    string nod = calle->i;
                    auto it3 = find_if(Visitados.begin(),Visitados.end(),[nod](const string &e){return e == nod;});
                    if(it3 == Visitados.end()){
                        pair <string,string> aux = make_pair(calle->i,calle->j);
                        Nodos.push(calle->i);
                        NodosAnteriores.emplace_back(aux);
                    }
                }
            }
        }
    }
    while(nodo_actual != nodo_inicial){
        auto it = find_if(NodosAnteriores.begin(),NodosAnteriores.end(),[nodo_actual](const pair<string,string>&element){return element.first == nodo_actual;});
        string nodo_anterior = (*it).second;
        auto it2 = find_if(lista_nodos.begin(),lista_nodos.end(),[nodo_actual](const pair<pair<string,int>,vector<calle*>>&element){return element.first.first == nodo_actual;});
        auto it3 = find_if((*it2).second.begin(),(*it2).second.end(),[nodo_anterior](calle* &e){return ( e->j == nodo_anterior ||  e->i == nodo_anterior);});
        CallesAgregar.emplace_back((*it3));
        nodo_actual = nodo_anterior;
    }

    // for(auto& c : CallesAgregar){
    //     cout << c->id << " " << c->nombre << " " << c->i << " " << c->j << endl;
    // }
    return CallesAgregar;
}

vector<calle*> extender_nodo_sumidero(string nodo_inicial,vector<pair<pair<string,int>,vector<calle*>>> lista_nodos, vector<pair<string,bool>> lista_nodos_accesibles){
    //Agregar Nodos Accesibles DFS
    //Verificar que el nodo de termino es accesible
    queue<string> Nodos;
    Nodos.push(nodo_inicial);
    vector<string> Visitados;
    vector<pair<string,string>> NodosAnteriores;
    vector<calle*> CallesAgregar;
    bool flag = true;
    string nodo_actual;

    while(!Nodos.empty() && flag){
        nodo_actual = Nodos.front();
        Visitados.emplace_back(nodo_actual);
        // cout << "NODO ACTUAL: " << nodo_actual << endl;
        Nodos.pop();
        auto it = find_if(lista_nodos.begin(),lista_nodos.end(),[nodo_actual](const pair<pair<string,int>,vector<calle*>>&element){return element.first.first == nodo_actual;});
        for(auto& calle : (*it).second){
            // cout << calle->id << " " << calle->nombre << " " << calle->i << " " << calle->j << endl;
            auto it2 = find_if(lista_nodos_accesibles.begin(),lista_nodos_accesibles.end(),[nodo_actual](const pair<string,bool> &e){return e.first == nodo_actual;});
            if(it2 != lista_nodos_accesibles.end() && (*it2).second == true){
                nodo_actual = (*it2).first;
                flag = false;
            }else{
                if(calle->i == nodo_actual && calle->sentido >=0){
                    string nod = calle->j;
                    auto it3 = find_if(Visitados.begin(),Visitados.end(),[nod](const string &e){return e == nod;});
                    if(it3 == Visitados.end()){
                        pair <string,string> aux = make_pair(calle->j,calle->i);
                        NodosAnteriores.emplace_back(aux);
                        Nodos.push(calle->j);
                    }
                }else if(calle->j == nodo_actual && calle->sentido <=0){
                    string nod = calle->i;
                    auto it3 = find_if(Visitados.begin(),Visitados.end(),[nod](const string &e){return e == nod;});
                    if(it3 == Visitados.end()){
                        pair <string,string> aux = make_pair(calle->i,calle->j);
                        Nodos.push(calle->i);
                        NodosAnteriores.emplace_back(aux);
                    }
                }
            }
        }
    }
    while(nodo_actual != nodo_inicial){
        auto it = find_if(NodosAnteriores.begin(),NodosAnteriores.end(),[nodo_actual](const pair<string,string>&element){return element.first == nodo_actual;});
        string nodo_anterior = (*it).second;
        auto it2 = find_if(lista_nodos.begin(),lista_nodos.end(),[nodo_actual](const pair<pair<string,int>,vector<calle*>>&element){return element.first.first == nodo_actual;});
        auto it3 = find_if((*it2).second.begin(),(*it2).second.end(),[nodo_anterior](calle* &e){return ( e->j == nodo_anterior ||  e->i == nodo_anterior);});
        CallesAgregar.emplace_back((*it3));
        nodo_actual = nodo_anterior;
    }

    // for(auto& c : CallesAgregar){
    //     cout << c->id << " " << c->nombre << " " << c->i << " " << c->j << endl;
    // }
    return CallesAgregar;
}