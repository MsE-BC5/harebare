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


// export default async function handler(req, res) {
//   const { user_id } = req.query;

//   try {
//     const apiUrl = `http://serverapi:8000/user/${user_id}`;
//     const response = await fetch(apiUrl);

//     if (response.ok) {
//       const userData = await response.json();
//       res.status(200).json(userData);
//     } else {
//       console.error('Failed to fetch user data:', response.statusText);
//       res.status(response.status).json({ error: 'Failed to fetch user data' });
//     }
//   } catch (error) {
//     console.error('Error fetching user data:', error.message);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }


// export default async function handler({ query }, res) {
//   const { user_id } = query;

//   try {
//     const apiUrl = `http://serverapi:8000/user/${user_id}`;
//     const response = await fetch(apiUrl);

//     if (response.ok) {
//       const userData = await response.json();
//       res.status(200).json(userData);
//     } else {
//       console.error('Failed to fetch user data:', response.statusText);
//       res.status(response.status).json({ error: 'Failed to fetch user data' });
//     }
//   } catch (error) {
//     console.error('Error fetching user data:', error.message);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }


// import { NextApiRequest, NextApiResponse } from 'next';
// import axios from 'axios';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   console.log("!!!!!!!!!!!!!!")
//   if (req.method === 'GET') {
//     try {
//       const { user_id } = req.query;

//       // FastAPIのエンドポイントにデータを送信
//       const response = await axios.get(`http://serverapi:8000/user/${user_id}`);

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
