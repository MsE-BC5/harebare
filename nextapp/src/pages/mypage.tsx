import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';

export default function MyPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const response = await fetch('/api/mypageuser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uid: user.uid }),
        });

        const data = await response.json();
        setData(data);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>My Page</h1>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}


// import React, { useState, useEffect } from 'react';

// const MyPage = () => {
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         // const userId = await getUserIdFromDatabase(); // データベースからユーザーIDを取得
//         const userId = '1';
//         const response = await fetch(`/api/users/${userId}`, {
//           method: 'GET',
//           headers: {
//         'Accept': 'application/json',
//   },
// });

//         if (response.ok) {
//           const data = await response.json();
//           setUserData(data);
//         } else {
//           console.error('Failed to fetch user data:', response.statusText);
//           setError('Failed to fetch user data');
//         }
//       } catch (error) {
//         console.error('Error fetching user data:', error.message);
//         setError('Internal Server Error');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, []); // マウント時にのみ実行

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   if (!userData) {
//     return <div>No user data available.</div>;
//   }

//   // ユーザーデータを表示する JSX を追加
//   return (
//     <div>
//       <h1>My Page</h1>
//       <p>ID: {userData.id}</p>
//       <p>名前: {userData.name}</p>
//       <p>ニックネーム: {userData.nick_name}</p>
//       <p>email: {userData.email}</p>
//       <p>性別: {userData.gender}</p>
//       <p>年齢:{userData.age}</p>
//       <p>トークモード: {userData.talkmode}</p>
//       <p>前職: {userData. experienceType}</p>
//       <p>年数: {userData.experienceYears}</p>
//     </div>
//   );
// };

// export default MyPage;
