import React, { useEffect, useState } from 'react';
import { getAuth, User, onAuthStateChanged } from 'firebase/auth';

const MyPage: React.FC = () => {
 const [user, setUser] = useState<User | null>(null);
 const [userInfo, setUserInfo] = useState<any>(null);
 const [llmTexts, setLlmTexts] = useState<any[]>([]);
 const [selectedTextId, setSelectedTextId] = useState<number | null>(null);

 useEffect(() => {
   const auth = getAuth();
   const unsubscribe = onAuthStateChanged(auth, (user) => {
     setUser(user);
   });

   return () => unsubscribe();
 }, []);

 useEffect(() => {
   if (user) {
     const intervalId = setInterval(() => {
       fetch(`/api/user/${encodeURIComponent(user.uid)}`)
         .then((res) => res.json())
         .then((data) => {
           setUserInfo(data.user);
           setLlmTexts(data.llm_texts);
         });
     }, 5000); // 5秒ごとにAPIをポーリング

     return () => clearInterval(intervalId); // コンポーネントがアンマウントされたときにインターバルをクリア
   }
 }, [user]);

 const handleDateClick = (id: number) => {
   setSelectedTextId(id);
 };

 return (
   <div>
     {userInfo && (
       <>
         <h1>Name:{userInfo.name}</h1>
         <p>Email:{userInfo.email}</p>
         <p>Gender: {userInfo.gender}</p>
         <p>Age Range: {userInfo.age_range}</p>
         <p>Address: {userInfo.address}</p>
         <p>Talk Mode: {userInfo.talk_mode}</p>
         <p>Job Title: {userInfo.job_title}</p>
       </>
     )}
     {Array.isArray(llmTexts) && llmTexts.map((text, index) => (
       <div key={index}>
         <button onClick={() => handleDateClick(index)}>
           Created At: {text.created_at}
         </button>
         {selectedTextId === index && (
           <>
             <p>Request Text: {text.request_text}</p>
             <p>Response Text: {text.response_text}</p>
           </>
         )}
       </div>
     ))}
   </div>
 );
};

export default MyPage;