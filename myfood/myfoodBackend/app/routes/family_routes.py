from fastapi import APIRouter, HTTPException
from typing import List
from models.family_model import Family
from connection.connectionDB import db

router = APIRouter()

@router.post("/", response_model=Family)
def create_family(family: Family):
    db.insert_one(family.dict())
    return family

@router.get("/", response_model=List[Family])
def read_families():
    return list(db.find())

@router.get("/{family_id}", response_model=Family)
def read_family(family_id: int):
    family = db.find_one({"id": family_id})
    if not family:
        raise HTTPException(status_code=404, detail="Family not found")
    return family

@router.put("/{family_id}", response_model=Family)
def update_family(family_id: int, family: Family):
    result = db.update_one({"id": family_id}, {"$set": family.dict()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Family not found")
    return db.find_one({"id": family_id})

@router.delete("/{family_id}", response_model=Family)
def delete_family(family_id: int):
    family = db.find_one({"id": family_id})
    if not family:
        raise HTTPException(status_code=404, detail="Family not found")
    db.delete_one({"id": family_id})
    return family
