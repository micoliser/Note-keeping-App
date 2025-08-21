import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Layout({ handleSearchChange, searchedNote }) {
  return (
    <>
      <Header change={handleSearchChange} value={searchedNote} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default Layout;
