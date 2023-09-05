import sanic
from models.comment_model import CommentModel
from models.tour_model import TourModel
from controllers.comments_controller import CommentsController
from uuid import uuid4


# Se instancia el controlador de comentarios
controller = CommentsController()
# Se instancia el enrrutador
router = sanic.Blueprint(
    "comments",
    url_prefix="/comments"
)


# Ruta POST para crear un comentario para el ID de recorrido
# dado
@router.post("/<tour_id>")
def create(request, tour_id):
    # Se instancia la recorrido
    tour = TourModel(
        tour_id=tour_id
    )
    # Se instancia el nuevo comentario
    new_comment = CommentModel(
        **request.json,
        comment_id=uuid4().hex
    )

    # Se usa el controlador para crear el comentario
    controller.create(tour, new_comment)

    # Se devuelve una respuesta nula
    return sanic.empty()


# Ruta PUT para actualizar un comentario
@router.put("/")
def update(request):
    # Se instancia el comentario a actualizar
    comment_to_udpate = CommentModel(**request.json)

    # Se usa el controlador para actualizar la información
    controller.update(comment_to_udpate)

    # Se devuelve una respuesta nula
    return sanic.empty()


# Ruta DELETE para eliminar un comentario
@router.delete("/<comment_id>")
def delete(request, comment_id):
    # Se instancia el comentario a eliminar
    comment_to_delete = CommentModel(
        comment_id=comment_id
    )

    # Se usa el controlador para eliminar al comentario
    controller.delete(comment_to_delete)

    # Se devuelve una respuesta nula
    return sanic.empty()
