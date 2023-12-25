from fastapi import FastAPI
from .api import router as api_router
from fastapi.middleware.cors import CORSMiddleware
from router import llm


app = FastAPI()
# ルーターをアプリケーションに含める
app.include_router(api_router)

app.include_router(llm.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# @app.get("/")
# async def root():
#     return {"message": "Hello World"}

# @app.post("/post")
# async def create_item(item: dict):
#     """
#     Example of a POST endpoint that accepts a JSON payload.
#     """
#     # Here, 'item' is a dictionary containing the JSON payload.
#     return item


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("serverapi.main:app", host="0.0.0.0", port=8000, reload=True)


# 動作テスト用のHello World
# import uvicorn
# from fastapi import FastAPI

# app = FastAPI()


# @app.get("/")
# async def root():
#     return {"message": "Hello World"}


# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=8000)
