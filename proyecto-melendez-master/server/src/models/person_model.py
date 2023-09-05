from dataclasses import dataclass

# Clase para representar a una persona
@dataclass
class PersonModel:
    # Número de cédula, identificador único
    identification_card_number: str

    # Atributos de la entidad
    name: str | None = None
    first_surname: str | None = None
    second_surname: str | None = None
    address: str | None = None

    # Atributos de la entidad para el inicio de sesión
    email: str | None = None
    password: str | None = None

    # Identificador único de MongoDB
    _id: str | None  = None
