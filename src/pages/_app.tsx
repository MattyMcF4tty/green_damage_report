import { Navbar } from "@/components/navigation";
import "../styles/globals.css";
import type { AppProps } from "next/app";
<<<<<<< Updated upstream
=======
import { Navbar } from "@/components/navigation";
>>>>>>> Stashed changes

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
