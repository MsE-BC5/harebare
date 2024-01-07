import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { user_id } = req.query;

      // FastAPIのエンドポイントにデータを送信
      const response = await axios.get(`http://serverapi:8000/user/${user_id}`);

      // FastAPIからのレスポンスをコンソールに表示
      console.log('Response from FastAPI:', response.data);

      // レスポンスを返す
      res.status(200).json(response.data);
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  } else {
    // POST以外のリクエストには対応しない
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}