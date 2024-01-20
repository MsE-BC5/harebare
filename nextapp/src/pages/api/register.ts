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
    } catch (error:any) {
      console.error('Error during registration:', error.message);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  } else {
    // POST以外のリクエストには対応しない
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
};