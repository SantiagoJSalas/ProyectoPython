import orjson
from sanic import Sanic
from sanic_cors import CORS
import routers.people_router
import routers.tours_router
import routers.comments_router
import routers.ratings_router

# Se crea una aplicaión de Sanic
app = Sanic(__name__, dumps=orjson.dumps)
# Se deshabilita la proteción de CORS
CORS(app)

# Instala el enrrutador de personas
app.blueprint(routers.people_router.router)
# Instala el enrrutador de recorridos
app.blueprint(routers.tours_router.router)
# Instala el enrrutador de comentarios
app.blueprint(routers.comments_router.router)
# Instala el enrrutador de evaluaciones
app.blueprint(routers.ratings_router.router)
