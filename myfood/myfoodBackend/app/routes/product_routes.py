from fastapi import APIRouter, HTTPException
from bson import ObjectId
from models.product_model import Product
from connection.connectionDB import db
from typing import List

router = APIRouter()

@router.post("/", response_model=Product)
async def create_product(product: Product):
    product_dict = product.dict()
    result = db.products.insert_one(product_dict)
    product_dict["id"] = str(result.inserted_id)
    return product_dict

@router.get("/", response_model=List[Product])
async def list_products():
    products = list(db.products.find({}))
    for product in products:
        product["id"] = str(product["_id"])
        del product["_id"]
    return products

@router.get("/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = db.products.find_one({"_id": ObjectId(product_id)})
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    product["id"] = str(product["_id"])
    del product["_id"]
    return product

@router.put("/{product_id}", response_model=Product)
async def update_product(product_id: str, product: Product):
    product_dict = product.dict()
    result = db.products.replace_one({"_id": ObjectId(product_id)}, product_dict)
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    product_dict["id"] = product_id
    return product_dict

@router.delete("/{product_id}")
async def delete_product(product_id: str):
    result = db.products.delete_one({"_id": ObjectId(product_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"status": "success", "message": "Product deleted"}
