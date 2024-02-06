//　Google アカウントを使用した認証に必要なGoogleAuthProvider,
// 認証ポップアップを表示するsignInWithPopup,
// 認証に成功したユーザー情報を取得するUserCredential,
// ユーザーをログアウトするための機能signOutを
// firebase/authより firebase.tsで定義したauthをインポート（Firebase　Authenticationの設定）
import { getDoc, doc } from 'firebase/firestore';  

import {
    GoogleAuthProvider,
    signInWithPopup,
    UserCredential,
    signOut,
  } from 'firebase/auth';
  import { auth, db } from "./firebase";
  
// firebase にログインするための関数 login を定義し Promise を使用して
// 非同期処理を行いその結果としてユーザー情報を取得する UserCredential を返す
// provider という定数に new を使用して GoogleAuthProvider オブジェクトを作成
// signInWithPopup でポップアップウィンドウで Google ログインの処理を行う
// 最後にログインが成功すると非同期処理を行っていた Promise を返す
  
  export const login = (): Promise<UserCredential> => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };
  
// ログアウトするための関数
// signOut(auth)で現在認証されているユーザーをログアウトし
// 最後非同期処理でPromise<void>（何も返さない）を返す。ログアウト完了まで待機。

  export const logout = (): Promise<void> => {
    return signOut(auth);
    
  };