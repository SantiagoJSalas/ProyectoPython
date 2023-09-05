from dataclasses import dataclass
from models.comment_model import CommentModel


# Clase para representar un recorrido
@dataclass
class TourModel:
    # Identificador único
    tour_id: str

    # Atributos de la entidad
    location: str | None = None
    start_date: str | None = None
    end_date: str | None = None
    airline: str | None = None
    asistance: bool | None = None

    # Lista de comentarios, relación de composición con comentario
    comments: list[CommentModel] | None = None

    # Identificador único de MongoDB
    _id: str | None = None
