import React, { useState } from "react";
import Image from "next/image";
import Header from "./components/header"

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

      // GETリクエスト
      const getResponse = await fetch("/api/route");
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
        type="text"
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
          <p>POSTのデータ: {data.postData}</p>
          <p>GETのデータ: {data.getData}</p>
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


// import React, { useState } from "react";
// import Image from "next/image";

// function Home() {
//   const [data, setData] = useState(null);
//   const [inputText, setInputText] = useState("");

//   const fetchData = async () => {
//     try {
//       // POSTデータを作成
//       const postData = { text: inputText };

//       // POSTリクエスト
//       const postResponse = await fetch("/api/route", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(postData),
//       });

//       if (!postResponse.ok) {
//         throw new Error(`HTTP error! Status: ${postResponse.status}`);
//       }

//       // POSTのレスポンスを取得
//       const postDataResult = await postResponse.json();

//       // GETリクエスト
//       const getResponse = await fetch("/api/route");
//       const getData = await getResponse.json();

//       setData({
//         postData: postDataResult,
//         getData: getData,
//       });
//     } catch (error) {
//       console.error("データの取得中にエラーが発生しました:", error);
//     }
//   };

//   return (
//     <>
//       <Image className="m-10 p-20" src="/cloud.PNG" alt="Image" width={400} height={10} />
//       <div className=" text-center">
//       <input
//         type="text"
//         value={inputText}
//         onChange={(e) => setInputText(e.target.value)}
//         placeholder="テキストを入力してね"
//         className="rounded border bg-gray-100 p-20 "
//       />
//       <div>
//       <button onClick={fetchData}
//       className="bg-gray-500 text-white px-5 py-1 rounded-full transition hover:opacity-60 m-5">送信</button></div>
//       {data && (
//         <div>
//           <p>POSTのデータ: {JSON.stringify(data.postData)}</p>
//           <p>GETのデータ: {JSON.stringify(data.getData)}</p>
//         </div>
//       )}
//       </div>
//     </>
//   );
// }

// export default Home;
