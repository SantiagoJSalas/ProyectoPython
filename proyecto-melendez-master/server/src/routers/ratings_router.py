import sanic
from models.rating_model import RatingModel
from models.person_model import PersonModel
from models.tour_model import TourModel
from controllers.ratings_controller import RatingsController


# Se instancia el controlador de evaluaciones
controller = RatingsController()
# Se instncia el enrrutador
router = sanic.Blueprint(
    "ratings",
    url_prefix="/ratings"
)


# Ruta PUT para actualizar una evaluación
@router.put("/<identification_card_number>/<tour_id>")
def set_rating(request, identification_card_number, tour_id):
    # Se instancia la persona
    person = PersonModel(
        identification_card_number=identification_card_number
    )
    # Se instancia la recorrido
    tour = TourModel(
        tour_id=tour_id
    )
    # Se instancia la nueva evaluación
    new_rating = RatingModel(**request.json)

    # Se usa el controlador para actualizar a la evaluación
    controller.set_rating(person, tour, new_rating)

    # Se devuelve una respuesta nula
    return sanic.empty()
