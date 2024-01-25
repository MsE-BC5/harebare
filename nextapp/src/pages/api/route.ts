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