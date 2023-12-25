//Home/page.tsx




"use client"

import Link from "next/link";

export default function Main() {
  return (
    <>
      <div className="text-pink-300 text-7xl font-medium tracking-wide text-center font-HachiMaruPop">
        <h1>はればれ</h1>
      </div>

      <div className="m-5 p-40 shadow-xl text-center">
        はればれの説明
      </div>

      <div className="text-center">
        <Link href="/Home">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            ログイン
          </button>
        </Link>
        <Link href="/mypage">新規登録</Link>
      </div>
  </>
  );
}











