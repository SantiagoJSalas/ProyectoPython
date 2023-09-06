from models.product_model import Product
from connection.connectionDB import db
from bson import ObjectId
from typing import List, Optional

async def create_product(product_data: dict) -> dict:
    result = db.products.insert_one(product_data)
    product_data["id"] = str(result.inserted_id)
    return product_data

async def get_all_products() -> List[dict]:
    products = db.products.find({}).to_list(length=100)  # considera ajustar el parámetro `length` según tus necesidades
    for product in products:
        product["id"] = str(product["_id"])
        del product["_id"]
    return products

async def get_product_by_id(product_id: str) -> Optional[dict]:
    product = db.products.find_one({"_id": ObjectId(product_id)})
    if product:
        product["id"] = str(product["_id"])
        del product["_id"]
    return product

async def update_product(product_id: str, product_data: dict) -> Optional[dict]:
    result = db.products.replace_one({"_id": ObjectId(product_id)}, product_data)
    if result.matched_count == 0:
        return None
    product_data["id"] = product_id
    return product_data

async def delete_product(product_id: str) -> bool:
    result = db.products.delete_one({"_id": ObjectId(product_id)})
    return result.deleted_count > 0
