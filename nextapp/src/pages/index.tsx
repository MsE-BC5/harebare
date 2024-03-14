import Link from "next/link";
import Image from "next/image";
import Header from "./components/header"
import { useRouter } from "next/router";
import { useRegistrationInfo } from '../context/auth';
import { doc, getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Main() {
  const router = useRouter();
  const registrationInfo = useRegistrationInfo();

  const handleLogin = async () => {
    try {
      const customerRef = doc(collection(db, 'customers'), registrationInfo.id);
      console.log('user object:',registrationInfo );

      
      // paymentsコレクションのドキュメントIDを取得
      const paymentsColRef = collection(customerRef, 'payments');
      const paymentsQuery = await getDocs(paymentsColRef);
  
      const paymentDocId = paymentsQuery.empty ? null : paymentsQuery.docs[0].id;
  
      // Homeかunauthorisedに遷移
      router.push(paymentDocId ? "/Home" : "/unauthorised");
    } catch (error) {
      console.error('Error fetching user data:', error);
      // エラーハンドリングが必要な場合は適切な処理を追加
      router.push("/unauthorised");
    }
  };


  return (
    <>
<Header />
<div className="relative text-2xl text-center flex flex-col min-h-screen">
  <div className="relative bg-cover h-[300px] ">
    {/* 上部に配置する背景画像 */}
    <Image src="/colorBack.jpg" alt="Background Image" layout="fill" objectFit="cover"/>
    <div className="absolute inset-0 bg-white bg-opacity-60"></div>

    {/* 上に重ねるコンテンツ */}
    <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
      <div className="flex items-center mt-5">
        <Image src="/cloud.PNG" alt="Cloud Image" width={300} height={300} />
        <Image src="/harebare.PNG" alt="Harebare Image" width={550} height={300} />
      </div>
    </div>
  </div>

      <div className="flex justify-center">
        <div className="text-3xl font-bold text-center pt-8">
      キャリアのお悩みありませんか？
        </div>
      </div>
<div className="flex justify-center">
  <div className="m-15 p-40 text-lg font-mono font-bold text-gray-600 antialiased text-left" 
      style={{ marginTop: '-130px', maxWidth: '760px' }}>
        はればれはキャリアに悩むあなたの一歩となります
          <p>環境や、住む場所が変わり</p>
          <p>どんな働き方があるだろう</p>
          <p>もっといろんな働き方があるかな</p>
          <p>このままキャリアを築くほうがよいかな</p>
          <p>そんなモヤモヤした悩みに</p>
          <p>いつでも、どこからでも耳を傾けサポートします</p>
  </div>
</div>
  <div className="text-3xl font-bold text-black antialiased px-10">
    はればれにできること<br />
  </div>
<div className="flex justify-between w-full px-20 py-10">
<div className="flex-1 rounded-lg px-10 py-10 text-center mx-5 text-gray-600 font-bold" style={{ background: 'radial-gradient(circle, #FFECDA 0%, #E57C64 100%)' }}>
  <p className="underline font-bold p-4">相談機能</p>
  <p className="text-lg">
    テキストボックスに打ち込むだけで登録した情報に基づきあなたに合わせたアドバイスをお届けします</p>
</div>
<div className="flex-1 rounded-lg px-10 py-10 text-center mx-5 text-gray-600 font-bold" style={{ background: 'radial-gradient(circle, #FFECDA 0%, #E57C64 100%)' }}>
  <p className="underline font-bold  p-4">個人設定機能</p>
  <p className="text-lg">職歴、性別、年齢などアドバイスに反映したい項目を設定できます</p>
</div>
<div className="flex-1 rounded-lg px-10 py-10 text-center mx-5 text-gray-600 font-bold" style={{ background: 'radial-gradient(circle, #FFECDA 0%, #E57C64 100%)' }}>
    <p className="underline font-bold p-4">履歴機能</p>
    <p className="text-lg">相談内容の履歴を<br />確認できます</p>
  </div>
</div>

<div className="text-3xl font-bold text-black antialiased px-10 pt-20">
    使い方<br />
  </div>
<div className="flex justify-center">
      <div className="text-lg font-mono font-bold text-gray-600 antialiased  px-20 text-left pt-5 pd-5">
        <p>1.新規登録、もしくはログインをしてください</p>
        <p>2.相談ページにて今の気持ちを書き込んでください</p>
        <p>3.あなた向けのアドバイスが届きます</p>
        <p>4.過去の相談内容を見たい場合は<br />
      マイページから履歴の確認をしてください</p>

<div className="pt-5">
  <div className="bg-brown-300 text-white p-7 rounded-lg shadow-lg m-2 max-w-sm text-left ">
    <p className="mb-5">月額300円</p>
    <p className="mb-2 text-xs">7日間お試し期間のあとに有料となります</p>
  </div>
</div>
</div>
      </div>
      
      <div className="text-center space-x-10 m-20 pb-10">
          <button className="bg-brown-400 text-white px-7 py-3 rounded-full transition hover:opacity-60 shadow-lg text-lx"
          onClick={handleLogin}>
            相談する
          </button>
        <Link href="/Login">
        <button className="bg-brown-400 text-white px-7 py-3 rounded-full transition hover:opacity-60 shadow-lg text-lx">
          新規登録
        </button>
        </Link>
        </div>
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

