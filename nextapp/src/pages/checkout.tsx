// pages/checkout.tsx

import { doc, collection, addDoc, onSnapshot, getDocs } from 'firebase/firestore';
import { NextRouter } from 'next/router';
import { db } from '../../lib/firebase';

let exportedPaymentDocId: string | null = null; // エクスポートする変数

type MyUser = {
    uid: string;
    emailVerified: boolean;
    isAnonymous: boolean;
  };

const checkout = async (user: MyUser | null, router: NextRouter) => {
  try {
    if (!user) {
      // ログインしていない場合の処理（例: ログインページにリダイレクト）
      router.push('/login');
      return;
    }

    const customerRef = doc(collection(db, 'customers'), user.uid);
    const checkoutColRef = collection(customerRef, 'checkout_sessions');
    const docRef = await addDoc(checkoutColRef, {
      automatic_tax: true,
      price: 'price_1ORTTgGcQxpc945dv18vF3Dy',
      success_url: window.location.origin,
      cancel_url: window.location.origin,
    });

    // paymentsコレクションのドキュメントIDを取得
    // const paymentsColRef = collection(customerRef, 'payments');
    // const paymentsQuery = await getDocs(paymentsColRef);

    // if (!paymentsQuery.empty) {
    //   // paymentsコレクション内にドキュメントが存在する場合、最初のドキュメントのIDを取得
    //   const paymentDocId = paymentsQuery.docs[0].id;
    //   console.log(paymentDocId);
    //   exportedPaymentDocId = paymentDocId;

      // // FastAPIのエンドポイントを通してデータをPOST
      // await fetch(`/api/payment/${user?.uid}`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   // body: JSON.stringify({ payment_id: paymentDocId }),
      // });

      const unsubscribe = onSnapshot(docRef, (snapshot) => {
        const data = snapshot.data();
        console.log('Snapshot data:', data); // Add this line
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

// エクスポートする変数を返す関数を追加
export const getExportedPaymentDocId = () => exportedPaymentDocId;

export default checkout;