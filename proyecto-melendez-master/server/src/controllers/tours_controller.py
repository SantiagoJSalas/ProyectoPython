from models.tour_model import TourModel
from models.comment_model import CommentModel
from models.person_model import PersonModel
from models.rating_model import RatingModel
from utilities.database import database, build_document_from_dataclass_instance


# Se obtiene la colección de recorridos
tours_collection = database.tours
# Se obtiene la colección de evaluaciones
ratings_collection = database.ratings
# Se obtiene la colección de comentarios
comments_collection = database.comments


# Clase para representar el controlador de recorridos
class ToursController:
    # Obtiene todas las recorridos de la base de datos
    def get_all(self, person: PersonModel) -> list[TourModel]:
        # Vector que almacena los datos provenientes de la base de datos
        result = []
        # Cursor con todas las recorridos de la base de datos
        tours_cursor = tours_collection.find()

        # Se itera sobre todos los documentos del cursor
        for tour_document in tours_cursor:
            # Se busca una evaluación para la recorrido actual
            # en la base de datos
            rating_document_or_none = ratings_collection.find_one({
                "identification_card_number": person.identification_card_number,
                "tour_id": tour_document["tour_id"]
            })
            # Se obtiene los comentarios de la recorrido actual
            # de la base datos y se almacena en un cursor
            comments_cursor = comments_collection.find({
                "tour_id": tour_document["tour_id"]
            })
            # Vector para almacenar los comentarios de la recorrido
            # actual
            comments = []

            # Se itera sobre todos los documentos de comentarios del recorrido
            for comment_document in comments_cursor:
                # Se eliman los datos de la relación física
                del comment_document["tour_id"]

                # Se instancia un objeto de comentario con la información del
                # documento
                comment = CommentModel(**comment_document)
                # Se añade el objeto al vector de comentarios
                comments.append(comment)

            # Se instancia un objeto para representar a la recorrido
            tour = TourModel(**{**tour_document, "comments": comments})

            # Si hay un documento para la evaluación, se instancia un objeto
            # de evaluación con esa información
            if rating_document_or_none is not None:
                rating = RatingModel(score=rating_document_or_none["score"])
            else:
                # Si no se instancia el objeto con información nula
                rating = RatingModel(score=0)

            # Se añade la recorrido y su respectiva evaluación al
            # vector de resultados
            result.append((
                tour,
                rating
            ))

        return result

    # Almacena la información de una recorrido en la base de
    # datos
    def create(self, tour: TourModel) -> None:
        # Se serializa la información de la recorrido
        tour_document = build_document_from_dataclass_instance(tour)

        # Se ingresa la información en la base de datos
        tours_collection.insert_one(tour_document)

    # Actualiza la información de una recorrido
    def update(self, tour: TourModel) -> None:
        # Se serializa la información de la recorrido en un
        # documento de MongoDB
        updated_tour_document = build_document_from_dataclass_instance(tour)
        # Se obtiene el ID de la recorrido
        tour_id = updated_tour_document.pop("tour_id")

        # Se actualiza la información en la base de datos
        tours_collection.update_one(
            {
                "tour_id": tour_id
            },
            {
                "$set": updated_tour_document
            }
        )

    def delete(self, tour: TourModel) -> None:
        tour_id = tour.tour_id

        tours_collection.delete_one({
            "tour_id": tour_id
        })
