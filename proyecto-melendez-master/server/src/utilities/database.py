import certifi
import dataclasses
from os import getenv
from dotenv import load_dotenv
from pymongo.mongo_client import MongoClient

# Se cargan la variables de entorno (credenciales de MongoDB)
load_dotenv()

# Se lee la URI de conexión de MongoDB de las variables de entorno
__mongodb_connection_uri = getenv("MONGODB_CONNECTION_URI")

# Se lee el nombre de la base de datos de MongoDB de las variables de entorno
__mongodb_database_name = getenv("MONGODB_DATABASE_NAME")

# Se instancia un cliente a la base de datos de MongoDB
__mongodb_client = MongoClient(
    __mongodb_connection_uri,
    tlsCAFile=certifi.where()
)
# Se prueba la conexión del cliente a MongoDB
__mongodb_client.admin.command("ping")

# Se obtiene la base de datos de MongoDB
database = __mongodb_client[__mongodb_database_name]

# Función para serializar una instancia de una clase a un documento de MongoDB
def build_document_from_dataclass_instance(dataclass_instance):
    # Se convierte la instancia a documento
    document = dataclasses.asdict(dataclass_instance)

    # Se elimina el ID de MongoDB
    del document["_id"]

    return document
