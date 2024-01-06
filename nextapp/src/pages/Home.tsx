
import React, { useState } from "react";
import Image from "next/image";
import Header from "./components/header";
import { useRegistrationInfo } from "../../context/auth"; // useRegistrationInfoをインポート

function Home() {
    const [data, setData] = useState({
    postData: null,
  });
  const [queryText, setQueryText] = useState('');
  const { id: userId } = useRegistrationInfo(); // ログインユーザーのIDを取得
  const formatTextWithNewlines = (text: any) => {
    return text.split('\n').map((line: any, index: any) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  const fetchData = async () => {
      try {
      // POSTデータを作成
      const postData = {
        query_text: queryText,
        firebase_uid: userId // ログインユーザーのIDを含める
       };
       console.log(postData);
      // POSTリクエスト
      const postResponse = await fetch("/api/route", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!postResponse.ok) {
        throw new Error(`HTTP error! Status: ${postResponse.status}`);
      }

      // POSTのレスポンスを取得
      const postDataResult = await postResponse.json();

      // POSTのデータに改行を適用
      const formattedPostData = formatTextWithNewlines(postDataResult.data.response);
 
      setData({
        postData: formattedPostData
      });
    } catch (error) {
      console.error("データの取得中にエラーが発生しました:", error);
    }
  };

  return (
    <>
    <Header />
      <div style={{ position: 'relative', height: '1000px',  marginTop: '-150px' }}>
        {/* <Image src="/colorBack.jpg" alt="Background Image" layout="fill" objectFit="cover" /> */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="flex items-center">
            <Image src="/cloud.PNG" alt="Image" width={300} height={10} />
            <Image src="/carrier.PNG" alt="Image" width={350} height={10} />
          </div>
      
    <div className="text-center" style={{ marginTop: '-100px' }}>
    <textarea
  value={queryText}
  onChange={(e) => setQueryText(e.target.value)}
  placeholder="テキストを入力してね"
  className="rounded border bg-gray-100 p-20"
/>
    <div>
      <button onClick={fetchData}
      className="bg-gray-500 text-white px-5 py-1 rounded-full transition hover:opacity-60 m-5">送信</button>
      {data && (
        <div>
          <p> {data.postData}</p>
        </div>
      )}
    </div>
    </div>
    </div>
    </div>
    {/* </div> */}
    {/* </div> */}
    </>
  );
}

export default Home;
