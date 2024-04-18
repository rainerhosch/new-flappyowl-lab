import { useState, useEffect } from 'react';

const CardStackSlider = ({ cards }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Function to handle next slide
  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  // Autoplay functionality
  useEffect(() => {
    const intervalId = setInterval(nextSlide, 2000); // Change the interval time as needed (in milliseconds)
    
    // Cleanup function to clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array to run only once when component mounts

  return (
    <div className="perspective-carousel">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-transform duration-300 ease-in-out ${
            index === activeIndex ? "opacity-100" : "opacity-0"
        } ${index % activeIndex === 0 ?  '-translate-x-0' : ''}`}
        >
          {card}
        </div>
      ))}
    </div>
  );
};

export default CardStackSlider;
