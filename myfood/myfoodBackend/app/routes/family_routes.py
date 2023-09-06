from fastapi import APIRouter, HTTPException
from models.family_model import Family
import controllers.family_controller as family_controller

router = APIRouter()

@router.post("/", response_model=Family)
async def create_family_endpoint(family: Family):
    family_data = dict(family)
    created_family = await family_controller.create_family(family_data)
    return created_family

@router.get("/", response_model=list[Family])
async def get_all_families():
    return await family_controller.get_all_families()

@router.get("/{family_id}", response_model=Family)
async def get_family_by_id(family_id: int):
    family = await family_controller.get_family_by_id(family_id)
    if not family:
        raise HTTPException(status_code=404, detail="Family not found")
    return family

@router.put("/{family_id}", response_model=Family)
async def update_family_endpoint(family_id: int, family_update: Family):
    updated_data = dict(family_update)
    family = await family_controller.update_family(family_id, updated_data)
    if not family:
        raise HTTPException(status_code=404, detail="Family not found")
    return family

@router.delete("/{family_id}")
async def delete_family_endpoint(family_id: int):
    deleted_family = await family_controller.delete_family(family_id)
    if not deleted_family:
        raise HTTPException(status_code=404, detail="Family not found")
    return {"status": "success", "message": "Family deleted"}
