import sanic
from models.tour_model import TourModel
from models.person_model import PersonModel
from controllers.tours_controller import ToursController
from uuid import uuid4


# Se instancia el controlador de recorridos
controller = ToursController()
# Se instancia el enrrutador
router = sanic.Blueprint(
    "tours",
    url_prefix="/tours"
)


# Ruta GET para obtener a todos las recorridos
@router.get("/<identification_card_number>")
def get_all(request, identification_card_number):
    # Se instancia a la persona
    person = PersonModel(
        identification_card_number=identification_card_number
    )
    # Se usa el controlador para obtener la información
    all_tours = controller.get_all(person)

    # Se devuelve la información en un JSON
    return sanic.json(all_tours)


# Ruta POST para crear a una recorrido
@router.post("/")
def create(request):
    # Se instancia la nueva recorrido
    new_tour = TourModel(
        **request.json,
        tour_id=uuid4().hex
    )

    # Se usa el controladora para crear a la nueva recorrido
    controller.create(new_tour)

    # Se devuelve una respuesta nula
    return sanic.empty()


# Ruta PUT para actualizar a una recorrido
@router.put("/")
def update(request):
    # Se instancia el recorrido a actualizar
    tour_to_update = TourModel(**request.json)

    # Se usa el controlador para realizar la actualización
    controller.update(tour_to_update)

    # Se devuelve una respuesta nula
    return sanic.empty()


# Ruta DELETE para eliminar una recorrido
@router.delete("/<tour_id>")
def delete(request, tour_id):
    # Se instancia la recorrido a eliminar
    tour_to_delete = TourModel(
        tour_id=tour_id
    )

    # Se usa el controlador para eliminar la recorrido
    controller.delete(tour_to_delete)

    # Se devuelve una respuesta nula
    return sanic.empty()
