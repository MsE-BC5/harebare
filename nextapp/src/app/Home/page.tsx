"use client";

import React, { useState } from "react";

function Home() {
  const [data, setData] = useState(null);
  const [queryText, setQueryText] = useState('');
  const [responseText, setResponseText] = useState('');

  const formatTextWithNewlines = (text) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  const fetchData = async () => {
    try {
      // POSTデータを作成
      const postData = { query_text: queryText };

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

      // POSTのデータに改行を適用
    const formattedPostData = formatTextWithNewlines(postDataResult.data.response);

      // GETリクエスト
      const getResponse = await fetch("/api/product");
      const getData = await getResponse.json();

      // GETのデータに改行を適用
      //const formattedGetData = formatTextWithNewlines(JSON.stringify(getData));


      setData({
        postData: formattedPostData,
        getData: formatTextWithNewlines(JSON.stringify(getData))
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
        value={queryText}
        onChange={(e) => setQueryText(e.target.value)}
        placeholder="テキストを入力してね"
      />
      <button onClick={fetchData}>送信</button>
      {data && (
        <div>
          <p>POSTのデータ: {data.postData}</p>
          <p>GETのデータ: {data.getData}</p>
        </div>
      )}
    </div>
  );
}

export default Home;
