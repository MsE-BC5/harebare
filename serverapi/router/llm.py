from langchain.prompts import PromptTemplate
from langchain.llms import OpenAI
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException


router = APIRouter()

# 環境変数の読み込み
load_dotenv()

llm = OpenAI(temperature=0)

template = """
あなたは環境やライフステージの変化に伴うキャリアに悩む人々の相談相手の役割を担っています。

＃相談相手の前提条件
年齢は30〜40代
性別は女
職歴は事務職5年

{subject}の内容に対して前提条件を基に答えてください。
回答が300字を超える場合は箇条書きにするなど読みやすくしてください。

"""

prompt = PromptTemplate(
    template=template,
    input_variables=["subject"]
)


@router.post("/chat")
async def create_chat(chat: dict):
    try:
        # フロントエンドからの質問を受け取る
        user_question = chat.get("query_text")

        # ChatGPTに送るためのプロンプトを作成
        prompt_text = prompt.format(subject=user_question)

        print(prompt_text)

        llm = OpenAI(
            model_name="text-davinci-003",
            max_tokens=1000)
       
        response = llm(prompt_text)

        print(llm(prompt_text))

        return {"response": response}

    except Exception as e:
        # エラーが発生した場合はエラーレスポンスを返す
        raise HTTPException(status_code=500, detail=str(e))

data_store = []


# @router.get("/")
# async def get_data():
#     # 保存されている最後のデータを取得して返す
#     if data_store:
#         return data_store[-1]
#     else:
#         return {"message": "No data available"}

