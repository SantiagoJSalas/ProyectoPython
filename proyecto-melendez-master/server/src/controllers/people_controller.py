from models.person_model import PersonModel
from utilities.database import database, build_document_from_dataclass_instance
from utilities.exceptions import AlreadyExistsError, DoesNotExistError


# Se obtiene la colección de persona
people_collection = database.people


# Clase para representar el controlador de persona
class PeopleController:
    # Almacena una persona en la base de datos
    def sign_up(self, person: PersonModel) -> None:
        # Se obtiene el número de cédula
        identification_card_number = person.identification_card_number
        # Se busca una persona con tal número de cédula en la base de datos
        existing_person_document_or_none = (
            people_collection.find_one({
                "identification_card_number": identification_card_number
            })
        )

        # Se la persona existe, se lanza un error
        if existing_person_document_or_none is not None:
            raise AlreadyExistsError(
                f"Person with identification card number {identification_card_number} is already signed up"
            )

        # Si no existe, se serializa la persona a crear
        new_person_document = build_document_from_dataclass_instance(person)

        # Se ingresa el documento en la base de datos
        people_collection.insert_one(new_person_document)

    # Se obtiene una persona en base a su correo electrónico y contraseña
    def sign_in(self, email: str, password: str) -> PersonModel:
        # Se busca tal persona en la base de datos
        person_document_or_none = people_collection.find_one({
            "email": email,
            "password": password
        })

        # Si la persona no existe, se lanza un error
        if person_document_or_none is None:
            raise DoesNotExistError(
                f"Provided email or password are invalid"
            )
        
        # Si la persona existe, se instancia un objeto con su información
        person = PersonModel(**person_document_or_none)

        return person

    # Obtiene todas las persona en la base de datos
    def get_all(self) -> list[PersonModel]:
        # Se genera un cursor con todas las personas
        people_cursor = people_collection.find()
        # Se crea una lista con instancia de las personas
        all_people = [
            PersonModel(**person_document)
            for person_document in people_cursor
        ]

        return all_people

    # Se obtiene una persona en base a su número de cédula
    def get_one(self, identification_card_number) -> PersonModel:
        # Se busca tal persona en la base de datos
        person_document_or_none = people_collection.find_one({
            "identification_card_number": identification_card_number
        })

        # Si la persona no existe, se lanza un error
        if person_document_or_none is None:
            raise DoesNotExistError(
                f"Person with give identification card number does not exist"
            )

        # Si la persona existe, se instancia la una clase con sus datos
        person = PersonModel(**person_document_or_none)

        return person

    # Actualiza la información de una persona
    def update(self, person: PersonModel) -> None:
        # Se serializa la nueva información de la persona
        updated_person_document = build_document_from_dataclass_instance(person)
        # Se obtiene su número de cédula
        identification_card_number = updated_person_document.pop("identification_card_number")

        # Se actualizan los datos en la base de datos
        people_collection.update_one(
            {
                "identification_card_number": identification_card_number
            },
            {
                "$set": updated_person_document
            }
        )

    # Se elimina una persona de la base datos
    def delete(self, person: PersonModel) -> None:
        # Se obtiene el número de cédula de tal persona
        identification_card_number = person.identification_card_number

        # Se elimina la persona de la base de datos
        people_collection.delete_one({
            "identification_card_number": identification_card_number
        })
