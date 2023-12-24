import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from router import llm


app = FastAPI()
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
    uvicorn.run(app, host="0.0.0.0", port=8000)

