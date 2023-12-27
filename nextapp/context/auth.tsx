// user.tsで設定したUser、新しいコンテキストを作成するcreateをreactからインポート
import { User } from "../types/user";
import { auth, db } from "../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { 
   ReactNode,
   createContext,
   useContext,
   useEffect,
   useState,
} from "react";

//　UserCnotextTypeという新しい型をユニオン型で定義
// ログイン中はUser,ログインしていない場合はnullをローディング中はundefinedを返し
// それぞれに合ったUIを返す
type UserContextType = User | null | undefined;

// undefinedを初期値にもったAuthContextという新しいコンテキストを作成
// 型は先程定義したUserContextTypeを指定
const AuthContext = createContext<UserContextType>(undefined);


//　AuthProviderは受け取った受け取ったchildrenというpropsを使用して
//　ラップされた要素全てに認証情報を提供 
// 型は React のプロパティ型の１つの ReactNode を指定
// 最後の return 文はAuthContext.Providerと呼ばれる
// React のコンテキストを使用して、user 変数を設定し、
// 子要素がユーザー情報を提供できるようにしている

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserContextType>();

// useStateを使用してuserという変数を定義し、更新関数としてsetUserを指定
// 型は作成したUserContextType

//useEffectを用いて認証状態が変化したときに呼ばれる
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    try {
      if (firebaseUser) {
        const ref = doc(db, `users/${firebaseUser.uid}`);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const appUser = (await getDoc(ref)).data() as User;
          setUser(appUser);
        } else {
          const appUser: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName!,
          };

          await setDoc(ref, appUser); // await を追加
          setUser(appUser);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error in onAuthStateChanged callback:", error);
    }
  });

  return () => unsubscribe();
}, []);
return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);