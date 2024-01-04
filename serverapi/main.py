from fastapi import FastAPI
from serverapi.api import router as api_router
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("serverapi.main:app", host="0.0.0.0", port=8000, reload=True)
