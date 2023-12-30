import React, { useState, useEffect } from "react";
import { useRegistrationInfo } from "../../context/auth";
import { useRouter } from "next/router";
import { getFirestore, doc, getDoc, collection, addDoc } from 'firebase/firestore';

const Register = () => {
  const registrationInfo = useRegistrationInfo();
  const router = useRouter();

  // Use the registrationInfo to set initial values for the form fields
  const [name, setName] = useState(registrationInfo?.name || "");
  const [email, setEmail] = useState(registrationInfo?.email || "");
  const [nickname, setNickname] = useState(registrationInfo?.email || "");

  const [gender, setGender] = useState(""); // Add this line
  
  const [age, setAge] = useState(""); // Add this line
  const [location, setLocation] = useState(""); // Add this line
  const [experienceType, setExperienceType] = useState(""); // Add this line
  const [experienceYears, setExperienceYears] = useState(""); // Add this line
  const [talkMode, setTalkMode] = useState("やさしく"); // Add this line

  useEffect(() => {
    const fetchData = async () => {
      // Firestoreからユーザーデータを取得
      const userRef = doc(collection(getFirestore(), 'users'), registrationInfo?.id);
      try {
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          // フォームの初期値をセット
          setName(userData?.name || "");
          setEmail(userData?.email || "");
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    // registrationInfoが存在し、かつidがある場合にデータを取得
    if (registrationInfo && registrationInfo.id) {
      fetchData();
    }
  }, [registrationInfo]);

  // Your form submission logic goes here
  const handleFormSubmission = async (event) => {
    event.preventDefault();

    // Add your form submission logic here
    try {
      // Firestoreに新しいデータを追加
      const userRef = doc(collection(getFirestore(), 'users'), registrationInfo?.id);
      await addDoc(userRef, { name, email });

      // 登録が完了したら遷移
      router.push('/home');
    } catch (error) {
      console.error('Error adding user data:', error);
    }
  };

  return (
    <div>
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
            value={registrationInfo?.nickname || ""}
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
            <option value="">選択しない</option>
            <option value="男">男</option>
            <option value="女">女</option>
          </select>
        </label>
        <br />
        <label>
          年代:
          <select
            value={age}
            onChange={(e) => setAge(e.target.value)}
          >
            <option value="">選択しない</option>
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
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">選択しない</option>
            <option value="東京">東京</option>
            <option value="名古屋">名古屋</option>
            <option value="大阪">大阪</option>
            <option value="福岡">福岡</option>
          </select>
        </label>
        <br />
        <label>
          直近の職歴 職種:
          <select
            value={experienceType}
            onChange={(e) => setExperienceType(e.target.value)}
          >
            <option value="">選択しない</option>
            <option value="営業">営業</option>
            <option value="事務">事務</option>
            <option value="販売">販売</option>
            <option value="製造">製造</option>
          </select>
        </label>
        <br />
        <label>
          年数:
          <select
            value={experienceYears}
            onChange={(e) => setExperienceYears(e.target.value)}
          >
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
            value={talkMode}
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





