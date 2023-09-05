from pydantic import BaseModel

class Product(BaseModel):
    id: int
    family_id: int
    name: str
    quantity: int
