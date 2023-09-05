from models.rating_model import RatingModel
from models.person_model import PersonModel
from models.tour_model import TourModel
from utilities.database import database, build_document_from_dataclass_instance


# Se obtiene la colección de evaluaciones
ratings_collection = database.ratings

# Clase para representar el controlador de la evaluaciones
class RatingsController:
    # Actualiza la evaluación de un usuario a una recorrido
    def set_rating(
        self,
        person: PersonModel,
        tour: TourModel,
        rating: RatingModel
    ) -> None:
        # Se busca una evaluación existente en la base de datos
        rating_document_or_none = ratings_collection.find_one({
            "identification_card_number": person.identification_card_number,
            "tour_id": tour.tour_id
        })
        # Se serializa la supuesta nueva evaluación
        set_rating_document = build_document_from_dataclass_instance(rating)

        # Si no existe tal documento
        if rating_document_or_none is None:
            # Se crea el documento
            ratings_collection.insert_one({
                "identification_card_number": person.identification_card_number,
                "tour_id": tour.tour_id,
                **set_rating_document
            })
        else:
            # Si el documento existe, se actualiza con la nueva evaluación
            ratings_collection.update_one(
                {
                    "identification_card_number": person.identification_card_number,
                    "tour_id": tour.tour_id
                },
                {
                    "$set": set_rating_document
                }
            )
