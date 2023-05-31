import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Navbar, NavButtons } from "@/components/navigation";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navbar />
      <div className="p-4">
        <Component {...pageProps} />
      </div>
    </>
  );
}

export default MyApp;
