import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Destinations from "./components/Destinations";
import Guidelines from "./components/Guidelines";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <a href="#destinasi" className="skip-link">Langsung ke konten utama</a>
      <Navbar />
      <main id="main-content">
        <Hero />
        <Stats />
        <Destinations />
        <Guidelines />
      </main>
      <Footer />
      <style>{`
        .skip-link {
          position: absolute;
          top: -40px;
          left: 1rem;
          background: var(--leaf);
          color: var(--forest);
          padding: 8px 16px;
          border-radius: 0 0 8px 8px;
          font-size: 0.85rem;
          font-weight: 600;
          z-index: 9999;
          transition: top 0.2s;
        }
        .skip-link:focus {
          top: 0;
        }
      `}</style>
    </>
  );
}