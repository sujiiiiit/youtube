import React from "react";
import Header from "./components/Header/header";
import Navbar from "./components/Navbar/navbar";
const App: React.FC = () => {
  return (
    <>
      <div className="h-dvh	w-dvw	font-Geist bg-[var(--background)]">
        <Header />
        <section className="main">
          <Navbar />
        </section>
      </div>
    </>
  );
};

export default App;
