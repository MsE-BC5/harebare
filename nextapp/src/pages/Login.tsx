import React from "react";
import { FC, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { addDoc, collection, doc, getDoc, onSnapshot, getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, User,onAuthStateChanged } from 'firebase/auth';
import Header from "./components/header"
import Image from "next/image";

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
    <div className="text-2xl text-center">
      <div className="relative bg-cover h-[500px]">
        <Image src="/colorBack.jpg" alt="Background Image" layout="fill" objectFit="cover" />
        <div className="absolute inset-0 bg-white bg-opacity-50"></div>

      <div className="bg-overlay text-center " style={{ position: 'relative',  height: '100vh' }}>
        <h1 className="space-x-10 m-15 font-semibold text-4xl py-10 text-gray-700"> Googleアカウントで登録 </h1>
        <div className="text-gray-700">email: {user?.email}</div>
        <br />
        <div className="flex justify-center">
        <button
  onClick={loginWithGoogle}
  className="bg-white flex items-center text-gray-700 dark:text-gray-300 justify-center gap-x-3 text-sm sm:text-base  dark:bg-gray-900 dark:border-gray-700 dark:hover:bg-gray-800 rounded-lg hover:bg-gray-100 duration-300 transition-colors border px-8 py-2.5"
>
  <svg className="w-5 h-5 sm:h-6 sm:w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_3033_94454)">
      <path d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9494 17.5885 17.2678 16.323 18.1056V21.1039H20.19C22.4608 19.0139 23.766 15.9274 23.766 12.2764Z" fill="#4285F4"/>
      <path d="M12.2401 24.0008C15.4766 24.0008 18.2059 22.9382 20.1945 21.1039L16.3276 18.1055C15.2517 18.8375 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.2401 24.0008Z" fill="#34A853"/>
      <path d="M5.50253 14.3003C4.99987 12.8099 4.99987 11.1961 5.50253 9.70575V6.61481H1.51649C-0.18551 10.0056 -0.18551 14.0004 1.51649 17.3912L5.50253 14.3003Z" fill="#FBBC04"/>
      <path d="M12.2401 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 -0.034466 12.2401 0.000808666C7.7029 0.000808666 3.55371 2.55822 1.5166 6.61481L5.50264 9.70575C6.45064 6.86173 9.10947 4.74966 12.2401 4.74966Z" fill="#EA4335"/>
    </g>
    <defs>
      <clipPath id="clip0_3033_94454">
        <rect width="24" height="24" fill="white"/>
      </clipPath>
    </defs>
  </svg>

  <span>Sign in with Google</span>
</button>
</div>
<div className="pt-10">
        <button onClick={logout}
          className="bg-brown-400 text-white px-7 py-3 rounded-full transition hover:opacity-60 shadow-lg text-lx">
          Logout
          </button>
        </div>
        </div>
        </div>
        </div>
    </>
  );
};

export default CheckoutComponent;