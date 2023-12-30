// pages/_app.tsx

import { AuthProvider } from "../../context/auth";
import type { AppProps } from 'next/app';

function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default App;