import React from "react";
import { useAuth } from "../../context/auth";
import { login, logout } from "../../lib/auth";
import { FC, useState, useEffect } from "react";
import router, { useRouter } from "next/router";
import { addDoc, collection, doc, getDoc, onSnapshot, getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, User,onAuthStateChanged } from 'firebase/auth';


interface CheckoutComponentProps {
  // ここに必要なプロパティを追加
}

const CheckoutComponent: FC<CheckoutComponentProps> = () => {
  const auth = getAuth(); // getAuth メソッドで Auth オブジェクトを取得
  console.log(auth);
  //const authUser = useAuth(); // あなたのFirestoreコンテキストから firestore を取得
  const [user, setUser] = useState<User | null>(null);
  const firestore = getFirestore();
  const router = useRouter(); 
  
  useEffect(() => {
    // ユーザーのログイン状態が変わったときに実行されるコード
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe(); // コンポーネントがアンマウントされたときに unsubscribe する
  }, [auth]);

  const isAuthenticated = !!user;

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      setUser(userCredential.user);
      // Firestoreでユーザーが登録済みかどうかの確認
    const userRef = doc(collection(firestore, 'users'), userCredential.user.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      // ユーザーが登録済みの場合は/homeに遷移
      router.push('/Home');
    } else {
      // ユーザーが初めての場合は/registerに遷移
      router.push('/register');
    }
  } catch (error) {
    console.error(error);
  }
};


  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      console.log('logout success.');
    } catch (error) {
      console.error(error);
    }
  };

  const checkout = async () => {
    try {
      if (!user) {
        // ログインしていない場合の処理（例: ログインページにリダイレクト）
        router.push('/login');
        return;
      }

      const customerRef = doc(collection(firestore, 'customers'), user?.uid);
      const checkoutColRef = collection(customerRef, 'checkout_sessions');
      const docRef = await addDoc(checkoutColRef, {
        automatic_tax: true,
        price: 'price_1ORTTgGcQxpc945dv18vF3Dy',
        success_url: window.location.origin,
        cancel_url: window.location.origin,
      });

      const unsubscribe = onSnapshot(docRef, (snapshot) => {
        const data = snapshot.data();
        if (data) {
          const { error, url } = data;
               
          if (error) {
            alert(`An error occurred: ${error.message}`);
          }
          if (url) {
            window.location.assign(url);
        }
      }
      });

      // コンポーネントがアンマウントされたらクリーンアップ
      return () => unsubscribe();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <div>
        <h1> 支払いテストを実行します。 </h1>
        <div>ログイン状態: {isAuthenticated.toString()}</div>
        <div>ユーザー情報: {user?.email}</div>
        <button onClick={loginWithGoogle}>Google認証でログイン</button>
        <button onClick={checkout}>支払い</button>
        <button onClick={logout}>logout</button>
        
      </div>
    </div>
  );
};

export default CheckoutComponent;






// export default function MyLogin() {
//   const user = useAuth();
//   const [waiting, setWaiting] = useState<boolean>(false);
//   const router = useRouter();

//   const signIn = async () => {
//     setWaiting(true);

//     try {
//       const result = await login();
//       const currentUser = result.user;

//       if (currentUser) {
//         // ログインしていれば admin ページに遷移
//         router.push("/mypage");
//       } else {
//         console.log("You do not have permission to access this page");
//         router.push("/unauthorised");
//       }
//     } catch (error) {
//       console.error(error?.code);
//     } finally {
//       setWaiting(false);
//     }
//   };

//   return (
//     <>
//       <div>
//         {user === null && !waiting && <button onClick={signIn}>ログイン</button>}
//         {user && <button onClick={logout}>ログアウト</button>}
//       </div>
//     </>
//   );
// }