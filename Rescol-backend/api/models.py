from django.db import models
#from djongo import models
from django.db.models import JSONField


# Create your models here.s

class usuarios(models.Model):
    id       = models.CharField(primary_key=True, unique=False, max_length=40)
    username = models.CharField(primary_key=False, unique=True,  max_length=40)
    password = models.CharField(max_length=100)
    nombre  =  models.CharField(primary_key=False, unique=False, max_length=40)
    apellido  =  models.CharField(primary_key=False, unique=False, max_length=40)
    correo  =  models.CharField(primary_key=False, unique=False, max_length=40)
    admin = models.BooleanField(null=False,
                                blank=False)

class comunas(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)

class redesViales(models.Model):
    id   = models.CharField(primary_key=True, unique=True, max_length=40)
    colaborativo = models.BooleanField(null=False,
                                blank=False)
    nombre = models.CharField(primary_key=False, unique=True, max_length=100)
    comunas = models.ManyToManyField(comunas)

class modelos(models.Model):
    id   = models.CharField(primary_key=True, unique=True, max_length=40)
    nombre = models.CharField(primary_key=False, unique=False, max_length=40)
    residuos = models.DecimalField(max_digits=5, decimal_places=2)
    costo = models.IntegerField()
    capacidad = models.IntegerField()
    jornada = models.IntegerField()
    frecuencia = models.IntegerField()
    fecha = models.CharField(primary_key=False, unique=False, max_length=8)
    hora = models.CharField(primary_key=False, unique=False, max_length=8)
    user = models.ForeignKey(usuarios, 
                             on_delete=models.CASCADE,
                             null=False,
                             blank=False)

    red = models.ForeignKey(redesViales, 
                             on_delete=models.CASCADE,
                             null=False,
                             blank=False)
    


    




