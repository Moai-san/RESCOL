from django.db import router
from api.views import *
from rest_framework import routers

router = routers.DefaultRouter()

router.register(r'modelos', modelosViewSet)
router.register(r'usuarios', usuariosViewSet)
router.register(r'redes', redesVialesViewSet)
router.register(r'comunas', comunasViewSet)

