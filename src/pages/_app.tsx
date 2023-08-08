import { Navbar } from "@/components/navigation";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {

  const { pathname } = useRouter();
  
  if (pathname.startsWith('/damagereport')) {
    return (
      <>
        <Navbar />
        <div className="p-4">
          <Component {...pageProps} />
        </div>
      </>
    );
  } else {
    return (
      <>
        <div>
          <Component {...pageProps} />
        </div>
      </>
    );
  }
}

export default MyApp;
