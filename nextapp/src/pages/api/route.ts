// import { NextResponse} from "next/server";

// export  async function GET() {
//   try {
//     const response = await fetch("http://127.0.0.1:8000/"); 
//     const data = await response.json();

//     return NextResponse.json({
//       message: "データを取得しました！",
//       data: data, // FastAPIから受け取ったデータを含める
//     });
//   } catch (error) {
//     console.error("データの取得中にエラーが発生しました:", error);
//     return NextResponse.json({
//       message: "データの取得中にエラーが発生しました。",
//       error: true,
//     });
//   }
// }

// export  default async function POST(request) {
//   console.log("!!!!!!!!!!!!!!")
//   try {
//     const payload = await request.json();

//     // パースしたペイロードを使用してFastAPIサーバーにPOSTリクエストを送信
//     const response = await fetch("http://127.0.0.1:8000/post", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(payload),
//     });

//     if (!response.ok) {
//       throw new Error("サーバーからエラーレスポンスが返されました。");
//     }

//     let postData;
//     try {
//       postData = await response.json();
//     } catch (jsonError) {
//       console.error("JSONパース中にエラーが発生しました:", jsonError);
//       // JSONが空の場合に備えてpostDataを空のオブジェクトで初期化
//       postData = {};
//     }

//     return NextResponse.json({
//       message: "データを送信しました！",
//       data: postData,
//     });
//   } catch (error) {
//     console.error("データの送信中にエラーが発生しました:", error);
//     return NextResponse.json({
//       message: "データの送信中にエラーが発生しました。",
//       error: true,
//     });
//   }
// }


// import { NextApiRequest, NextApiResponse } from 'next';
// import axios from 'axios';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   console.log("!!!!!!!!!!!!!!")
//   if (req.method === 'POST') {
//     try {
//       const formData = req.body; // POSTリクエストのボディからデータを取得

//       // FastAPIのエンドポイントにデータを送信
//       const response = await axios.post('http://127.0.0.1:8000/post', formData);

//       // FastAPIからのレスポンスをコンソールに表示
//       console.log('Response from FastAPI:', response.data);

//       // レスポンスを返す
//       res.status(200).json({ success: true, message: 'Registration successful' });
//     } catch (error) {
//       console.error('Error during registration:', error);
//       res.status(500).json({ success: false, message: 'Internal Server Error' });
//     }
//   } else {
//     // POST以外のリクエストには対応しない
//     res.status(405).json({ success: false, message: 'Method Not Allowed' });
//   }
// }




// /api/route.ts

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
     if (req.method === 'POST') {
      // POST メソッドの処理
      const postData = req.body;
      console.log("postData:",postData);
      // リクエストのボディからデータを取得
      const postRes = await fetch("http://serverapi:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      }); 

      if (!postRes.ok) {
        throw new Error(`HTTP error! Status: ${postRes.status}`);
      }
      // サーバーからの JSON データを取得
      const postDataResult = await postRes.json();


      res.status(200).json({ message: 'Success', data: postDataResult });
    } else {
      // サポートしていないメソッドの場合
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}