import React from "react";
import { FC, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { addDoc, collection, doc, getDoc, onSnapshot, getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, User,onAuthStateChanged } from 'firebase/auth';
import Header from "./components/header"

interface CheckoutComponentProps {
  // ここに必要なプロパティを追加
}

const CheckoutComponent: FC<CheckoutComponentProps> = () => {
  const auth = getAuth();
  const [user, setUser] = useState<User | null>(null);
  const firestore = getFirestore();
  const router = useRouter(); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [auth]);

  const isAuthenticated = !!user;

const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    setUser(userCredential.user);

    const userRef = doc(collection(firestore, 'users'), userCredential.user.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const paymentIdRef = doc(collection(firestore, 'customers'), userCredential.user.uid);
      const paymentIdDoc = await getDoc(paymentIdRef);

      if (paymentIdDoc.exists()) {
        // payment Idが存在する場合は/Homeに遷移
        router.push('/Home');
      } else {
        // payment Idが存在しない場合は/registerに遷移
        router.push('/register');
      }
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

  return (
    <>
      <Header />
      <div className="bg-overlay text-center " style={{ position: 'relative',  height: '100vh' }}>
        <h1 className="space-x-10 m-15 font-semibold text-4xl py-10 text-gray-700"> Googleアカウントで登録 </h1>
        {/* <div>ログイン状態: {isAuthenticated.toString()}</div> */}
        <div className="text-gray-700">email: {user?.email}</div>
        <button onClick={loginWithGoogle}
        className="bg-brown-400 text-white px-3 py-2 transition hover:opacity-60 shadow-lg m-10 text-3xl">Googleでログイン</button>
        {/* <button onClick={checkout}>支払い</button> */}
        <br />
        <button onClick={logout}
        className=" bg-brown-400 text-white px-2 py-1 transition hover:opacity-60 shadow-lg ">logout</button>
        </div>
    </>
  );
};

export default CheckoutComponent;