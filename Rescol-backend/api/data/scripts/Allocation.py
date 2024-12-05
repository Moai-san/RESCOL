import pulp
import sys

# Obtener las listas cost y dist de los argumentos de la línea de comandos
cost = eval(sys.argv[1])
dist = eval(sys.argv[2])
id   = eval(sys.argv[3])

# inputs that characterize a district
#CN - QN
#1.34, 0.91
population = [141507, 140055]
ppc = [0.79, 0.77]
income = [2168391, 1634090]
#income = [x / 12 for x in income]
nb_f = 4

def define_factor(nb_d, id):
    # if id=0, then the factor is just equal to 1 for each district
    aux = [1.0 for _ in range(nb_d)]
    if id == 1:
        aux = [1.0 / p for p in population]
    elif id == 2:
        aux = [1.0 / p for p in ppc]
    elif id == 3:
        aux = [1.0 / p for p in cost]
    elif id == 4:
        aux = [1.0 / p for p in income]
    return aux

def allocation_maxmin_full(nb_d, cost, factor):
    solx = [0.0 for _ in range(nb_d)]
    bool_y = [False for _ in range(nb_d)]
    solx, bool_y = model_maxmin_lexi(nb_d, cost, solx, bool_y, factor)
    return solx

def model_maxmin_lexi(nb_d, cost, solx, bool_y, factor):
    prob = pulp.LpProblem("Allocation_Problem", pulp.LpMinimize)
    x = [pulp.LpVariable(f"x{i}", lowBound=0) for i in range(nb_d)]
    y = pulp.LpVariable("y", lowBound=0)

    prob += y
    prob += sum(bool_y[n] == False and x[n] for n in range(nb_d)) == cost[-1]
    for n in range(nb_d):
        prob += x[n] <= cost[n]
        if not bool_y[n]:
            prob += y >= x[n] * factor[n]
        else:
            prob += x[n] == cost[n]

    prob.solve(pulp.GLPK(mip=False, msg=False)) 

    solx = [x[n].value() for n in range(nb_d)]
    idy = 0
    maxy = 0.0
    for n in range(nb_d):
        if solx[n] * factor[n] > maxy and not bool_y[n]:
            idy = n
            maxy = solx[n] * factor[n]
    bool_y[idy] = True
    return solx, bool_y

nb_d = len(cost) - 1
solx = allocation_maxmin_full(nb_d, cost, define_factor(nb_d, id))
#print(solx)

perf = []
for f in range(nb_f + 1):
    perf.append(list(x * y for x, y in zip(solx, define_factor(nb_d, f))))

print(perf)

