import React, { useEffect, useState } from 'react';
import { getAuth, User, onAuthStateChanged } from 'firebase/auth';
import Image from "next/image";
import Header from "./components/header"
import Footer from "./components/footer"

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
    fetch(`/api/user/${encodeURIComponent(user.uid)}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUserInfo(data.user);
        setLlmTexts(data.llm_texts.slice(-5)); // 最新の5件のテキストを取得
      });
  }
 }, [user]);

 const handleDateClick = (id: number) => {
  setSelectedTextId(id);
 };

 return (
  <>
    <Header />
    <div className="relative bg-cover text-center h-[100px] flex flex-col min-h-screen">
      <div className="relative h-[100px]">
        <Image src="/colorBack.jpg" alt="Background Image" layout="fill" objectFit="cover" />
        <h1 className="absolute inset-0 bg-white bg-opacity-50 text-5xl">Mypage</h1>
      </div>

      {userInfo && (
 <div className="flex justify-center">
   <div className="space-y-2 w-full max-w-xl">
     <div className="flex items-center space-x-2">
       <div className='text-lg underline'>名前</div>
       <p className='font-bold text-left flex-1'>{userInfo.name}</p>
     </div>
     <div className="flex items-center space-x-2">
       <div className='text-lg underline'>Email</div>
       <p className='font-bold text-left flex-1'>{userInfo.email}</p>
     </div>
     <div className="flex items-center space-x-2">
       <div className='text-lg underline'>性別</div>
       <p className='font-bold text-left flex-1'>{userInfo.gender}</p>
     </div>
     <div className="flex items-center space-x-2">
       <div className='text-lg underline'>年齢</div>
       <p className='font-bold text-left flex-1'>{userInfo.age_range}</p>
     </div>
     <div className="flex items-center space-x-2">
       <div className='text-lg underline'>居住地</div>
       <p className='font-bold text-left flex-1'>{userInfo.address}</p>
     </div>
     {/* <div className="flex items-center space-x-2">
       <div className='text-lg underline'>トークモード</div>
       <p className='font-bold text-left flex-1'>{userInfo.talk_mode}</p>
     </div> */}
     <div className="flex items-center space-x-2">
       <div className='text-lg underline'>経験職種</div>
       <p className='font-bold text-left flex-1'>{userInfo.job_title}</p>
     </div>
     <div className="flex items-center space-x-2">
       <div className='text-lg underline'>経験年数</div>
       <p className='font-bold text-left flex-1'>{userInfo.years_of_experience}</p>
     </div>
   </div>
 </div>
)}

<div className='text-lg bg-brown-400 text-white px-2 py-1 rounded-full inline-block'>
 相談したよ
</div>

{Array.isArray(llmTexts) && llmTexts.map((text, index) => (
 <div key={index}>
   <button onClick={() => handleDateClick(index)}>
     ・{new Date(text.created_at).toLocaleDateString('ja-JP')}
   </button>
   {selectedTextId === index && (
     <>
       <p className='text-lg'>{text.request_text}</p>
       <p className='text-lg'>{text.response_text}</p>
     </>
   )}
 </div>
))}
      <footer className="bg-gray-100 text-center p-2 absolute bottom-0 w-full ">
  <p className="text-sm text-gray-600">
    © {new Date().getFullYear()} Harebare company. All rights reserved.
  </p>
  <a href="/privacy-policy" className="text-sm text-gray-600 hover:underline">
    プライバシーポリシー
  </a>
</footer>
</div>
  </>
);
}
export default MyPage;