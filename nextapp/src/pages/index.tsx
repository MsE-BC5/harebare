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
      <div style={{ position: 'relative', height: '1000px' }}> 
          <Image src="/colorBack.jpg" alt="Background Image" layout="fill" objectFit="cover" />
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
      <div className="flex items-center" style={{ marginTop: '50px' }}>
          <Image src="/cloud.PNG" alt="Image" width={300} height={10} />
          <Image src="/harebare.PNG" alt="Image" width={500} height={10} />
      </div>
      <div className="m-15 p-40  text-lg font-mono italic font-medium text-gray-500 antialiased text-left" 
        style={{ marginTop: '-150px' }}>
        はればれはキャリアに悩むあなたの一歩となります
        <p>環境や、住む場所が変わり</p>
        <p>どんな働き方があるだろう</p>
        <p>もっといろんな働き方があるかな</p>
        <p>このままキャリアを築くほうがよいかな</p>
        <p>そんなモヤモヤした悩みに</p>
        <p>いつでも、どこからでも耳を傾けサポートします</p>
      </div>
      
      <div className="text-lg font-mono italic font-medium text-gray-500 antialiased text-left ">
        はればれにできること
        <p>・相談機能</p>
        テキストボックスに打ち込むだけで登録した情報に基づき、あなたに合わせたアドバイスをお届けします
        <p>・個人設定機能</p>
        職歴、性別、年齢などアドバイスに反映したい項目を設定できます
        <p>・履歴機能</p>
        相談内容の履歴を確認できます
      </div>
      
      <div className="text-lg font-mono italic font-medium text-gray-500 antialiased  m-5 mx-auto ">
        使い方
        <p>1.新規登録、もしくはログインをしてください</p>
        <p>2.相談ページにて今の気持ちを書き込んでください</p>
        <p>3.あなた向けのアドバイスが届きます</p>
        <p>4.過去の相談内容を見たい場合は、マイページから履歴の確認をしてください</p>
      </div>
      
      
      <div className="text-center space-x-10 m-15">
          <button className="bg-red-300 text-white px-3 py-1 rounded-full transition hover:opacity-60 shadow-lg"
          onClick={handleLogin}>
            ログイン
          </button>
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

//pages/index.tsx

// import Link from "next/link";
// import { useRouter } from "next/router";
// import { useRegistrationInfo } from '../../context/auth';
// import { doc, getDocs, collection, query, where } from 'firebase/firestore';
// import { db } from '../../lib/firebase';

// export default function Main() {
//   const router = useRouter();
//   const registrationInfo = useRegistrationInfo();

//   const handleLogin = async () => {
//     try {
//       const customerRef = doc(collection(db, 'customers'), registrationInfo.id);
      
//       // paymentsコレクションのドキュメントIDを取得
//       const paymentsColRef = collection(customerRef, 'payments');
//       const paymentsQuery = await getDocs(paymentsColRef);
  
//       const paymentDocId = paymentsQuery.empty ? null : paymentsQuery.docs[0].id;
  
//       // Homeかunauthorisedに遷移
//       router.push(paymentDocId ? "/Home" : "/unauthorised");
//     } catch (error) {
//       console.error('Error fetching user data:', error);
//       // エラーハンドリングが必要な場合は適切な処理を追加
//       router.push("/unauthorised");
//     }
//   };
  
//  return (
//     <div className="text-4xl bg-cover">
//       <div className="text-pink-300 text-7xl font-medium tracking-wide text-center">
//         <h1>はればれ</h1>
//       </div>

//       <div className="m-5 p-40 shadow-xl text-center text-2xl">
//         はればれの説明
//       </div>

//       <div className="text-center">
//         {/* ログインボタンに handleLogin 関数を紐づけ */}
//         <button
//           onClick={handleLogin}
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           ログイン
//         </button>
//         <Link href="/Login">新規登録</Link>
//       </div>
//     </div>
//   );
// }