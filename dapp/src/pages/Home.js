import React, { useState } from "react";
import "../assets/styles.css";
import Hero from "../components/Hero";
import About from "../components/About";
import Roadmap from "../components/Roadmap";
import Faq from "../components/Faq";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";

const Home = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  // const [position, setPosition] = useState(null);

  // max screen for hide 770
  const position = window;
  const handleScroll = (event) => {
    // setPosition(scrollTop)
    if (position > 300) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  };

  const scrollToTop = () => {
    console.log(position)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  // Add event listener to window scroll
  window.addEventListener('scroll', handleScroll);
  return (
    <div className="home">
      <NavBar />
      <Hero />
      <About />
      <Roadmap />
      <Faq />
      <Footer />
      {showScrollButton && (
        <button onClick={scrollToTop} className="scroll-top-button">
          &#8593;
        </button>
      )}
    </div>
  );
};

export default Home;
