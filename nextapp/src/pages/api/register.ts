// import { NextApiRequest, NextApiResponse } from 'next';
// import axios from 'axios';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   console.log("!!!!!!!!!!!!!!")
//   if (req.method === 'POST') {
//     try {
//       const formData = req.body; // POSTリクエストのボディからデータを取得

//       // FastAPIのエンドポイントにデータを送信
//       const response = await axios.post('http://serverapi:8000/users', formData);

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

// import { NextApiRequest, NextApiResponse } from 'next';
// import axios, { AxiosError, AxiosResponse } from 'axios';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     try {
//         const response: AxiosResponse = await axios.post('http://localhost:8000/user', JSON.stringify(req.body), {
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });
//         res.status(200).json(response.data);
//     } catch (error) {
//         console.error(error);
//         if (axios.isAxiosError(error)) {
//             const axiosError: AxiosError = error;
//             res.status(500).json({ error: axiosError.message, response: axiosError.response?.data });
//         } else {
//             res.status(500).json({ error: 'Internal Server Error' });
//         }
//     }
// }





// export default async function POST(request) {
//     console.log("!!!!!!!!!!!!!!")
//     try {
//       let payload;
  
//       // request.bodyがJSON文字列かどうか確認
//       if (typeof request.body === 'string') {
//         payload = JSON.parse(request.body);
//       } else {
//         // 既にJSONとしてパースされている場合はそのまま使用
//         payload = request.body;
//       }
  
//       // パースしたペイロードを使用してFastAPIサーバーにPOSTリクエストを送信
//       const response = await fetch("http://127.0.0.1:8001/user", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });
  
//       if (!response.ok) {
//         throw new Error("サーバーからエラーレスポンスが返されました。");
//       }
  
//       let postData;
//       try {
//         postData = await response.json();
//       } catch (jsonError) {
//         console.error("JSONパース中にエラーが発生しました:", jsonError);
//         // JSONが空の場合に備えてpostDataを空のオブジェクトで初期化
//         postData = {};
//       }
  
//       // Responseオブジェクトを直接返す
//       return new Response(
//         JSON.stringify({
//           message: "データを送信しました！",
//           data: postData,
//         }),
//         {
//           headers: { "Content-Type": "application/json" },
//         }
//       );
//     } catch (error) {
//       console.error("データの送信中にエラーが発生しました:", error);
      
//       // エラーメッセージを含むResponseオブジェクトを直接返す
//       return new Response(
//         JSON.stringify({
//           message: "データの送信中にエラーが発生しました。",
//           error: true,
//         }),
//         {
//           headers: { "Content-Type": "application/json" },
//           status: 500, // エラーのステータスコードを設定
//         }
//       );
//     }
//   }
  

// api/register.tsx

// import { NextApiRequest, NextApiResponse } from 'next';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     try {
//       const formData = req.body; // POSTリクエストのボディからデータを取得

//       // ここで formData を使用して必要な処理を行う

//       // 例: データをコンソールに表示
//       console.log('Received data:', formData);

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



//pages/api/register.ts

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("!!!!!!!!!!!!!!");
  if (req.method === 'POST') {
    try {
      const formData = req.body; // POSTリクエストのボディからデータを取得
      console.log(req.body);
      // FastAPIのエンドポイントにデータを送信
      const apiUrl = 'http://serverapi:8000/users';
      const fetchOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      };

      const response = await fetch(apiUrl, fetchOptions);

      // if (!response.ok) {
      //   // FastAPIからエラーレスポンスが返ってきた場合
      //   const errorData = await response.json();
      //   throw new Error(`FastAPI Error: ${errorData.message}`);
      // }
      if (!response.ok) {
        // FastAPIからエラーレスポンスが返ってきた場合
        const errorData = await response.json();
        console.error('Full error response from FastAPI:', errorData);
        throw new Error(`FastAPI Error: ${errorData}`);
      }

      // FastAPIからのレスポンスをコンソールに表示
      const responseData = await response.json();
      console.log('Response from FastAPI:', responseData);

      // レスポンスを返す
      res.status(200).json({ success: true, message: 'Registration successful' });
    } catch (error) {
      console.error('Error during registration:', error.message);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  } else {
    // POST以外のリクエストには対応しない
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}