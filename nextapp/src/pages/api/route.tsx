import { NextResponse} from "next/server";

export async function GET() {
  try {
    const response = await fetch("http://serverapi:8000/"); 
    const data = await response.json();

    return NextResponse.json({
      message: "データを取得しました！",
      data: data, // FastAPIから受け取ったデータを含める
    });
  } catch (error) {
    console.error("データの取得中にエラーが発生しました:", error);
    return NextResponse.json({
      message: "データの取得中にエラーが発生しました。",
      error: true,
    });
  }
}

export async function POST(request) {
  console.log("!!!!!!!!!!!!!!")
  try {
    const payload = await request.json();

    // パースしたペイロードを使用してFastAPIサーバーにPOSTリクエストを送信
    const response = await fetch("http://serverapi:8000/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("サーバーからエラーレスポンスが返されました。");
    }

    let postData;
    try {
      postData = await response.json();
    } catch (jsonError) {
      console.error("JSONパース中にエラーが発生しました:", jsonError);
      // JSONが空の場合に備えてpostDataを空のオブジェクトで初期化
      postData = {};
    }

    return NextResponse.json({
      message: "データを送信しました！",
      data: postData,
    });
  } catch (error) {
    console.error("データの送信中にエラーが発生しました:", error);
    return NextResponse.json({
      message: "データの送信中にエラーが発生しました。",
      error: true,
    });
  }
}