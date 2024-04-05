import React from "react";
import "../assets/styles.css";

function Roadmap() {
  return (
    <>
      <section className="roadmap" id="roadmap">
        <div className="roadmap-title roadmap-container">
          <h1 className="text-center text-[#000000]">Roadmap </h1>
        </div>
        <div className="timeline roadmap-container">
          <div className="entry">
            <div className="title">
              <h3>In Progress</h3>
            </div>
            <div className="body">
              <p>Phase 1</p>
              <p>Testnet stage</p>
              <p>Deployed NFT on mainnet</p>
              <p>NFT Sale on Ehereum Mainnet</p>
            </div>
          </div>
          <div className="entry">
            <div className="title">
              <h3>Coming Soon</h3>
            </div>
            <div className="body">
              <p>Phase 2</p>
              <p>Deploy Dapp Vault on mainnet.</p>
              <p>Public Sale </p>
              <p>Initial Liquidity</p>
              <p>Launch DApp on mainet.</p>
            </div>
          </div>
          <div className="entry">
            <div className="title">
              <h3>Coming Soon</h3>
            </div>
            <div className="body">
              <p>Phase 3</p>
              <p>Airdrop $FRC distribution, for testnet contributors</p>
            </div>
          </div>
          <div className="entry">
            <div className="title">
              <h3>Coming Soon</h3>
            </div>
            <div className="body">
              <p>Phase 4</p>
              <p>We'll let you guess...</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Roadmap;
