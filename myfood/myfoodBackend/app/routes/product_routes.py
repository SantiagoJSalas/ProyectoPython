from fastapi import APIRouter, HTTPException
from models.product_model import Product
import controllers.product_controller as product_controller
from typing import List

router = APIRouter()

@router.post("/", response_model=Product)
async def create_product_endpoint(product: Product):
    product_data = dict(product)
    created_product = await product_controller.create_product(product_data)
    return created_product

@router.get("/", response_model=List[Product])
async def list_products():
    return await product_controller.get_all_products()

@router.get("/{product_id}", response_model=Product)
async def get_product_endpoint(product_id: str):
    product = await product_controller.get_product_by_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.put("/{product_id}", response_model=Product)
async def update_product_endpoint(product_id: str, product_update: Product):
    updated_data = dict(product_update)
    product = await product_controller.update_product(product_id, updated_data)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.delete("/{product_id}")
async def delete_product_endpoint(product_id: str):
    success = await product_controller.delete_product(product_id)
    if not success:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"status": "success", "message": "Product deleted"}
