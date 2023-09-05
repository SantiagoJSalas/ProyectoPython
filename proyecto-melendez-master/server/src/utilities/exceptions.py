# Excepción para un cuando ya existe una persona registrada
# con el número de cédula brindado
class AlreadyExistsError(Exception):
    def __init__(self, message: str) -> None:
        self.message = message

# Excepción para cuando no se encuentra una persona con los
# datos brindados
class DoesNotExistError(Exception):
    def __init__(self, message: str) -> None:
        self.message = message
