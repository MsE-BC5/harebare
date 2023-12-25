from fastapi import FastAPI
from .api import router as api_router

app = FastAPI()

# ルーターをアプリケーションに含める
app.include_router(api_router)

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
