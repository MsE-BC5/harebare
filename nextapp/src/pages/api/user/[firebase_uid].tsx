import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req:any, res:any) {
 const { firebase_uid } = req.query;

 try {
 const userResponse = await fetch(`http://serverapi:8000/user/${encodeURIComponent(firebase_uid)}`);
 const db_user = await userResponse.json();

 if (!db_user) {
   res.status(404).json({ detail: 'User not found' });
   return;
 }

 const mypage_user_response = {
   name: db_user.name,
   nick_name: db_user.nick_name,
   email: db_user.email,
   gender: db_user.gender,
   age_range: db_user.age_range,
   address: db_user.address,
   talk_mode: db_user.talk_mode,
   job_title: db_user.job_title,
   years_of_experience: db_user.years_of_experience
 };

 const llmTextsResponse = await fetch(`http://serverapi:8000/llm_texts/${encodeURIComponent(firebase_uid)}`);
 const llm_texts = await llmTextsResponse.json();

 if (!llm_texts) {
   res.status(404).json({ detail: 'LLM texts not found' });
   return;
 }

 res.status(200).json({ user: mypage_user_response, llm_texts: llm_texts });
 } catch (error) {
 console.error(error);
 res.status(500).json({ error: 'Internal Server Error' });
 }
}