from rest_framework import serializers
from api.models import *


class usuariosSerializaer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=False)
    class Meta:
        model = usuarios
        fields = '__all__'

class modelosSerializaer(serializers.ModelSerializer):
    class Meta:
        model = modelos
        fields = '__all__'

class redesSerializaer(serializers.ModelSerializer):
    class Meta:
        model = redesViales
        fields = '__all__'

class comunasSerializaer(serializers.ModelSerializer):
    class Meta:
        model = comunas
        fields = '__all__'

