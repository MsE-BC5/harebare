import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("!!!!!!!!!!!!!!");  
  if (req.method === 'POST') {
      const { id } = req.query;
      const { payment_id } = req.body;
      console.log(req.body);
      try {
          const response = await fetch(`http://serverapi:8000/api/payment/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ payment_id }),
        });
  
        // FastAPIからのレスポンスをクライアントに返す
        const data = await response.json();
        res.status(response.status).json(data);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  }