import React from "react";
import { AiOutlineTwitter, AiOutlineGithub } from "react-icons/ai";
import { RiDiscordFill } from "react-icons/ri";

function Footer() {
  return (
    <section className="footer">
      <div className="footer-content">
        <div className="copy-text">
          <p className="text-left">
            <i className="text-bold">FlappyOwl Foundation</i>&#169; All Right Reserved
          </p>
        </div>
        {/* <div></div> */}
        <div className="social">
          <a target="_blank"rel="noreferrer" href="https://github.com/">
            <AiOutlineGithub size={24} color="#fff" />
          </a>
          <a target="_blank"rel="noreferrer" href="https://twitter.com/_FlappyOwlNft">
            <AiOutlineTwitter size={24} color="#fff" />
          </a>
          <a target="_blank"rel="noreferrer" href="https://discord.gg/flappyowlnft">
            <RiDiscordFill size={24} color="#fff" />
          </a>
        </div>
      </div>
    </section>
  );
}

export default Footer;
