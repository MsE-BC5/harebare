import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { uid } = req.body;

    // FastAPIにデータを送信
    const response = await fetch('http://serverapi:8000/endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uid }),
    });

    const data = await response.json();

    // レスポンスを返す
    res.status(200).json(data);
  } else {
    // POST以外のリクエストには対応しない
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}