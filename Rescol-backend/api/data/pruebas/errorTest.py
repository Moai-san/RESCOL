import subprocess
import os

argumentos = []
ruta_ejecutable='./test'

os.system('g++ -o test errorTest.cpp')
# Ejecutar el ejecutable de C con argumentos
try:
    subprocess.run([ruta_ejecutable]+ argumentos, shell=True, capture_output=False, text=True, check=True)
except subprocess.CalledProcessError as e:
        # Captura los errores de la ejecución del comando
        print("Error durante la ejecución del comando:")
        print(f"Código de salida: {e.returncode}")
