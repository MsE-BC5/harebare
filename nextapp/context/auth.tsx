// context/auth.tsx
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
  SetStateAction,
  Dispatch,
} from "react";

type AuthContextType = {
  user: User | null | undefined;
  registrationInfo: { id: string; name: string; email: string };
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// setRegistrationInfo の型を修正
type SetRegistrationInfoAction = Dispatch<SetStateAction<{ id: string; name: string; email: string }>>;

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null | undefined>();
  const [registrationInfo, setRegistrationInfo] = useState<{
    id: string;
    name: string;
    email: string;
  }>({
    id: "", // 初期値に id を追加
    name: "",
    email: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const ref = doc(db, `users/${firebaseUser.uid}`);
          const snap = await getDoc(ref);

          if (snap.exists()) {
            const appUser = snap.data() as User;
            appUser.email =
              firebaseUser.email || firebaseUser.providerData[0]?.email || "";
            setUser((prevUser) => (prevUser ? prevUser : appUser));
          } else {
            const appUser: User = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName!,
              email: firebaseUser.email,
              // nick_name: null,
            };
            await setDoc(ref, appUser);
            setUser((prevUser) => (prevUser ? prevUser : appUser));
          }

          setRegistrationInfo((prevInfo) => ({
            ...prevInfo,
            id: firebaseUser.uid,
            name: firebaseUser.displayName || "",
            email:
              firebaseUser.email ||
              firebaseUser.providerData[0]?.email ||
              "",
          }));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error in onAuthStateChanged callback:", error);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, registrationInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useRegistrationInfo = (): { id: string; name: string; email: string } => {
  //console.log("useRegistrationInfo");
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useRegistrationInfo must be used within an AuthProvider");
  }

  return context.registrationInfo;
};

// //context//auth.tsx

// // user.tsで設定したUser、新しいコンテキストを作成するcreateをreactからインポート
// import { User } from "../types/user";
// import { auth, db } from "../lib/firebase";
// import { doc, getDoc, setDoc } from "firebase/firestore";
// import { onAuthStateChanged } from "firebase/auth";
// import { 
//    ReactNode,
//    createContext,
//    useContext,
//    useEffect,
//    useState,
// } from "react";

// //　UserCnotextTypeという新しい型をユニオン型で定義
// // ログイン中はUser,ログインしていない場合はnullをローディング中はundefinedを返し
// // それぞれに合ったUIを返す
// type UserContextType = User | null | undefined;

// // undefinedを初期値にもったAuthContextという新しいコンテキストを作成
// // 型は先程定義したUserContextTypeを指定
// const AuthContext = createContext<UserContextType>(null);


// //　AuthProviderは受け取った受け取ったchildrenというpropsを使用して
// //　ラップされた要素全てに認証情報を提供 
// // 型は React のプロパティ型の１つの ReactNode を指定
// // 最後の return 文はAuthContext.Providerと呼ばれる
// // React のコンテキストを使用して、user 変数を設定し、
// // 子要素がユーザー情報を提供できるようにしている

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   console.log("AuthProvider: Rendered"); // ログを追加 
//   const [user, setUser] = useState<UserContextType>();

//   // 新規登録情報のステート
//   const [registrationInfo, setRegistrationInfo] = useState<{ name: string; email: string }>({ name: "", email: "" });

// //useEffectを用いて認証状態が変化したときに呼ばれる
// useEffect(() => {
//   const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
//     try {
//       //console.log('onAuthStateChanged callback', firebaseUser);
//       if (firebaseUser) {
//         console.log('firebaseUser', firebaseUser);
//         const ref = doc(db, `users/${firebaseUser.uid}`);
//         console.log('ref', ref);
//         const snap = await getDoc(ref);
//         console.log('getDoc',ref);

//         if (snap.exists()) {
//           const appUser = (await getDoc(ref)).data() as User;
//             appUser.email = firebaseUser.email || (firebaseUser.providerData[0]?.email || "");
//           console.log('appUser', appUser); // 追加
//           setUser(appUser);
//           setRegistrationInfo({
//             name: appUser.name,
//             email: appUser.email,
//           });
//         } else {
//           console.log('else');
//           const appUser: User = {
//             id: firebaseUser.uid,
//             name: firebaseUser.displayName!,
//             email: firebaseUser.email,
//           };
//           await setDoc(ref, appUser); // await を追加
//           setUser(appUser);
//         }
      
//         // 新規登録情報をセット
//         setRegistrationInfo({
//           name: firebaseUser.displayName || "",
//           email: firebaseUser.email || (firebaseUser.providerData[0]?.email || ""),
//         });
//       } else {
//         setUser(null);
//       }
//     } catch (error) {
//       console.error("Error in onAuthStateChanged callback:", error);
//     }
//   });

//   return () => unsubscribe();
// }, []);
// return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
// };

// // useRegistrationInfo フック
// export const useRegistrationInfo = () => {
//   const registrationInfo = useContext(AuthContext);

//   if (registrationInfo === undefined) {
//     throw new Error('useRegistrationInfo must be used within an AuthProvider to access registration information.');
//   }

//   return registrationInfo;
// };

// // useAuth フック
// export const useAuth = () => {
//   const user = useRegistrationInfo();

//   if (user === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider to access user information.');
//   }

//   return user;
// };

// context/auth.tsx
// ...

// context/auth.tsx

// // user.tsで設定したUser、新しいコンテキストを作成するcreateをreactからインポート
// import { User } from "../types/user";
// import { auth, db } from "../lib/firebase";
// import { doc, getDoc, setDoc } from "firebase/firestore";
// import { onAuthStateChanged } from "firebase/auth";
// import { 
//    ReactNode,
//    createContext,
//    useContext,
//    useEffect,
//    useState,
// } from "react";

// //　UserCnotextTypeという新しい型をユニオン型で定義
// // ログイン中はUser,ログインしていない場合はnullをローディング中はundefinedを返し
// // それぞれに合ったUIを返す
// type UserContextType = User | null | undefined;

// // undefinedを初期値にもったAuthContextという新しいコンテキストを作成
// // 型は先程定義したUserContextTypeを指定
// const AuthContext = createContext<UserContextType>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<UserContextType>();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
//       try {
//         if (firebaseUser) {
//           const ref = doc(db, `users/${firebaseUser.uid}`);
//           const snap = await getDoc(ref);
  
//           if (snap.exists()) {
//             const appUser = (await getDoc(ref)).data() as User;
//             setUser(appUser);
//           } else {
//             const appUser: User = {
//               id: firebaseUser.uid,
//               name: firebaseUser.displayName!,
//             };
  
//             await setDoc(ref, appUser); // await を追加
//             setUser(appUser);
//           }
//         } else {
//           setUser(null);
//         }
//       } catch (error) {
//         console.error("Error in onAuthStateChanged callback:", error);
//       }
//     });
  
//     return () => unsubscribe();
//   }, []);
//   return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => useContext(AuthContext);


