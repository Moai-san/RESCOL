import numpy as np
import pulp
import sys
from pulp import LpProblem, LpMinimize, LpVariable, lpSum, LpBinary, value, LpStatus, PULP_CBC_CMD
import ast

# Obtener las listas cost y dist de los argumentos de la línea de comandos
N = int(sys.argv[1])#numero de tours
x = ast.literal_eval(sys.argv[2]) #opcional: coordenadas x de centroide, garage (N python) y KDM (N+1 python)
y = ast.literal_eval(sys.argv[3]) #opcional: coordenadas y de centroide, garage (N python) y KDM (N+1 python)
q_time = ast.literal_eval(sys.argv[4]) #arreglo con el tiempo de recorrido para cada tour (segundos)
q_dist = ast.literal_eval(sys.argv[5])  #arreglo con el distancia de recorrido para cada tour (km)

T = 12 #Restriccion horaria por jornada (horas)
S = 2     #Numero de shifts a considerar
tDC = 0.42  #Tiempo de descarga en el DC (horas)


#COSTOS NORMAL
f = 66667            #costo por vehiculo por dia.
h = 118750           #costo del staff por jornada.
c = int(sys.argv[6]) #costo por kilometro recorrido.


np.random.seed(7654321)  # Seed for random number generation
dist = np.array([[np.sqrt((x[n1] - x[n2]) ** 2 + (y[n1] - y[n2]) ** 2)/1000 for n2 in range(N + 2)] for n1 in range(N + 2)]) #matrix con distancias euclidianas basados en coordenadas (x,y) de arriba.
#d_max = np.max(dist)    #no incluir
#dist = dist / d_max     #no incluir
time = np.array([[dist[n1, n2] * (1/65) for n2 in range(N + 2)] for n1 in range(N + 2)]) #matriz de tiempo de viajes

def model_tours_shift_vehicle(N, S, dist, time, q_dist, q_time, tDC, T, f, h, c):
    V = N
    mod = LpProblem("Vehicle_Shift_Problem", LpMinimize)
    x = LpVariable.dicts("x", (range(V), range(S), range(2), range(N)), cat=LpBinary)
    y = LpVariable.dicts("y", (range(V), range(S)), cat=LpBinary)
    z = LpVariable.dicts("z", range(V), cat=LpBinary)
    mod += f*lpSum(z[v] for v in range(V))+(h+c*dist[N, N+1])*lpSum(y[v][s] for v in range(V) for s in range(S))+ c*lpSum(x[v][s][0][n] * dist[N, n] for v in range(V) for s in range(S) for n in range(N))
    for n in range(N):
        mod += lpSum(x[v][s][t][n] for v in range(V) for s in range(S) for t in range(2)) == 1
    for v in range(V):
        for s in range(S):
            mod += N*lpSum(x[v][s][0][n] for n in range(N)) >= lpSum(x[v][s][1][n] for n in range(N))
            mod += lpSum(x[v][s][0][n] for n in range(N)) <= y[v][s]
            mod += y[v][s] <= z[v]
            mod += lpSum(x[v][s][0][n] * time[N, n] for n in range(N)) + \
                   lpSum(x[v][s][t][n] * (q_time[n] + time[n][N + 1] + tDC) for n in range(N) for t in range(2)) + \
                   lpSum(x[v][s][1][n] * time[N + 1][n] for n in range(N)) + time[N + 1][N] <= T
    #solver_pulp = pulp.get_solver('PULP_CBC_CMD', timeLimit=10)
    mod.solve(PULP_CBC_CMD(timeLimit=10, msg=False))

    tot_cost = value(mod.objective) + c*sum(q_dist) + c*sum(dist[N + 1, n]+dist[n, N + 1] for n in range(N))
    solz = [1 if value(z[v]) > 0.5 else 0 for v in range(V)]
    soly = [[1 if value(y[v][s]) > 0.5 else 0 for s in range(S)] for v in range(V)]
    solx = [[[[1 if value(x[v][s][t][n]) > 0.5 else 0 for n in range(N)] for t in range(2)] for s in range(S)] for v in range(V)]
    shift_time = [[sum(solx[v][s][t][n]*(q_time[n]+time[n][N + 1]+tDC+(t == 0)*time[N, n]+(t == 1)*time[N + 1][n]) for n in range(N) for t in range(2))+time[N + 1][N] if soly[v][s] > 0.5 else 0 for v in range(V)] for s in range(S)]

    return tot_cost, shift_time, solz, soly, solx

tot_cost, aux_shift_time, vehicles, shifts, tours = model_tours_shift_vehicle(N, S, dist, time, q_dist, q_time, tDC, T, f, h, c)

nb_vehicles = sum(vehicles)
nb_shifts_vehicle = [sum(shifts[v]) for v in range(len(vehicles))]
nb_shifts = sum(nb_shifts_vehicle)

#print(nb_vehicles)          #numero de vehiculos
#print(shifts)
#print(nb_shifts_vehicle)
#print(aux_shift_time)


shifts_with_tours = []
shift_time = []

for v in range(len(vehicles)):
    for s in range(S):
        if shifts[v][s] > 0:
            arr_tours = []
            shift_time.append(aux_shift_time[s][v])
            for t in range(2):
                for n in range(N):
                    if tours[v][s][t][n] > 0:
                        arr_tours.insert(0, n) if t == 0 else arr_tours.append(n)
            shifts_with_tours.append(arr_tours)

#dis = dist.tolist()

k = []
for shift in shifts_with_tours:
    for index,tour in enumerate(shift):
        if index == 0:
            #print("Distancia garage al tour", tour, ":", dist[-2][tour])
            k.append(dist[-2,tour]) #agregar distancia garage al tour
        
        #print("Distancia tour", tour, "a KDM :", dist[tour][-1])
        k.append(dist[tour,-1]) #agergar distanci del tour a KDM

        if index < len(shift)-1:
            #print("Distancia KDM a tour", shift[index+1], ":", dist[-1][shift[index+1]])
            k.append(dist[-1,shift[index+1]]) #agergar distanci del tour a KDM

        elif index == len(shift)-1:
            k.append(dist[-2,-1])   #agregar distancia garage a KDM
            #print("Distancia KDM al garage:", dist[-2][-1])
    #print("")

tot_cost = sum(k)*1125 + 66667*nb_vehicles+ 118750*len(shifts_with_tours)+c*sum(q_dist)

print({'shifts_with_tours': shifts_with_tours, 'time_per_shifts': shift_time, 'cost': tot_cost, 'n_camiones':nb_vehicles})      # arreglo con los distintos shift. Adentro de cada shift estan los tours en el orden a ser visitados.
#print("shift_time:", shift_time)                    #tiempo de cada shift

#print(nb_shift)                                     #numero de shifts
#print(tot_cost)                                     #costo total por dia.