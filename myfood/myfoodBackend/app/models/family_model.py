from pydantic import BaseModel

class Family(BaseModel):
    id: str
    name: str
    user_id: str
