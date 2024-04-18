// components/Carousel.js
import React,{ useState, useEffect } from 'react';
import Image from "next/image"

const Carousel = ({ images }) => {
    const [activeIndex, setActiveIndex] = useState(0)

    // Function to handle next slide
    const nextSlide = () => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % images.length)
    }

    // Autoplay functionality
    useEffect(() => {
        const intervalId = setInterval(nextSlide, 2000) // Change the interval time as needed (in milliseconds)

        // Cleanup function to clear interval on component unmount
        return () => clearInterval(intervalId)
    }, []) // Empty dependency array to run only once when component mounts
    return (
        <div className="flex justify-center items-center">
            <div className="'text-Snow perspective-carousel">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 bg-yellow-200 p-4 rounded-lg shadow-black shadow-md transform transition-transform duration-500 ease-in-out ${
                            index === activeIndex ? "opacity-100" : "opacity-0"
                        } ${index % activeIndex === 0 ? "-translate-y-0" : "-translate-y-0"}`}
                    >
                        <Image
                            src={image}
                            alt={`Slide ${index + 1}`}
                            width={300}
                            height={172}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Carousel
