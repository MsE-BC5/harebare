"use client";

import React, { useState } from "react";

function Home() {
  const [data, setData] = useState(null);
  const [inputText, setInputText] = useState("");

  const fetchData = async () => {
    try {
      // POSTデータを作成
      const postData = { text: inputText };

      // POSTリクエスト
      const postResponse = await fetch("/api/product", {
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

      // GETリクエスト
      const getResponse = await fetch("/api/product");
      const getData = await getResponse.json();

      setData({
        postData: postDataResult,
        getData: getData,
      });
    } catch (error) {
      console.error("データの取得中にエラーが発生しました:", error);
    }
  };

  return (
    <div className="text-center">
      <h1>どうしたの？</h1>
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="テキストを入力してね"
      />
      <button onClick={fetchData}>送信</button>
      {data && (
        <div>
          <p>POSTのデータ: {JSON.stringify(data.postData)}</p>
          <p>GETのデータ: {JSON.stringify(data.getData)}</p>
        </div>
      )}
    </div>
  );
}

export default Home;