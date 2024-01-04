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

const Register = () => {
  const registrationInfo = useRegistrationInfo();
  const router = useRouter();

  // State for form fields
  const [name, setName] = useState(registrationInfo?.name || "");
  const [email, setEmail] = useState(registrationInfo?.email || "");
  const [nickname, setNickname] = useState("");
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
//   const handleFormSubmission = async (event: any) => {
//     event.preventDefault();

//     try {
//       // Firestore インスタンスが存在するか確認してからコレクションを参照
//       if (firestore && registrationInfo && registrationInfo.id) {
//         const userRef = doc(firestore, 'users', registrationInfo.id);

//         // FastAPIにデータを保存
//         const response = await fetch('api/register', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             id: registrationInfo?.id,
//             name,
//             email,
//             nickname,
//             gender,
//             age,
//             location,
//             experienceType,
//             experienceYears,
//             talkMode,
//           }),
//         });

//         // 新しいUser型を作成
// type MyUser = {
//   uid: string;
//   emailVerified: boolean;
//   isAnonymous: boolean;
// };

// // Registerコンポーネント内でのuserPayloadの型をMyUserに変更
// const userPayload: MyUser = { uid: registrationInfo.id, emailVerified: false, isAnonymous: false };

// // ユーザー登録が完了したらcheckout関数を呼び出す
// checkout (userPayload, router);
// } else {
//   console.error('Firestore is undefined');
//   // エラーハンドリングやユーザーに通知する処理を追加
// }
// } catch (error) {
//   console.error('Error adding user data:', error);
// }
// };
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
          id: registrationInfo?.id,
          name,
          nickname,
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
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        await checkout(userPayload, router);
        console.log("??????????????????")
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
            value={nickname}
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
            value={age_range}
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
            value={address}
            onChange={(e) => setAddress(e.target.value)}
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
            value={job_title}
            onChange={(e) => setJobTitle(e.target.value)}
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
            value={years_of_experience}
            onChange={(e) => setYearsExperience(e.target.value)}
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




// import React, { useState, useEffect } from "react";
// import { useRegistrationInfo } from "../../context/auth";
// import { useRouter } from "next/router";
// import { getFirestore, doc, getDoc, collection, addDoc } from 'firebase/firestore';
// import Header from "./components/header";

// const Register = () => {
//   const registrationInfo = useRegistrationInfo();
//   const router = useRouter();

//   // Use the registrationInfo to set initial values for the form fields
//   const [name, setName] = useState(registrationInfo?.name || "");
//   const [email, setEmail] = useState(registrationInfo?.email || "");
//   const [nickname, setNickname] = useState(registrationInfo?.nickname || "");
//   const [gender, setGender] = useState("");
//   const [age, setAge] = useState("");
//   const [location, setLocation] = useState("");
//   const [experienceType, setExperienceType] = useState("");
//   const [experienceYears, setExperienceYears] = useState("");
//   const [talkMode, setTalkMode] = useState("やさしく");

//   const fetchData = async () => {
//     // Firestoreからユーザーデータを取得
//     const userRef = doc(collection(getFirestore(), 'users'), registrationInfo?.id);
//     try {
//       const userDoc = await getDoc(userRef);

//       if (userDoc.exists()) {
//         const userData = userDoc.data();
//         // フォームの初期値をセット
//         setName(userData?.name || "");
//         setEmail(userData?.email || "");
//       }
//     } catch (error) {
//       console.error('Error fetching user data:', error);
//     }
//   };

//   useEffect(() => {
//     // registrationInfoが存在し、かつidがある場合にデータを取得
//     if (registrationInfo && registrationInfo.id) {
//       fetchData();
//     }
//   }, [registrationInfo]);

//   const handleFormSubmission = async (event) => {
//     event.preventDefault();

//     // Firestoreに新しいデータを追加
//     const userRef = doc(collection(getFirestore(), 'users'), registrationInfo?.id);
//     await addDoc(userRef, { name, email });

//     // 登録が完了したら遷移
//     router.push('/home');
//   };

//   const handleSubmit = async () => {
//     const formData = {
//       name,
//       email,
//       nickname,
//       gender,
//       age,
//       location,
//       // experienceType,
//       // experienceYears,
//       talkMode,
//     };

//     try {
//       const response = await fetch("/api/register", {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         console.log('Registration successful!');
//         // リダイレクトなど適切な処理を追加
//       } else {
//         console.error('Registration failed.');
//       }
//     } catch (error) {
//       console.error('Error during registration:', error);
//     }
//   };

//   return (
//     <>
//       <Header />
//       <h1 className="text-center font-semibold text-3xl">新規登録</h1>
//       <div className='text-center m-10'>
//         <form onSubmit={handleFormSubmission}>
//           <label>
//             Name:
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />
//           </label>
//         </form>
//       </div>
//       <div className='text-center m-5'>
//         <label>
//           Email:
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </label>
//       </div>
//       <br />
//       <div className='text-center m-5'>
//         <label>
//           ニックネーム:
//           <input
//             type="text"
//             value={nickname}
//             onChange={(e) => setNickname(e.target.value)}
//           />
//         </label>
//       </div>
//       <br />
//       <div className='text-center m-5'>
//         <label>
//           性別:
//           <select
//             value={gender}
//             onChange={(e) => setGender(e.target.value)}
//           >
//             <option value="">選択しない</option>
//             <option value="男">男</option>
//             <option value="女">女</option>
//           </select>
//         </label>
//       </div>
//       <br />
//       <div className='text-center m-5'>
//         <label>
//           年代:
//           <select
//             value={age}
//             onChange={(e) => setAge(e.target.value)}
//           >
//             <option value="">選択しない</option>
//             <option value="10">10代</option>
//             <option value="20">20代</option>
//             <option value="30">30代</option>
//             <option value="40">40代</option>
//             <option value="50以上">50代以上</option>
//           </select>
//         </label>
//       </div>
//       <br />
//       <div className='text-center m-5'>
//         <label>
//           居住地:
//           <select
//             value={location}
//             onChange={(e) => setLocation(e.target.value)}
//           >
//             <option value="">選択しない</option>
//             <option value="東京">東京</option>
//             <option value="名古屋">名古屋</option>
//             <option value="大阪">大阪</option>
//             <option value="福岡">福岡</option>
//           </select>
//         </label>
//       </div>
//       <br />
//       <div className='text-center m-5'>
//         <label>
//           直近の職歴 職種:
//           <select
//             value={experienceType}
//             onChange={(e) => setExperienceType(e.target.value)}
//           >
//             <option value="">選択しない</option>
//             <option value="営業">営業</option>
//             <option value="事務">事務</option>
//             <option value="販売">販売</option>
//             <option value="製造">製造</option>
//           </select>
//         </label>
//       </div>
//       <br />
//       <div className='text-center m-5'>
//         <label>
//           年数:
//           <select
//             value={experienceYears}
//             onChange={(e) => setExperienceYears(e.target.value)}
//           >
//             <option value="1年未満">1年未満</option>
//             <option value="1~2年">1~2年</option>
//             <option value="2~3年">2~3年</option>
//             <option value="3~4年">3~4年</option>
//             <option value="5年以上">5年以上</option>
//             <option value="10年以上">10年以上</option>
//           </select>
//         </label>
//       </div>
//       <br />
//       <div className='text-center m-5'>
//         <label>
//           トークモード:
//           <select
//             value={talkMode}
//             onChange={(e) => setTalkMode(e.target.value)}
//           >
//             <option value="やさしく">やさしく</option>
//             <option value="厳しめ">厳しめ</option>
//           </select>
//         </label>
//       </div>
//       <div className="text-center">
//         <button
//           // type="submit"
//           onClick={handleSubmit}
//           className='bg-gray-500 text-white px-4 py-2 rounded-full transition hover:opacity-60 w-1/4'>
//           登録
//         </button>
//       </div>
//     </>
//   );
// };

// export default Register;

//一番使うコード
// import React, { useState, useEffect } from "react";
// import { useRegistrationInfo } from "../../context/auth";
// import { useRouter } from "next/router";
// import { getFirestore, doc, collection, addDoc } from 'firebase/firestore';
// import Header from "./components/header";

// const Register = () => {
//   const registrationInfo = useRegistrationInfo();
//   const router = useRouter();

//   // Use the registrationInfo to set initial values for the form fields
//   const [name, setName] = useState(registrationInfo?.name || "");
//   const [email, setEmail] = useState(registrationInfo?.email || "");
//   const [nickname, setNickname] = useState(registrationInfo?.nickname || "");
//   const [gender, setGender] = useState("");
//   const [age, setAge] = useState("");
//   const [location, setLocation] = useState("");
//   const [experienceType, setExperienceType] = useState("");
//   const [experienceYears, setExperienceYears] = useState("");
//   const [talkMode, setTalkMode] = useState("やさしく");

//   const fetchData = async () => {
//     // Firestoreからユーザーデータを取得
//     const userRef = doc(collection(getFirestore(), 'users'), registrationInfo?.id);
//     try {
//       const userDoc = await getDoc(userRef);

//       if (userDoc.exists()) {
//         const userData = userDoc.data();
//         // フォームの初期値をセット
//         setName(userData?.name || "");
//         setEmail(userData?.email || "");
//       }
//     } catch (error) {
//       console.error('Error fetching user data:', error);
//     }
//   };

//   useEffect(() => {
//     // registrationInfoが存在し、かつidがある場合にデータを取得
//     if (registrationInfo && registrationInfo.id) {
//       fetchData();
//     }
//   }, [registrationInfo]);

//   const handleFormSubmission = async (event) => {
//     event.preventDefault();

//     // Firestoreに新しいデータを追加
//     const userRef = doc(collection(getFirestore(), 'users'), registrationInfo?.id);
//     await addDoc(userRef, { name, email });

//     // 登録が完了したら遷移
//     router.push('/home');
//   };

//   return (
//     <>
//       <Header />
//       <h1 className="text-center font-semibold text-3xl">新規登録</h1>
//       <div className='text-center m-10'>
//         <form onSubmit={handleFormSubmission}>
//           <label>
//             Name:
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />
//           </label>
//         </form>
//       </div>
//       <div className='text-center m-5'>
//         <label>
//           Email:
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </label>
//       </div>
//       <br />
//       <div className='text-center m-5'>
//         <label>
//           ニックネーム:
//           <input
//             type="text"
//             value={nickname}
//             onChange={(e) => setNickname(e.target.value)}
//           />
//         </label>
//       </div>
//       <br />
//       <div className='text-center m-5'>
//         <label>
//           性別:
//           <select
//             value={gender}
//             onChange={(e) => setGender(e.target.value)}
//           >
//             <option value="">選択しない</option>
//             <option value="男">男</option>
//             <option value="女">女</option>
//           </select>
//         </label>
//       </div>
//       <br />
//       <div className='text-center m-5'>
//         <label>
//           年代:
//           <select
//             value={age}
//             onChange={(e) => setAge(e.target.value)}
//           >
//             <option value="">選択しない</option>
//             <option value="10">10代</option>
//             <option value="20">20代</option>
//             <option value="30">30代</option>
//             <option value="40">40代</option>
//             <option value="50以上">50代以上</option>
//           </select>
//         </label>
//       </div>
//       <br />
//       <div className='text-center m-5'>
//         <label>
//           居住地:
//           <select
//             value={location}
//             onChange={(e) => setLocation(e.target.value)}
//           >
//             <option value="">選択しない</option>
//             <option value="東京">東京</option>
//             <option value="名古屋">名古屋</option>
//             <option value="大阪">大阪</option>
//             <option value="福岡">福岡</option>
//           </select>
//         </label>
//       </div>
//       <br />
//       <div className='text-center m-5'>
//         <label>
//           直近の職歴 職種:
//           <select
//             value={experienceType}
//             onChange={(e) => setExperienceType(e.target.value)}
//           >
//             <option value="">選択しない</option>
//             <option value="営業">営業</option>
//             <option value="事務">事務</option>
//             <option value="販売">販売</option>
//             <option value="製造">製造</option>
//           </select>
//         </label>
//       </div>
//       <br />
//       <div className='text-center m-5'>
//         <label>
//           年数:
//           <select
//             value={experienceYears}
//             onChange={(e) => setExperienceYears(e.target.value)}
//           >
//             <option value="1年未満">1年未満</option>
//             <option value="1~2年">1~2年</option>
//             <option value="2~3年">2~3年</option>
//             <option value="3~4年">3~4年</option>
//             <option value="5年以上">5年以上</option>
//             <option value="10年以上">10年以上</option>
//           </select>
//         </label>
//       </div>
//       <br />
//       <div className='text-center m-5'>
//         <label>
//           トークモード:
//           <select
//             value={talkMode}
//             onChange={(e) => setTalkMode(e.target.value)}
//           >
//             <option value="やさしく">やさしく</option>
//             <option value="厳しめ">厳しめ</option>
//           </select>
//         </label>
//       </div>
//       <div className="text-center">
//         <button
//           // type="submit"
//           onClick={handleFormSubmission}
//           className='bg-gray-500 text-white px-4 py-2 rounded-full transition hover:opacity-60 w-1/4'>
//           登録
//         </button>
//       </div>
//     </>
//   );
// };

// export default Register;



// import React, { useState, useEffect } from "react";
// import { useRegistrationInfo } from "../../context/auth";
// import { useRouter } from "next/router";
// import { getFirestore, doc, getDoc, collection, addDoc } from 'firebase/firestore';
// import Header from "./components/header"

// const Register = () => {
//   const registrationInfo = useRegistrationInfo();
//   const router = useRouter();

//   // Use the registrationInfo to set initial values for the form fields
//   const [name, setName] = useState(registrationInfo?.name || "");
//   const [email, setEmail] = useState(registrationInfo?.email || "");
//   const [nickname, setNickname] = useState(registrationInfo?.email || "");

//   const [gender, setGender] = useState(""); // Add this line
  
//   const [age, setAge] = useState(""); // Add this line
//   const [location, setLocation] = useState(""); // Add this line
//   const [experienceType, setExperienceType] = useState(""); // Add this line
//   const [experienceYears, setExperienceYears] = useState(""); // Add this line
//   const [talkMode, setTalkMode] = useState("やさしく"); // Add this line

  
//     const fetchData = async () => {
//       // Firestoreからユーザーデータを取得
//       const userRef = doc(collection(getFirestore(), 'users'), registrationInfo?.id);
//       try {
//         const userDoc = await getDoc(userRef);
        
//         if (userDoc.exists()) {
//           const userData = userDoc.data();
//           // フォームの初期値をセット
//           setName(userData?.name || "");
//           setEmail(userData?.email || "");
//         }
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//       }
//     };
//     useEffect(() => {
//     // registrationInfoが存在し、かつidがある場合にデータを取得
//     if (registrationInfo && registrationInfo.id) {
//       fetchData();
//     }
//   }, [registrationInfo]);

//   // Your form submission logic goes here
//   const handleFormSubmission = async (event) => {
//     event.preventDefault();

//     // Add your form submission logic here
//     try {
//       // Firestoreに新しいデータを追加
//       const userRef = doc(collection(getFirestore(), 'users'), registrationInfo?.id);
//       await addDoc(userRef, { name, email });

//       // 登録が完了したら遷移
//       router.push('/home');
//     } catch (error) {
//       console.error('Error adding user data:', error);
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       const response = await fetch("/api/register", {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         console.log('Registration successful!');
//         // リダイレクトなど適切な処理を追加
//       } else {
//         console.error('Registration failed.');
//       }
//     } catch (error) {
//       console.error('Error during registration:', error);
//     }
//   };


//   return (
//     <>
//     <Header />
//       <h1 className="text-center font-semibold text-3xl">新規登録</h1>
//       <div className='text-center m-10'>
//     <form onSubmit={handleFormSubmission}>
//         <label>
//           Name:
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />
//         </label>
//         </form>
//       </div>
//       <div className='text-center m-5'>
//         <label>
//           Email:
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </label>
//       </div>
//         <br />
//       <div className='text-center m-5'>
//         <label>
//           ニックネーム:
//           <input
//             type="text"
//             value={registrationInfo?.nickname || ""}
//             onChange={(e) => setNickname(e.target.value)}
//           />
//         </label>
//       </div>
//         <br />
//       <div className='text-center m-5'>
//         <label>
//           性別:
//           <select
//             value={gender}
//             onChange={(e) => setGender(e.target.value)}
//           >
//             <option value="">選択しない</option>
//             <option value="男">男</option>
//             <option value="女">女</option>
//           </select>
//         </label>
//       </div>
//         <br />
//       <div className='text-center m-5'>
//         <label>
//           年代:
//           <select
//             value={age}
//             onChange={(e) => setAge(e.target.value)}
//           >
//             <option value="">選択しない</option>
//             <option value="10">10代</option>
//             <option value="20">20代</option>
//             <option value="30">30代</option>
//             <option value="40">40代</option>
//             <option value="50以上">50代以上</option>
//           </select>
//         </label>
//       </div>
//         <br />
//       <div className='text-center m-5'>
//         <label>
//           居住地:
//           <select
//             value={location}
//             onChange={(e) => setLocation(e.target.value)}
//           >
//             <option value="">選択しない</option>
//             <option value="東京">東京</option>
//             <option value="名古屋">名古屋</option>
//             <option value="大阪">大阪</option>
//             <option value="福岡">福岡</option>
//           </select>
//         </label>
//       </div>
//         <br />
      // <div className='text-center m-5'>
      //   <label>
      //     直近の職歴 職種:
      //     <select
      //       value={experienceType}
      //       onChange={(e) => setExperienceType(e.target.value)}
      //     >
      //       <option value="">選択しない</option>
      //       <option value="営業">営業</option>
      //       <option value="事務">事務</option>
      //       <option value="販売">販売</option>
      //       <option value="製造">製造</option>
      //     </select>
      //   </label>
      // </div>
      //   <br />
      // <div className='text-center m-5'>
      //   <label>
      //     年数:
      //     <select
      //       value={experienceYears}
      //       onChange={(e) => setExperienceYears(e.target.value)}
      //     >
      //       <option value="1年未満">1年未満</option>
      //       <option value="1~2年">1~2年</option>
      //       <option value="2~3年">2~3年</option>
      //       <option value="3~4年">3~4年</option>
      //       <option value="5年以上">5年以上</option>
      //       <option value="10年以上">10年以上</option>
      //     </select>
      //   </label>
      // </div>
      //   <br />
//       <div className='text-center m-5'>
//         <label>
//           トークモード:
//           <select
//             value={talkMode}
//             onChange={(e) => setTalkMode(e.target.value)}
//           >
//             <option value="やさしく">やさしく</option>
//             <option value="厳しめ">厳しめ</option>
//           </select>
//         </label>
//       </div>
//       <div className="text-center">
//         <button type="submit"
//         className='bg-gray-500 text-white px-4 py-2 rounded-full transition hover:opacity-60 w-1/4'>
//         Register</button>
//       </div>
//     {/* </form> */}
//     </>
//   );
// };

// export default Register;


// import { useState } from 'react';
// import { useRouter } from 'next/router'; 

// const RegisterPage = () => {
//   const router = useRouter();

//   const [formData, setFormData] = useState({
//     name: '',
//     nickname: '',
//     email: '',
//     gender: '',
//     age: '',
//     location: '',
//     talkmode: '', 
//     experienceType: '',
//     experienceYears: ''
//   });

//   const handleChange = (field, value) => {
//     setFormData({ ...formData, [field]: value });
//   };

//   const handleSubmit = async () => {
//     try {
//       const response = await fetch("/api/register", {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         console.log('Registration successful!');
//         // リダイレクトなど適切な処理を追加
//         router.push("/Home")//ページ遷移
//       } else {
//         console.error('Registration failed.');
//       }
//     } catch (error) {
//       console.error('Error during registration:', error);
//     }
//   };

//   return (
//     <>
//     <h1 className="text-center font-semibold text-3xl">新規登録</h1>
//   <div className='text-center m-10'>
//       {/* 名前 */}
//       <label>
//         名前:
//         <input
//           type="text"
//           value={formData.name}
//           onChange={(e) => handleChange('name', e.target.value)}
//           className=" bg-gray-100"
//         />
//       </label>
//   </div>
//   <div className='text-center m-10 '>    
//       {/* ニックネーム */}
//       <label>
//         ニックネーム:
//         <input
//           type="text"
//           value={formData.nickname}
//           onChange={(e) => handleChange('nickname', e.target.value)}
//           className=" bg-gray-100"
//         />
//       </label>
//   </div>
//   <div className='text-center m-10'>    
//       <label>
//         email:
//         <input
//           type="text"
//           value={formData.email}
//           onChange={(e) => handleChange('email', e.target.value)}
//           className=" bg-gray-100"
//         />
//       </label>
//   </div>
//   <div className='text-center m-10'>
//       {/* 性別 */}
//       <label>
//         性別:
//         <select
//           value={formData.gender}
//           onChange={(e) => handleChange('gender', e.target.value)}
//           className=" bg-gray-100"
//         >
//           <option value="">選択しない</option>
//           <option value="男">男</option>
//           <option value="女">女</option>
//         </select>
//       </label>
//   </div>
//   <div className='text-center m-10'>

//       {/* 年代 */}
//       <label>
//         年代:
//         <select
//           value={formData.age}
//           onChange={(e) => handleChange('age', e.target.value)}
//           className=" bg-gray-100"
//         >
//           <option value="">選択しない</option>
//           <option value="10">10代</option>
//           <option value="20">20代</option>
//           <option value="30">30代</option>
//           <option value="40">40代</option>
//           <option value="50以上">50代以上</option>
//         </select>
//       </label>
//   </div>
//   <div className='text-center m-10'>
//       {/* 居住地 */}
//       <label>
//         居住地:
//         <select
//           value={formData.location}
//           onChange={(e) => handleChange('location', e.target.value)}
//           className=" bg-gray-100"
//         >
//           <option value="">選択しない</option>
//           <option value="東京">東京</option>
//           <option value="名古屋">名古屋</option>
//           <option value="大阪">大阪</option>
//           <option value="福岡">福岡</option>
//         </select>
//       </label>
//   </div>
//   <div className='text-center m-5'>
//         <label>
//           直近の職歴 職種:
//           <select
//             value={formData.experienceType}
//             onChange={(e) => handleChange('setExperienceType',e.target.value)}
//             className=" bg-gray-100"
//           >
//             <option value="">選択しない</option>
//             <option value="営業">営業</option>
//             <option value="事務">事務</option>
//             <option value="販売">販売</option>
//             <option value="製造">製造</option>
//           </select>
//         </label>
//       </div> 
//       <br />
//       <div className='text-center m-5'>
//         <label>
//           年数:
//           <select
//             value={formData.experienceYears}
//             onChange={(e) => handleChange('setExperienceYears',e.target.value)}
//             className=" bg-gray-100"
//           >
//             <option value="1年未満">1年未満</option>
//             <option value="1~2年">1~2年</option>
//             <option value="2~3年">2~3年</option>
//             <option value="3~4年">3~4年</option>
//             <option value="5年以上">5年以上</option>
//             <option value="10年以上">10年以上</option>
//           </select>
//         </label>
//       </div>
//         <br />
//   <div className='text-center m-10'>
      
//       {/* トークモード */}
//       <label>
//         トークモード:
//         <select
//           value={formData.talkMode}
//           onChange={(e) => handleChange('talkMode', e.target.value)}
//           className=" bg-gray-100"
//         >
//           <option value="やさしく">やさしく</option>
//           <option value="厳しめ">厳しめ</option>
//         </select>
//       </label>
//   </div>
//   <div className="text-center">
//       {/* 送信ボタン */}
//       <button onClick={handleSubmit}
//       className='bg-gray-500 text-white px-4 py-2 rounded-full transition hover:opacity-60 w-1/4'>登録する</button>
//     </div>
//     </>
//   );
// };

// export default RegisterPage;

//pages/register.tsx

// import React, { useState, useEffect } from "react";
// import { useRegistrationInfo } from "../../context/auth";
// import { useRouter } from "next/router";
// import {
//   Firestore,
//   getFirestore,
//   doc,
//   getDoc,
// } from 'firebase/firestore';
// import checkout from "../pages/checkout";
// import Header from "./components/header"

// const Register = () => {
//   const registrationInfo = useRegistrationInfo();
//   const router = useRouter();

//   // State for form fields
//   const [name, setName] = useState(registrationInfo?.name || "");
//   const [email, setEmail] = useState(registrationInfo?.email || "");
//   const [nickname, setNickname] = useState("");
//   const [gender, setGender] = useState("");
//   const [age, setAge] = useState("");
//   const [location, setLocation] = useState("");
//   const [experienceType, setExperienceType] = useState("");
//   const [experienceYears, setExperienceYears] = useState("");
//   const [talkMode, setTalkMode] = useState("やさしく");
//   const [firestore, setFirestore] = useState<Firestore | null>(null); // Firestore インスタンスの状態を保持


//   useEffect(() => {
//     const initializeFirestore = () => {
//       // Firestore インスタンスを取得
//       const firestoreInstance: Firestore = getFirestore();
//       setFirestore(firestoreInstance);
//     };

//     initializeFirestore(); // 初回レンダリング時に Firestore インスタンスを初期化
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Firestore インスタンスが存在し、かつ registrationInfo と id がある場合にユーザーデータを取得
//         if (firestore && registrationInfo && registrationInfo.id) {
//           const userRef = doc(firestore, 'users', registrationInfo.id);
//           const userDoc = await getDoc(userRef);

//           if (userDoc.exists()) {
//             const userData = userDoc.data();
//             // フォームの初期値をセット
//             setName(userData?.name || "");
//             setEmail(userData?.email || "");
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//       }
//     };

//     // registrationInfo が存在し、かつ id がある場合にデータを取得
//     if (registrationInfo && registrationInfo.id) {
//       fetchData();
//     }
//   }, [firestore, registrationInfo]);

//   // 新規登録フォームの送信ロジック
// //   const handleFormSubmission = async (event: any) => {
// //     event.preventDefault();

// //     try {
// //       // Firestore インスタンスが存在するか確認してからコレクションを参照
// //       if (firestore && registrationInfo && registrationInfo.id) {
// //         const userRef = doc(firestore, 'users', registrationInfo.id);

// //         // FastAPIにデータを保存
// //         const response = await fetch('api/register', {
// //           method: 'POST',
// //           headers: {
// //             'Content-Type': 'application/json',
// //           },
// //           body: JSON.stringify({
// //             id: registrationInfo?.id,
// //             name,
// //             email,
// //             nickname,
// //             gender,
// //             age,
// //             location,
// //             experienceType,
// //             experienceYears,
// //             talkMode,
// //           }),
// //         });

// //         // 新しいUser型を作成
// // type MyUser = {
// //   uid: string;
// //   emailVerified: boolean;
// //   isAnonymous: boolean;
// // };

// // // Registerコンポーネント内でのuserPayloadの型をMyUserに変更
// // const userPayload: MyUser = { uid: registrationInfo.id, emailVerified: false, isAnonymous: false };

// // // ユーザー登録が完了したらcheckout関数を呼び出す
// // checkout (userPayload, router);
// // } else {
// //   console.error('Firestore is undefined');
// //   // エラーハンドリングやユーザーに通知する処理を追加
// // }
// // } catch (error) {
// //   console.error('Error adding user data:', error);
// // }
// // };
// const handleFormSubmission = async (event: any) => {
//   console.log('handleFormSubmission called'); // Add this line
//   event.preventDefault();

//   try {
//     // Firestore インスタンスが存在するか確認してからコレクションを参照
//     if (firestore && registrationInfo && registrationInfo.id) {
//       console.log('All conditions met'); // Add this line
//       const userRef = doc(firestore, 'users', registrationInfo.id);

//       // FastAPIにデータを保存
//       const response = await fetch('api/register', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           id: registrationInfo?.id,
//           name,
//           email,
//           nickname,
//           gender,
//           age,
//           location,
//           experienceType,
//           experienceYears,
//           talkMode,
//         }),
//       });

//       // 新しいUser型を作成
//       type MyUser = {
//         uid: string;
//         emailVerified: boolean;
//         isAnonymous: boolean;
//       };

//       // Registerコンポーネント内でのuserPayloadの型をMyUserに変更
//       const userPayload: MyUser = { uid: registrationInfo.id, emailVerified: false, isAnonymous: false };

//       // ユーザー登録が完了したらcheckout関数を呼び出す
//       const doCheckout = async () => {
//         console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
//         await checkout(userPayload, router);
//         console.log("??????????????????")
//       };

//       // 非同期関数を呼び出す
//       doCheckout();
//     } else {
//       console.log('Some conditions not met'); // Add this line
//       console.error('Firestore is undefined');
//       // エラーハンドリングやユーザーに通知する処理を追加
//     }
//   } catch (error) {
//     console.error('Error adding user data:', error);
//   }
// };


//   return (
//     <div>
//       <Header />
//       <h1>Register</h1>
//       <form onSubmit={handleFormSubmission}>
//         <label>
//           Name:
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />
//         </label>
//         <br />
//         <label>
//           Email:
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </label>
//         <br />
//         <label>
//           ニックネーム:
//           <input
//             type="text"
//             value={nickname}
//             onChange={(e) => setNickname(e.target.value)}
//           />
//         </label>
//         <br />
//         <label>
//           性別:
//           <select
//             value={gender}
//             onChange={(e) => setGender(e.target.value)}
//           >
//             <option value="">選択しない</option>
//             <option value="男">男</option>
//             <option value="女">女</option>
//           </select>
//         </label>
//         <br />
//         <label>
//           年代:
//           <select
//             value={age}
//             onChange={(e) => setAge(e.target.value)}
//           >
//             <option value="">選択しない</option>
//             <option value="10">10代</option>
//             <option value="20">20代</option>
//             <option value="30">30代</option>
//             <option value="40">40代</option>
//             <option value="50以上">50代以上</option>
//           </select>
//         </label>
//         <br />
//         <label>
//           居住地:
//           <select
//             value={location}
//             onChange={(e) => setLocation(e.target.value)}
//           >
//             <option value="">選択しない</option>
//             <option value="東京">東京</option>
//             <option value="名古屋">名古屋</option>
//             <option value="大阪">大阪</option>
//             <option value="福岡">福岡</option>
//           </select>
//         </label>
//         <br />
//         <label>
//           直近の職歴 職種:
//           <select
//             value={experienceType}
//             onChange={(e) => setExperienceType(e.target.value)}
//           >
//             <option value="">選択しない</option>
//             <option value="営業">営業</option>
//             <option value="事務">事務</option>
//             <option value="販売">販売</option>
//             <option value="製造">製造</option>
//           </select>
//         </label>
//         <br />
//         <label>
//           年数:
//           <select
//             value={experienceYears}
//             onChange={(e) => setExperienceYears(e.target.value)}
//           >
//             <option value="1年未満">1年未満</option>
//             <option value="1~2年">1~2年</option>
//             <option value="2~3年">2~3年</option>
//             <option value="3~4年">3~4年</option>
//             <option value="5年以上">5年以上</option>
//             <option value="10年以上">10年以上</option>
//           </select>
//         </label>
//         <br />
//         <label>
//           トークモード:
//           <select
//             value={talkMode}
//             onChange={(e) => setTalkMode(e.target.value)}
//           >
//             <option value="やさしく">やさしく</option>
//             <option value="厳しめ">厳しめ</option>
//           </select>
//         </label>

//         <button type="submit">Register</button>
//       </form>
//     </div>
//   );
//   };
// export default Register;


