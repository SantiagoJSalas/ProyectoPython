import sanic
from sanic.exceptions import SanicException
from models.person_model import PersonModel
from controllers.people_controller import PeopleController
from utilities.exceptions import AlreadyExistsError, DoesNotExistError


# Se instancia el controlador de personas
controller = PeopleController()
# Se instancia el enrrutador
router = sanic.Blueprint(
    "people",
    url_prefix="/people"
)


# Ruta POST para registrarse
@router.post("/sign_up")
def sign_up(request):
    # Se instancia la nueva persona
    new_person = PersonModel(**request.json)

    # Se usa el controlador para registrar a la persona
    try:
        controller.sign_up(new_person)
    except AlreadyExistsError:
        # Se maneja el posible error
        raise SanicException("PERSON_ALREADY_EXISTS")

    # Se devuelve una respuesta nula
    return sanic.empty()


# Ruta POST para iniciar sesión
@router.post("/sign_in")
def sign_in(request):
    # Se obtiene el correo electrónico
    email = request.json["email"]
    # Se obtiene la contraseña
    password = request.json["password"]

    # Se usa el controlador para iniciar sesión
    try:
        person = controller.sign_in(email, password)

        # Se devuelve una respuesta tipo JSON con los datos de la persona
        return sanic.json(person)
    except DoesNotExistError:
        # Se maneja el posible error
        raise SanicException("PERSON_DOES_NOT_EXIST")


# Ruta GET para obtener la información de persona con base a su número
# de cédula
@router.get("/<identification_card_number>")
def get_one(request, identification_card_number):
    # Se usa el controlador para obtener la información
    person = controller.get_one(identification_card_number)

    # Se devuelve la información en formato JSON
    return sanic.json(person)


# Ruta GET para obtener la información de todas las personas
@router.get("/")
def get_all(request):
    # Se usa el controlador para obtener la información
    all_people = controller.get_all()

    # Se devuelve la información en formato JSON
    return sanic.json(all_people)


# Ruta PUT para actualizar a una persona
@router.put("/")
def update(request):
    # Se instancia la persona a actualizar
    person_to_update = PersonModel(**request.json)

    # Se usa el controlador para actualizar a la persona
    controller.update(person_to_update)

    # Se devuelve una respuesta vacía
    return sanic.empty()


# Ruta DELETE para eliminar a una persona
@router.delete("/<identification_card_number>")
def delete(request, identification_card_number):
    # Se instancia la persona a eliminar
    person_to_delete = PersonModel(
        identification_card_number=identification_card_number
    )

    # Se usa el controlador para eliminar a la persona
    controller.delete(person_to_delete)

    # Se devuelve una respuesta nula
    return sanic.empty()
