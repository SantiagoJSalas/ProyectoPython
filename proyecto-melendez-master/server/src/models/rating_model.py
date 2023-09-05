from dataclasses import dataclass

# Clase para representar una evaluación
@dataclass
class RatingModel:
    # Atributo de la entidad
    score: int

    # Identificador único de MongoDB
    _id: str | None = None
