import { Navbar } from "@/components/navigation";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import AdminNavbar from "@/components/admin/adminNav";

function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  console.log(pathname);

  return (
    <>
      {pathname.startsWith("/damagereport") ? (
        <div>
          <Navbar />
          <div className="p-4">
            <Component {...pageProps} />
          </div>
        </div>
      ) : pathname.startsWith("/admin") ? (
        <div>
          <AdminNavbar />
          <div className="p-4">
            <Component {...pageProps} />
          </div>
        </div>
      ) : (
        <div className="p-4">
          <img
            src="../GreenLogos/GreenMobilityTextLogo.png"
            alt="greenlogo"
            className=""
          />
          <Component {...pageProps} />
        </div>
      )}
    </>
  );
}

export default MyApp;
