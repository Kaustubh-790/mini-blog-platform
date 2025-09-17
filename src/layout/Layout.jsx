import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import BackendStatus from "../components/BackendStatus";

export function Layout() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  if (isAuthPage) {
    return (
      <>
        <Outlet />
        <BackendStatus />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 bg-background">
        <Outlet />
      </main>
      <Footer />
      <BackendStatus />
    </div>
  );
}
