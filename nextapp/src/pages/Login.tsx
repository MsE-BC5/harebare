import React from "react";
import { useAuth } from "../../context/auth";
import { login, logout } from "../../lib/auth";
import { useState } from "react";
import { useRouter } from "next/router";

export default function MyLogin() {
  const user = useAuth();
  const [waiting, setWaiting] = useState<boolean>(false);
  const router = useRouter();

  const signIn = async () => {
    setWaiting(true);

    try {
      const result = await login();
      const currentUser = result.user;

      if (currentUser) {
        // ログインしていれば admin ページに遷移
        router.push("/mypage");
      } else {
        console.log("You do not have permission to access this page");
        router.push("/unauthorised");
      }
    } catch (error) {
      console.error(error?.code);
    } finally {
      setWaiting(false);
    }
  };

  return (
    <>
      <div>
        {user === null && !waiting && <button onClick={signIn}>ログイン</button>}
        {user && <button onClick={logout}>ログアウト</button>}
      </div>
    </>
  );
}
