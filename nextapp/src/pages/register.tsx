import React, { useState, useEffect } from "react";
import { useRegistrationInfo } from "../../context/auth";
import { useRouter } from "next/router";
import {
  Firestore,
  getFirestore,
  doc,
  getDoc,
} from 'firebase/firestore';
import checkout from "../pages/checkout";
import Header from "./components/header"
import { prefectures } from 'jp-prefectures';
import Image from "next/image";


const Register = () => {
  const registrationInfo = useRegistrationInfo();
  const router = useRouter();

  // State for form fields
  const [name, setName] = useState(registrationInfo?.name || "");
  const [email, setEmail] = useState(registrationInfo?.email || "");
  const [nick_name, setNickname] = useState("");
  const [gender, setGender] = useState("");
  const [age_range, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [job_title, setJobTitle] = useState("");
  const [years_of_experience, setYearsExperience] = useState("");
  const [talk_mode, setTalkMode] = useState("やさしく");
  const [firestore, setFirestore] = useState<Firestore | null>(null); // Firestore インスタンスの状態を保持


  useEffect(() => {
    const initializeFirestore = () => {
      // Firestore インスタンスを取得
      const firestoreInstance: Firestore = getFirestore();
      setFirestore(firestoreInstance);
    };

    initializeFirestore(); // 初回レンダリング時に Firestore インスタンスを初期化
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Firestore インスタンスが存在し、かつ registrationInfo と id がある場合にユーザーデータを取得
        if (firestore && registrationInfo && registrationInfo.id) {
          const userRef = doc(firestore, 'users', registrationInfo.id);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            // フォームの初期値をセット
            setName(userData?.name || "");
            setEmail(userData?.email || "");
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    // registrationInfo が存在し、かつ id がある場合にデータを取得
    if (registrationInfo && registrationInfo.id) {
      fetchData();
    }
  }, [firestore, registrationInfo]);



  // 必須フィールドがすべて入力されているかどうかをチェックする関数
  const isFormValid = () => {
    return (
      name.trim() !== '' &&
      email.trim() !== '' &&
      nick_name.trim() !== '' &&
      gender.trim() !== '' &&
      age_range.trim() !== '' &&
      address.trim() !== '' &&
      job_title.trim() !== '' &&
      years_of_experience.trim() !== '' &&
      talk_mode.trim() !== ''
    );
  };

const handleFormSubmission = async (event: any) => {
  console.log('handleFormSubmission called'); // Add this line
  event.preventDefault();


  // フォームのバリデーションを行う
  if (!isFormValid()) {
    // 必須フィールドが適切に入力されていない場合は、ここで処理を中断
    alert('すべての必須フィールドを入力してください。');
    return; // フォームが無効な場合はここで処理を中断
  }


  try {
    // Firestore インスタンスが存在するか確認してからコレクションを参照
    if (firestore && registrationInfo && registrationInfo.id) {
      console.log('All conditions met'); // Add this line
      const userRef = doc(firestore, 'users', registrationInfo.id);

      // FastAPIにデータを保存
      const response = await fetch('api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firebase_uid: registrationInfo?.id,
          name,
          nick_name,
          email,
          gender,
          age_range,
          address,
          talk_mode,
          job_title,
          years_of_experience,
        }),
      });

      // 新しいUser型を作成
      type MyUser = {
        uid: string;
        emailVerified: boolean;
        isAnonymous: boolean;
      };


      // Registerコンポーネント内でのuserPayloadの型をMyUserに変更
      const userPayload: MyUser = { uid: registrationInfo.id, emailVerified: false, isAnonymous: false };

      // ユーザー登録が完了したらcheckout関数を呼び出す
      const doCheckout = async () => {
        await checkout(userPayload, router);
      };

      // 非同期関数を呼び出す
      doCheckout();
    } else {
      console.log('Some conditions not met'); // Add this line
      console.error('Firestore is undefined');
      // エラーハンドリングやユーザーに通知する処理を追加
    }
  } catch (error) {
    console.error('Error adding user data:', error);
  }
};


  return (
    <>
      <Header />
        <div className="relative  bg-cover">
        <div className="relative h-[900px]">
          <Image src="/colorBack.jpg" alt="Background Image" layout="fill" objectFit="cover" />
        <div className="absolute inset-0 bg-white bg-opacity-50">
        </div>
        </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
      <div className="flex items-center mt-5">
        <h1 className="text-center font-semibold text-3xl p-5 text-gray-700">
      新規登録</h1>
      </div>
        <form onSubmit={handleFormSubmission}>
          <div className='text-center m-3 text-gray-700'>
            <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ backgroundColor: '#f0f0f0' }}
            />
            </label>
          </div>
          <br />
          <div className='text-center m-3 text-gray-700'>
            <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ backgroundColor: '#f0f0f0' }}
            />
            </label>
          </div>
          <br />
          <div className='text-center m-3 text-gray-700'>
            <label>
            ニックネーム:
            <input
              type="text"
              value={nick_name}
              onChange={(e) => setNickname(e.target.value)}
              style={{ backgroundColor: '#f0f0f0' }}
            />
            </label>
          </div>
          <br />
          <div className='text-center m-3 text-gray-700'>
            <label>
            性別:
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              style={{ backgroundColor: '#f0f0f0' }}
            >
              <option value=""></option>
              <option value="男">男性</option>
              <option value="女">女性</option>
              <option value="無回答">無回答</option>
            </select>
            </label>
          </div>
          <br />
          <div className='text-center m-3 text-gray-700'>
            <label>
            年代:
            <select
              value={age_range}
              onChange={(e) => setAge(e.target.value)}
              style={{ backgroundColor: '#f0f0f0' }}
            >
              <option value=""></option>
              <option value="10代">10代</option>
              <option value="20代">20代</option>
              <option value="30代">30代</option>
              <option value="40代">40代</option>
              <option value="50代以上">50代以上</option>
            </select>
            </label>
          </div>
          <br />
          <div className='text-center m-3 text-gray-700'>
            <label>
            居住地:
            <select
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{ backgroundColor: '#f0f0f0' }}
            >
              <option value=""></option>
              {prefectures().map((prefecture) => (
              <option key={prefecture.code} value={prefecture.name}>
              {prefecture.name}
              </option>
              ))}
            </select>
            </label>
          </div>
          <br />
          <div className='text-center m-3 text-gray-700'>
            <label>
            直近の職歴 職種:
            <select
              value={job_title}
              onChange={(e) => setJobTitle(e.target.value)}
              style={{ backgroundColor: '#f0f0f0' }}
            >
              <option value=""></option>
              <option value="営業">営業</option>
              <option value="事務">事務</option>
              <option value="販売">販売</option>
              <option value="製造">製造</option>
              <option value="不動産">不動産</option>
              <option value="医療">医療</option>
              <option value="福祉">福祉</option>
              <option value="教師">教師</option>
              <option value="芸能">芸能</option>
              <option value="芸術">芸術</option>
              <option value="スポーツ">スポーツ</option>
              <option value="IT">IT</option>
              <option value="公務員">公務員</option>
              <option value="研究員">研究員</option>
              <option value="人事">人事</option>
              <option value="その他">その他</option>
            </select>
            </label>
          </div>
          <br />
          <div className='text-center m-3 text-gray-700'>
            <label>
            年数:
            <select
              value={years_of_experience}
              onChange={(e) => setYearsExperience(e.target.value)}
              style={{ backgroundColor: '#f0f0f0' }}
            >
              <option value=""></option>
              <option value="1年未満">1年未満</option>
              <option value="1~2年">1~2年</option>
              <option value="2~3年">2~3年</option>
              <option value="3~4年">3~4年</option>
              <option value="5年以上">5年以上</option>
              <option value="10年以上">10年以上</option>
            </select>
            </label>
          </div>
          <br />
          <div className='text-center m-3 text-gray-700'>
            <label>
            トークモード:
            <select
              value={talk_mode}
              onChange={(e) => setTalkMode(e.target.value)}
              style={{ backgroundColor: '#f0f0f0' }}
            >
              <option value=""></option>
              <option value="親身に優しい">やさしく</option>
              <option value="論理的に厳しい">厳しめ</option>
            </select>
            </label>
          </div>
          <br />
          <div className="text-center p-10 flex flex-row justify-center">
            <button
              type="submit"
              disabled={!isFormValid()} // フォームが有効でない場合はボタンを無効化
              className={`bg-brown-400 text-white px-5 py-4 rounded-full transition hover:opacity-60  ${!isFormValid() ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
            登録
            </button>
          </div>
        </form>
      </div>
      </div>
    </>
  );
  };
export default Register;
