// lib/firebase.ts
//firebaseの初期化

//　認証に必要な要素をインポート
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import * as dotenv from 'dotenv'

dotenv.config(); // .envファイルの内容を読み込む

//　firebaseと連携するための情報
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID
};

//　firebaseがすでに初期化されているかチェック、初期化されていない場合初期化する関数
//　!getApps()?.lengthは現在アプリが 0 である場合に true を返し、初期化をする
if (!getApps()?.length) {
  initializeApp(firebaseConfig);
}

//firebaseの認証とデータベースを初期化してエクスポート
export const auth = getAuth();
export const db = getFirestore();