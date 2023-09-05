from dataclasses import dataclass

# Clase para representar un comentario
@dataclass
class CommentModel:
    # Identificador único
    comment_id: str

    # Atributo de la entidad
    content: str | None = None

    # Identificador único de MongoDB
    _id: str | None = None
