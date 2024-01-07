from fastapi import FastAPI
from serverapi.api import router as api_router
from fastapi.middleware.cors import CORSMiddleware
from router import llm
# from pydantic import BaseModel


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

# @app.get("/user/{user_id}")
# def get_user(user_id: int):
#     # ここでユーザー情報をデータベースから取得する処理を実装する
#     # データベースへの接続やクエリの実行などを行う必要があります
#     # 以下はサンプルレスポンスで、実際のデータベースから取得した結果を返すことが想定されます
#     user_info = {"user_id": user_id,
#                  "name": "John Doe",
#                  "email": "john@example.com"}
#     return user_info


class User(BaseModel):
    uid: str


@app.post("/endpoint")
async def read_item(user: User):
    uid = user.uid
    # ここでuidを使用した処理を行う
    return {"uid": uid}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("serverapi.main:app", host="0.0.0.0", port=8000, reload=True)
