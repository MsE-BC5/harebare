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

llm = OpenAI(temperature=0.1)


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

        ## 前提条件
        年齢は{user.age_range}
        性別は{user.gender}
        職歴は{user.job_title} {user.years_of_experience}

        {{subject}}の内容に対して、上記の前提条件を踏まえて悩みへの回答を具体的に作成してください。

        # 質問の意図分析
        - 質問の内容と文脈を分析し、その背後にある意図を特定します。
        - NLP技術を使用して質問のテキストから意図を抽出し、質問がキャリアアドバイス、業界情報、職場の悩み、子育てと仕事の両立、時短勤務など、どのカテゴリーに該当するかを判断します。

        ## {{subject}}に基づいた処理
        - {{subject}}の分析結果に基づき、適切な回答を生成します。
        - 意図がキャリアに関連するものであれば、直接的な回答を提供します。
        - 意図がキャリア関連でない場合は、「おや？私の専門分野とは違いますが一生懸命考えて回答します。」と前置きしてから回答します。

        {{subject}}が関連する質問か関連しない質問か判定して、前置きの有無を回答に反映してください。

        回答は簡潔にわかりやすく、500文字以内でまとめてください。
        回答が300字を超える場合は箇条書きにするなど読みやすくしてください。
        回答の口調は論理的で厳しく、叱咤激励してください。        
        """

        prompt = PromptTemplate(
            template=template,
            input_variables=["subject"]
        )

        # ChatGPTに送るためのプロンプトを作成
        prompt_text = prompt.format(subject=user_question)
        print(prompt_text)

        llm = OpenAI(
            model_name="gpt-3.5-turbo-instruct",
            max_tokens=1000)

        response = llm(prompt_text)

        print(response)

        # 問い合わせと回答をDBに保存
        UserService(db).create_llm_text(user_question, response, user.user_id)

        return {"response": response}

    except Exception as e:
        # エラーが発生した場合はエラーレスポンスを返す
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail=str(e))

data_store = []