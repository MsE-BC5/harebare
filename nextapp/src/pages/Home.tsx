import React, { useState } from "react";
import Image from "next/image";
import Header from "./components/header";
import { useRegistrationInfo } from "../../context/auth"; // useRegistrationInfoをインポート
import Link from "next/link";

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
      <div className="relative  bg-cover bg-red-50 text-center">
        <div className="relative h-[1300px]">
          <Image src="/colorBack.jpg" alt="Background Image" layout="fill" objectFit="cover" />
        <div className="absolute inset-0 bg-white bg-opacity-60"></div>
        </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
      <div className="flex items-center mt-5">
        <Image src="/cloud.PNG" alt="Image" width={300} height={10} />
        <Image src="/carrier.PNG" alt="Image" width={400} height={10} />
      </div>

      <div className="text-center" style={{ marginTop: '100px' }}>
        <textarea
          value={queryText}
          onChange={(e) => setQueryText(e.target.value)}
          placeholder="悩みを入力してね"
          className="rounded border bg-gray-100 p-20 w-144 text-center" style={{ marginTop: '-200px' }}
        />
      <div className="pt-5 text-center">
      <button
        onClick={fetchData}
        className="bg-brown-400 text-white px-7 py-3 rounded-full transition hover:opacity-60 shadow-lg text-2xl"
      >
        送信
      </button>
      {data && (
        <div className="m-7 mx-auto max-w-[60%] text-left">
          <p className="whitespace-pre-wrap">{data.postData}</p>
        </div>
      )}
      <div>
        <Link href="/">
          <button className="bg-brown-400 text-white px-3 py-1 rounded-full transition hover:opacity-60 shadow-lg m-8">
            戻る
          </button>
        </Link>
      </div>
      </div>
    </div>
    </div>
    </div>
    </>
  );
}

export default Home;