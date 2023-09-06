from pydantic import BaseModel

class Product(BaseModel):
    id: str
    family_id: str
    name: str
    quantity: int
