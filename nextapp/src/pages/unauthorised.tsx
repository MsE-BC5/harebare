// pages/unauthorized.tsx


import { useRouter } from 'next/router';
import { logout } from "../../lib/auth";

const UnauthorizedPage = () => {
  const router = useRouter();

  const handleGoHome = () => {
    logout();
    router.push('/');
  };

  return (
    <div>
      <h3>新規登録されてません</h3>
      <p>会員登録はこちら</p>
      <button onClick={handleGoHome}>ホーム画面に戻る</button>
    </div>
  );
};

export default UnauthorizedPage;