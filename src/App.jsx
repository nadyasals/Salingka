import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
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
        <Destinations />
        <Guidelines />
      </main>
      <Footer />
    </>
  );
}
