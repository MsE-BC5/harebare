import React, { useState, useEffect } from "react";
import { useRegistrationInfo } from "../../context/auth";
import { useRouter } from "next/router";
import {
  Firestore,
  getFirestore,
  doc,
  getDoc,
} from 'firebase/firestore';
import { prefectures } from 'jp-prefectures';
import checkout from "../pages/checkout";
import Header from "./components/header";


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

  // 新規登録フォームの送信ロジック
const handleFormSubmission = async (event: any) => {
  console.log('handleFormSubmission called'); // Add this line
  event.preventDefault();

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
    <div>
      <Header />
      <h1>Register</h1>
      <form onSubmit={handleFormSubmission}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <label>
          ニックネーム:
          <input
            type="text"
            value={nick_name}
            onChange={(e) => setNickname(e.target.value)}
          />
        </label>
        <br />
        <label>
          性別:
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="選択しない">選択しない</option>
            <option value="男性">男性</option>
            <option value="女性">女性</option>
          </select>
        </label>
        <br />
        <label>
          年代:
          <select
            value={age_range}
            onChange={(e) => setAge(e.target.value)}
          >
            <option value="選択しない">選択しない</option>
            <option value="10">10代</option>
            <option value="20">20代</option>
            <option value="30">30代</option>
            <option value="40">40代</option>
            <option value="50以上">50代以上</option>
          </select>
        </label>
        <br />
        <label>
          居住地:
          <select
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          >
            <option value="">選択しない</option>
            {prefectures().map((prefecture) => (
            <option key={prefecture.code} value={prefecture.name}>
          {prefecture.name}</option>
      ))}
          </select>
        </label>
        <br />
        <label>
          直近の職歴 職種:
          <select
            value={job_title}
            onChange={(e) => setJobTitle(e.target.value)}
          >
            <option value="選択しない">選択しない</option>
            <option value="営業">営業</option>
            <option value="事務">事務</option>
            <option value="販売">販売</option>
            <option value="製造">製造</option>
            <option value="学生">学生</option>
          </select>
        </label>
        <br />
        <label>
          年数:
          <select
            value={years_of_experience}
            onChange={(e) => setYearsExperience(e.target.value)}
          >
            <option value="なし">なし</option>
            <option value="1年未満">1年未満</option>
            <option value="1~2年">1~2年</option>
            <option value="2~3年">2~3年</option>
            <option value="3~4年">3~4年</option>
            <option value="5年以上">5年以上</option>
            <option value="10年以上">10年以上</option>
          </select>
        </label>
        <br />
        <label>
          トークモード:
          <select
            value={talk_mode}
            onChange={(e) => setTalkMode(e.target.value)}
          >
            <option value="やさしく">やさしく</option>
            <option value="厳しめ">厳しめ</option>
          </select>
        </label>

        <button type="submit">Register</button>
      </form>
    </div>
  );
  };
export default Register;
