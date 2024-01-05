import Link from "next/link";
import Image from "next/image";
import Header from "./components/header"

export default function Main() {
  return (
    <>
    <Header />
  <div className="relative text-4xl bg-cover bg-red-50">
  <div style={{ position: 'relative', height: '1000px' }}> 
    <Image src="/colorBack.jpg" alt="Background Image" layout="fill" objectFit="cover" />
  </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
      <div className="flex items-center" style={{ marginTop: '50px' }}>
          <Image src="/cloud.PNG" alt="Image" width={300} height={10} />
          <Image src="/harebare.PNG" alt="Image" width={500} height={10} />
        </div>
        <div className="m-15 p-40  text-lg font-mono italic font-medium text-gray-500 antialiased  text-left" 
        style={{ marginTop: '-100px' }}>
        はればれはキャリアに悩むあなたの一歩となります
        <p>環境や、住む場所が変わり</p>
        <p>どんな働き方があるだろう</p>
        <p>もっといろんな働き方があるかな</p>
        <p>このままキャリアを築くほうがよいかな</p>
        <p>そんな悩みをサポートします</p>
        <p>今のあなたの気落ちを入れてみましょう</p>
        
      </div>
      
      <div className="text-center space-x-10 m-15">
        <Link href="/Home">
          <button className="bg-red-300 text-white px-3 py-1 rounded-full transition hover:opacity-60 shadow-lg">
            ログイン
          </button>
        </Link >
        <Link href="/Login">
        <button className="bg-red-300 text-white px-3 py-1 rounded-full transition hover:opacity-60 shadow-lg">
          新規登録
        </button>
        </Link>
        </div>
      </div>
      </div>
  </>
  );
}