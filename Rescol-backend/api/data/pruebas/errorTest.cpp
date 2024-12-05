#include <iostream>  // Incluye la librería estándar de entrada/salida

int main() {
    bool error1 = false;  // Variable booleana para controlar si se produce un error
    bool error2 = false;  // Variable booleana para controlar si se produce un error

    if (error1) {
        return 1;  // Devuelve 1 al sistema operativo para indicar que hubo un error
    } else if(error2){
        return 2;  // Devuelve 1 al sistema operativo para indicar que hubo un error
    } else{
        std::cout << "Hola, Mundo" << std::endl;  // Imprime el mensaje en la consola
        return 0;  // Devuelve 0 al sistema operativo para indicar que el programa terminó correctamente
    }
}
