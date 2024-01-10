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

        # 年齢と性別に基づいた一般的なキャリアの悩み
        if user.gender == "男性":
            if "20代" in user.age_range:
                # 20代男性のキャリアの悩み
                general_concerns = ["キャリアアップの方法", "専門技術の習得"]
            elif "30代" in user.age_range:
                # 30代男性のキャリアの悩み
                general_concerns = ["ワークライフバランス", "キャリアチェンジ"]
            # その他の年齢層の悩みも同様に追加
        elif user.gender == "女性":
            if "20代" in user.age_range:
                # 20代女性のキャリアの悩み
                general_concerns = ["職場でのジェンダーイシュー", "キャリアプランニング"]
            elif "30代" in user.age_range:
                # 30代女性のキャリアの悩み
                general_concerns = ["育児と仕事の両立", "パートタイムの機会", "ライフステージの影響"]
            # その他の年齢層の悩みも同様に追加

        # {{subject}}の内容に対して前提条件と年齢と性別に基づいた一般的なキャリアの悩みを基に答えてください

        # キャリア、転職、仕事に関係あるか判断するパターン
        関連する質問 = [
            "キャリアに悩んでいます",
            "面接が怖いです",
            "カジュアル面談に向けて何をしたらいいですか",
            "転職エージェントは何社登録しますか",
            "キャリアチェンジとは何ですか",
            "給料が安いです",
            "職場の人間関係が嫌です",
            "仕事が嫌",
            "プロジェクト管理の経験を活かせる仕事はありますか？",
            "新卒でIT業界に入るためのアドバイス",
            "転職活動中に有利な資格",
            "キャリアアップのための自己啓発",
            "退職交渉の方法について",
            "職場のストレス管理テクニック",
            "効果的なリーダーシップ開発",
            "年収交渉のコツ",
            "テレワークの効率化方法",
            "職場での人間関係構築",
            "就職面接の準備",
            "キャリア計画の立て方",
            "仕事のパフォーマンス向上",
            "チームビルディングの戦略",
            "ワークライフバランスの改善",
            "メンタルヘルスと仕事のバランス",
            "ネットワーキングのスキル向上",
            "専門知識のアップデート方法",
            "職場でのコンフリクト解決",
            "転職後のオンボーディング"
        ]
        関連しない質問 = [
            "晩ごはん何にしよう",
            "何時間睡眠が最適ですか",
            "疲れた",
            "美味しいカフェを探して",
            "今夜の映画のおすすめ",
            "週末の天気予報",
            "読書の趣味について",
            "ペットのトレーニング方法",
            "おすすめのスポーツ",
            "地元の観光スポット",
            "映画鑑賞のコツ",
            "料理のレシピを教えて",
            "健康的な生活習慣",
            "自転車の選び方",
            "花の育て方",
            "ゲームのレビュー",
            "ファッションアドバイス",
            "家庭菜園のコツ",
            "旅行計画のアイデア",
            "ヨガのポーズについて",
            "写真撮影の技術",
            "音楽のジャンル解説",
            "星座占いの信憑性",
            "美術館の展示案内"
        ]

        # {{subject}}に基づいた処理
        if {{subject}} in 関連する質問 or {{subject}} in general_concerns:
            # 直接回答
            回答内容をここに記述
        else:
            # 関連しない場合の前置きをつけて回答
            「おや？私の専門分野とは違いますが一生懸命考えて回答します。」
            回答内容をここに記述

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
            # model_name="text-davinci-003",
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