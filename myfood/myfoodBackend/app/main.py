from fastapi import FastAPI
from routes.family_routes import router as family_router
from routes.user_routes import router as user_router
from routes.product_routes import router as product_router

app = FastAPI()

app.include_router(family_router, prefix="/families", tags=["families"])
app.include_router(user_router, prefix="/users", tags=["users"])
app.include_router(product_router, prefix="/products", tags=["products"])
