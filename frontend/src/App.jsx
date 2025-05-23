import { Outlet, useLocation } from "react-router-dom";
import { ContextProvider } from "./context/dataContext";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import "./index.css";
import { ToastContainer } from "react-toastify";
import TrackOrder from "./components/TrackOrder";

function App() {
  const location = useLocation();

  const hideHeaderFooterRoutes = [
    "/paypal-success",
    "/payment-error",
    "/payment-cancelled",
  ];

  const shouldHideHeaderFooter = hideHeaderFooterRoutes.includes(
    location.pathname
  );
  return (
    <ContextProvider>
      <div className="min-h-screen flex flex-col">
        {!shouldHideHeaderFooter && <Header />}
        <main className="bg-gray-100 flex-grow relative">
          <div className="grid grid-cols-12">
            {/* Main Content - Outlet */}
            <div
              className={`${
                location?.pathname === "/" ? "col-span-12" : "col-span-12"
              }`}
            >
              <Outlet />
            </div>
          </div>
        </main>
        <ToastContainer />

        {!shouldHideHeaderFooter && <Footer />}
      </div>
    </ContextProvider>
  );
}

export default App;
