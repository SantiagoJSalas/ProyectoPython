from models.comment_model import CommentModel
from models.tour_model import TourModel
from utilities.database import database, build_document_from_dataclass_instance


# Se obtiene la colección de comentarios
comments_collection = database.comments


# Clase para representar el controlador de comentarios
class CommentsController:
    # Crea un comentario para una recorrido
    def create(self, tour: TourModel, comment: CommentModel) ->  None:
        # Se serializan las instancias del comentario con la información
        # de la recorrido
        comment_document = {
            "tour_id": tour.tour_id,
            **build_document_from_dataclass_instance(comment)
        }

        # Se guardan los datos en la base de datos
        comments_collection.insert_one(comment_document)

    # Actualiza el contenido de un comentario
    def update(self, comment: CommentModel) -> None:
        # Serializa la nueva información
        updated_comment_document = build_document_from_dataclass_instance(comment)
        # Obtiene le ID del comentario
        comment_id = updated_comment_document.pop("comment_id")

        # Actualiza los datos en la base de datos
        comments_collection.update_one(
            {
                "comment_id": comment_id,
            },
            {
                "$set": updated_comment_document
            }
        )

    # Elimina un comentario de la base datos
    def delete(self, comment: CommentModel) -> None:
        # Obtiene el ID del comentario
        comment_id = comment.comment_id

        # Se elimina el comentario con ese ID de la base de datos
        comments_collection.delete_one({
            "comment_id": comment_id
        })
