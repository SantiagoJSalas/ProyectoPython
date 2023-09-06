from models.family_model import Family
from connection.connectionDB import db
from bson import ObjectId
from typing import List, Optional

async def create_family(family_data: dict) -> dict:
    result = db.families.insert_one(family_data)
    family_data["id"] = str(result.inserted_id)
    return family_data

async def get_all_families() -> List[dict]:
    families = list(db.families.find({}))
    for family in families:
        family["id"] = str(family["_id"])
        del family["_id"]
    return families

async def get_family_by_id(family_id: int) -> Optional[dict]:
    family = db.families.find_one({"_id": ObjectId(family_id)})
    if family:
        family["id"] = str(family["_id"])
        del family["_id"]
    return family

async def update_family(family_id: int, family_data: dict) -> Optional[dict]:
    result = db.families.replace_one({"_id": ObjectId(family_id)}, family_data)
    if result.matched_count == 0:
        return None
    family_data["id"] = family_id
    return family_data

async def delete_family(family_id: int) -> bool:
    result = db.families.delete_one({"_id": ObjectId(family_id)})
    return result.deleted_count > 0
