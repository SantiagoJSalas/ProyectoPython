from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.family_routes import router as family_router
from routes.user_routes import router as user_router
from routes.product_routes import router as product_router

app = FastAPI()

# Configuración del middleware CORS
origins = [
    "http://localhost:3000",  # Cambia esto a la URL de tu aplicación Vue.js
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(family_router, prefix="/families", tags=["families"])
app.include_router(user_router, prefix="/users", tags=["users"])
app.include_router(product_router, prefix="/products", tags=["products"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)