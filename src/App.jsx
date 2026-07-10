import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import MapSection from "./components/MapSection";
import Storytelling from "./components/Storytelling";
import Destinations from "./components/Destinations";
import Guidelines from "./components/Guidelines";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <MapSection />
        <Storytelling />
        <Destinations />
        <Guidelines />
      </main>
      <Footer />
    </>
  );
}
