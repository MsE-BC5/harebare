import React, { useState, useEffect } from 'react';

const MyPage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // const userId = await getUserIdFromDatabase(); // データベースからユーザーIDを取得
        const userId = '1';
        const response = await fetch(`/api/users/${userId}`, {
          method: 'GET',
          headers: {
        'Accept': 'application/json',
  },
});

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          console.error('Failed to fetch user data:', response.statusText);
          setError('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
        setError('Internal Server Error');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []); // マウント時にのみ実行

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userData) {
    return <div>No user data available.</div>;
  }

  // ユーザーデータを表示する JSX を追加
  return (
    <div>
      <h1>My Page</h1>
      <p>ID: {userData.id}</p>
      <p>名前: {userData.name}</p>
      <p>ニックネーム: {userData.nick_name}</p>
      <p>email: {userData.email}</p>
      <p>性別: {userData.gender}</p>
      <p>年齢:{userData.age}</p>
      <p>トークモード: {userData.talkmode}</p>
      <p>前職: {userData. experienceType}</p>
      <p>年数: {userData.experienceYears}</p>
    </div>
  );
};

export default MyPage;




// import { useState } from 'react';

// const RegisterPage = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     nickname: '',
//     email:'',
//     gender: '',
//     age: '',
//     location: '',
//     experiences: [
//       { type: '', years: '' },
//       { type: '', years: '' },
//       { type: '', years: '' },
//     ],
//     talkMode: '',
//   });

//   const handleChange = (field, value) => {
//     setFormData({ ...formData, [field]: value });
//   };

//   const handleSubmit = async () => {
//     try {
//       const response = await fetch('http://serverapi:8000/users/', {
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
//   <div>
//       {/* 名前 */}
//       <label>
//         名前:
//         <input
//           type="text"
//           value={formData.name}
//           onChange={(e) => handleChange('name', e.target.value)}
//         />
//       </label>

//       {/* ニックネーム */}
//       <label>
//         ニックネーム:
//         <input
//           type="text"
//           value={formData.nickname}
//           onChange={(e) => handleChange('nickname', e.target.value)}
//         />
//       </label>

      
//       <label>
//         email:
//         <input
//           type="text"
//           value={formData.email}
//           onChange={(e) => handleChange('email', e.target.value)}
//         />
//       </label>

//       {/* 性別 */}
//       <label>
//         性別:
//         <select
//           value={formData.gender}
//           onChange={(e) => handleChange('gender', e.target.value)}
//         >
//           <option value="">選択しない</option>
//           <option value="男">男</option>
//           <option value="女">女</option>
//         </select>
//       </label>

//       {/* 年代 */}
//       <label>
//         年代:
//         <select
//           value={formData.age}
//           onChange={(e) => handleChange('age', e.target.value)}
//         >
//           <option value="">選択しない</option>
//           <option value="10">10代</option>
//           <option value="20">20代</option>
//           <option value="30">30代</option>
//           <option value="40">40代</option>
//           <option value="50以上">50代以上</option>
//         </select>
//       </label>

//       {/* 居住地 */}
//       <label>
//         居住地:
//         <select
//           value={formData.location}
//           onChange={(e) => handleChange('location', e.target.value)}
//         >
//           <option value="">選択しない</option>
//           <option value="東京">東京</option>
//           <option value="名古屋">名古屋</option>
//           <option value="大阪">大阪</option>
//           <option value="福岡">福岡</option>
//         </select>
//       </label>
//       <label>
//         一番長い職歴 職種:
//         <select
//           value={formData.experiences[0].type}
//           onChange={(e) =>
//             handleChange('experiences', [
//               { ...formData.experiences[0], type: e.target.value },
//               formData.experiences[1],
//               formData.experiences[2],
//             ])
//           }
//         >
//           <option value="">選択しない</option>
//           <option value="営業">営業</option>
//           <option value="事務">事務</option>
//           <option value="販売">販売</option>
//           <option value="製造">製造</option>
//         </select>
//       </label>
//       <label>
//        年数:
//         <select
//           value={formData.experiences[0].years}
//           onChange={(e) =>
//             handleChange('experiences', [
//               { ...formData.experiences[0], years: e.target.value },
//               formData.experiences[1],
//               formData.experiences[2],
//             ])
//           }
//         >
//           <option value="1年未満">1年未満</option>
//           <option value="1~2年">1~2年</option>
//           <option value="2~3年">2~3年</option>
//           <option value="3~4年">3~4年</option>
//           <option value="5年以上">5年以上</option>
//           <option value="10年以">10年以上</option>
//         </select>
//       </label>
      
//       {/* トークモード */}
//       <label>
//         トークモード:
//         <select
//           value={formData.talkMode}
//           onChange={(e) => handleChange('talkMode', e.target.value)}
//         >
//           <option value="やさしく">やさしく</option>
//           <option value="厳しめ">厳しめ</option>
//         </select>
//       </label>

//       {/* 送信ボタン */}
//       <button onClick={handleSubmit}>登録する</button>
//     </div>
//   );
// };

// export default RegisterPage;

