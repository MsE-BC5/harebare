import { useRouter } from 'next/router';
import { logout } from "../lib/auth";
import Image from "next/image";
import Link from "next/link";
import Header from "./components/header"

const UnauthorizedPage = () => {
  const router = useRouter();

  const handleGoHome = () => {
    logout();
    router.push('/');
  };

  return (
    <div>
    <Header />
      <div className="relative text-2xl bg-cover">
        <div className=" h-[700px]">
          <Image src="/colorBack.jpg" alt="Background Image" layout="fill" objectFit="cover" />
        <div className="absolute inset-0 bg-white bg-opacity-50"></div>
        </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
      <div className="flex items-center mt-5">
        <Image src="/cloud.PNG" alt="Image" width={300} height={10} style={{ marginTop: '-200px' }}/>
        <Image src="/first.PNG" alt="Image" width={400} height={10} style={{ marginTop: '-200px' }}/>
      </div>
      <Link href = "/Login"
      className='text-gray-700'
      style={{ marginTop: '-130px' }}>
              会員登録はこちら
      </Link>
      <button onClick={handleGoHome}
      className='text-gray-700  text-lg mt-7'>ホーム画面に戻る</button>
      </div>
    </div>
    </div>
  );
};

export default UnauthorizedPage;