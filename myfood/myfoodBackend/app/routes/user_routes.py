from fastapi import APIRouter, HTTPException
from bson import ObjectId
from models.user_model import User
from connection.connectionDB import db
from typing import List

router = APIRouter()

@router.post("/", response_model=User)
async def create_user(user: User):
    user_dict = user.dict()
    result = db.users.insert_one(user_dict)
    user_dict["id"] = str(result.inserted_id)
    return user_dict

@router.get("/", response_model=List[User])
async def list_users():
    users = list(db.users.find({}))
    for user in users:
        user["id"] = str(user["_id"])
        del user["_id"]
    return users

@router.get("/{user_id}", response_model=User)
async def get_user(user_id: str):
    user = db.users.find_one({"_id": ObjectId(user_id)})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    user["id"] = str(user["_id"])
    del user["_id"]
    return user

@router.put("/{user_id}", response_model=User)
async def update_user(user_id: str, user: User):
    user_dict = user.dict()
    result = db.users.replace_one({"_id": ObjectId(user_id)}, user_dict)
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    user_dict["id"] = user_id
    return user_dict

@router.delete("/{user_id}")
async def delete_user(user_id: str):
    result = db.users.delete_one({"_id": ObjectId(user_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"status": "success", "message": "User deleted"}
