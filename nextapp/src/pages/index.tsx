import Link from "next/link";
import Image from "next/image";
import Header from "./components/header"
import { useRouter } from "next/router";
import { useRegistrationInfo } from '../../context/auth';
import { doc, getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function Main() {
  const router = useRouter();
  const registrationInfo = useRegistrationInfo();

  const handleLogin = async () => {
    try {
      const customerRef = doc(collection(db, 'customers'), registrationInfo.id);
      
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
      <div className="relative text-4xl bg-cover bg-red-50">
        <div className="relative h-[1500px]">
          <Image src="/colorBack.jpg" alt="Background Image" layout="fill" objectFit="cover" />
        <div className="absolute inset-0 bg-white bg-opacity-50"></div>
        </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
      <div className="flex items-center mt-5">
        <Image src="/cloud.PNG" alt="Image" width={300} height={10} />
        <Image src="/harebare.PNG" alt="Image" width={550} height={10} />
      </div>
      <div className="m-15 p-40  text-lg font-mono  font-bold text-gray-600 antialiased text-left" 
        style={{ marginTop: '-150px' }}>
        はればれはキャリアに悩むあなたの一歩となります
        <p>環境や、住む場所が変わり</p>
        <p>どんな働き方があるだろう</p>
        <p>もっといろんな働き方があるかな</p>
        <p>このままキャリアを築くほうがよいかな</p>
        <p>そんなモヤモヤした悩みに</p>
        <p>いつでも、どこからでも耳を傾けサポートします</p>
      </div>
      <div className="flex justify-start w-full">
      <div className="text-lg font-mono  font-bold text-gray-600 antialiased text-left px-20 mb-10">
        はればれにできること
        <p>・相談機能</p>
        テキストボックスに打ち込むだけで登録した情報に基づき<br />
        あなたに合わせたアドバイスをお届けします
        <p>・個人設定機能</p>
        職歴、性別、年齢などアドバイスに反映したい項目を設定できます
        <p>・履歴機能</p>
        相談内容の履歴を確認できます
      </div>
      </div>
      
      <div className="flex justify-end w-full">
      <div className="text-lg font-mono font-bold text-gray-600 antialiased text-left px-20">
      使い方
        <p>1.新規登録、もしくはログインをしてください</p>
        <p>2.相談ページにて今の気持ちを書き込んでください</p>
        <p>3.あなた向けのアドバイスが届きます</p>
        <p>4.過去の相談内容を見たい場合は<br />
      マイページから履歴の確認をしてください</p>
      <div className="bg-brown-300 text-white p-6 rounded-lg shadow-lg m-4">
        <p className="mb-2">月額300円</p>
        <p className="mb-2 text-xs">7日間お試し期間のあとに有料となります</p>
      </div>
      </div>
      </div>
      
      <div className="text-center space-x-10 m-20">
          <button className="bg-brown-400 text-white px-3 py-1 rounded-full transition hover:opacity-60 shadow-lg text-lx"
          onClick={handleLogin}>
            ログイン
          </button>
        <Link href="/Login">
        <button className="bg-brown-400 text-white px-3 py-1 rounded-full transition hover:opacity-60 shadow-lg text-lx">
          新規登録
        </button>
        </Link>
        </div>
      </div>
      </div>
  </>
  );
}

