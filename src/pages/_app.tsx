import { Navbar } from "@/components/navigation";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import AdminNavbar from "@/components/admin/adminNav";

function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();

  if (pathname.startsWith("/damagereport")) {
    return (
      <>
        <Navbar />
        <div className="p-4">
          <Component {...pageProps} />
        </div>
      </>
    );
  } else if (pathname.startsWith("/admin")) {
    return (
      <>
        <AdminNavbar />
        <div>
          <Component {...pageProps} />
        </div>
      </>
    );
  } else {
    <>
      <div>
        <Component {...pageProps} />
      </div>
    </>
  }
}

export default MyApp;
