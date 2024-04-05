import React, {useState,useEffect } from "react";
import "../assets/styles.css";
import close from "../assets/img/cancel.png";
import Connect from "./Connect.js";

function NavBar() {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsNavExpanded(false); // Close the navigation if screen size is greater than 768px
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <header className="bg-[#1d1a1a] flex flex-nowrap">
      <div className="font-extrabold font-900 m-3">
        <a href="/" className="brand-logo">
          <i className="text-white subpixel-antialiased">FlappyOwl</i>
        </a>
      </div>
      <div className="nav-burger justify-end" id="nav-burger">
        <button
          className="navbar-burger flex items-center text-white p-2"
          alt="Menu"
          onClick={() => {
            setIsNavExpanded(true);
          }}
        >
          <svg
            width="24px"
            height="24px"
            viewBox="0 0 24.00 24.00"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            stroke="#ffffff"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
              stroke="#CCCCCC"
              strokeWidth="0.384"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <g clipPath="url(#clip0_429_11066)">
                {" "}
                <path
                  d="M3 6.00092H21M3 12.0009H21M3 18.0009H21"
                  stroke="#fff"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>{" "}
              </g>{" "}
              <defs>
                {" "}
                <clipPath id="clip0_429_11066">
                  {" "}
                  <rect
                    width="24"
                    height="24"
                    fill="white"
                    transform="translate(0 0.000915527)"
                  ></rect>{" "}
                </clipPath>{" "}
              </defs>{" "}
            </g>
          </svg>
        </button>
      </div>
      <div className=" mx-auto"></div>
      <div>
        <nav
          className={
            isNavExpanded ? "nav-custom open-menu" : "nav-custom is-active"
          }
        >
          <div className={isNavExpanded ? "nav-cancel" : "nav-cancel is-active"}>
            <div className="close-button"
            src={close}
            onClick={() => {
              setIsNavExpanded(false);
            }}
            alt="Cancel"></div>

          </div>
          <div className="nav-links_div justify-end">
            <a href="/" className="text-white nav-link_ref">
              Home
            </a>
            <a href="/vault" className="text-white nav-link_ref">
              vault
            </a>
            <a href="/#about" className="text-white nav-link_ref">
              About
            </a>
            <a href="/#roadmap" className="text-white nav-link_ref">
              Roadmap
            </a>
            <a href="/#faq" className="text-white nav-link_ref">
              Faq
            </a>
            <Connect />
          </div>
        </nav>
      </div>
    </header>
  );
}

export default NavBar;
