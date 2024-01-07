from langchain.prompts import PromptTemplate
from langchain.llms import OpenAI
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from serverapi.database.database import get_db
from serverapi.services.service import UserService


router = APIRouter()

# 環境変数の読み込み
load_dotenv()

llm = OpenAI(temperature=0.2)


@router.post("/chat")
async def create_chat(chat: dict, db: Session = Depends(get_db)):
    try:
        # フロントエンドからの質問を受け取る
        user_question = chat.get("query_text")
        print("query_text", user_question)
        # firebase_idをフロントから受け取る
        firebase_uid = chat.get("firebase_uid")
        print("firebase_uid", firebase_uid)
        # ユーザー情報を取得
        user = UserService(db).get_user_info(firebase_uid)
        print("user", user)
        # クライアントから送信したテキストと、DBから取得したユーザーデータを反映したプロンプト
        template = f"""
        あなたは環境やライフステージの変化に伴うキャリアに悩む人々の相談相手の役割を担っています。

        ＃相談相手の前提条件
        年齢は{user.age_range}
        性別は{user.gender}
        職歴は{user.job_title} {user.years_of_experience}

        {{subject}}の内容に対して前提条件を基に答えてください。
        もし{{subject}}の内容がキャリア、転職、仕事に関係あるか判断して、もし関係ない場合は「おや？私の専門分野とは違いますが一生懸命考えて回答します」と前置きをつけてください。
        回答の口調は{user.talk_mode}。
        回答の冒頭で{user.nick_name}に寄り添う一言を加えてください。
        回答の最後にエールを送る一言を加えてください。
        回答は簡潔にわかりやすく、500文字以内でまとめてください。
        回答が300字を超える場合は箇条書きにするなど読みやすくしてください。
        """

        prompt = PromptTemplate(
           template=template,
           input_variables=["subject"]
        )

        # ChatGPTに送るためのプロンプトを作成
        prompt_text = prompt.format(subject=user_question)
        print(prompt_text)

        llm = OpenAI(
            model_name="text-davinci-003",
            max_tokens=1000)

        response = llm(prompt_text)

        print(response)

        # 問い合わせと回答をDBに保存
        UserService(db).create_llm_text(user_question, response, user.user_id)

        return {"response": response}

    except Exception as e:
        # エラーが発生した場合はエラーレスポンスを返す
        raise HTTPException(status_code=500, detail=str(e))

data_store = []
