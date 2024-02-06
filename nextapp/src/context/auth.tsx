// context/auth.tsx
import { User } from "../../types/user";
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
