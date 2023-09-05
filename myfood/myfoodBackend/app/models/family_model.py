from pydantic import BaseModel

class Family(BaseModel):
    id: int
    name: str
    user_id: int
