from fastapi import FastAPI, HTTPException
from .api import router as api_router
from fastapi.middleware.cors import CORSMiddleware
from router import llm
from pydantic import BaseModel


app = FastAPI()
app.include_router(api_router)
app.include_router(llm.router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class UserCreate(BaseModel):
    id: str
    name: str
    nickname: str
    email: str
    gender: str
    age_range: str
    address: str
    talk_mode: str
    job_title: str
    years_of_experience: str


@app.post("/users")
def register_user(user: UserCreate):
    # ここでデータベースへの登録処理を実行する
    # データベースへの接続やモデルの作成などを行う必要があります
    print(user.dict())
    return {"message": "User registered successfully"}


@app.get("/user/{user_id}")
def get_user(user_id: int):
    # ここでユーザー情報をデータベースから取得する処理を実装する
    # データベースへの接続やクエリの実行などを行う必要があります
    # 以下はサンプルレスポンスで、実際のデータベースから取得した結果を返すことが想定されます
    user_info = {"user_id": user_id, "name": "John Doe", "email": "john@example.com"}
    return user_info


# main.pyに追加
# @app.post("/api/payment/{id}")
# async def create_payment(id: str, payment_item: PaymentItem):
#     try:
#         # 例として、受け取ったデータをそのまま返す
#         return {"id": id, **payment_item.dict()}
#     except Exception:
#         # エラーハンドリング
#         raise HTTPException(status_code=500, detail="Internal Server Error")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


# from fastapi import FastAPI, HTTPException
# from .api import router as api_router
# from fastapi.middleware.cors import CORSMiddleware
# from router import llm
# from pydantic import BaseModel


# app = FastAPI()
# # ルーターをアプリケーションに含める
# app.include_router(api_router)

# app.include_router(llm.router)

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # @app.get("/")
# # async def root():
# #     return {"message": "Hello World"}

# # @app.post("/post")
# # async def create_item(item: dict):
# #     """
# #     Example of a POST endpoint that accepts a JSON payload.
# #     """
# #     # Here, 'item' is a dictionary containing the JSON payload.
# #     return item


# # if __name__ == "__main__":
# #     import uvicorn
# #     uvicorn.run("serverapi.main:app", host="0.0.0.0", port=8000, reload=True)


# # 動作テスト用のHello World
# # import uvicorn
# # from fastapi import FastAPI

# # app = FastAPI()


# # @app.get("/")
# # async def root():
# #     return {"message": "Hello World"}

# # Pydanticモデルの定義
# class UserCreate(BaseModel):
#     name: str
#     email: str
#     nickname: str
#     gender: str
#     age: str
#     location: str
#     experienceType: str
#     experienceYears: str
#     talkmode: str


# # ユーザーの登録を行うエンドポイント
# @app.post("/user")
# def register_user(user: UserCreate):
#     # ここでデータベースへの登録処理を実行する
#     # データベースへの接続やモデルの作成などを行う必要があります
#     # この部分は実際のデータベースに合わせて変更してください
#     print(user.dict())
#     return {"message": "User registered successfully"}


# # ユーザー情報を取得するエンドポイント（GET）
# @app.get("/user/{user_id}")
# def get_user(user_id: int):
#     # ここでユーザー情報をデータベースから取得する処理を実装する
#     # データベースへの接続やクエリの実行などを行う必要があります
#     # この部分は実際のデータベースに合わせて変更してください
#     # 以下はサンプルレスポンスで、実際のデータベースから取得した結果を返すことが想定されます
#     user_info = {"user_id": user_id, "name": "John Doe", "email": "john@example.com"}
#     return user_info


# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=8000)


