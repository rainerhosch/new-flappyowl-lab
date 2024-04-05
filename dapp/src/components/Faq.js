import React from "react";
import "../assets/styles.css";
import "bootstrap/dist/css/bootstrap.css";

function Faq() {
  return (
    <div className="faq font-white" id="faq">
      <div className="container">
        <div className="faq-questions">
        <p className="faqhead text-center">Frequently asked questions</p>
          <details open="">
            <summary>How it's work</summary>
            <div className="faq__content">
              <p>
                people stake their nft in the vault, then the reward calculation starts running.
                After some time a number of rewards will appear in the calculation panel, the $FRC reward can be claimed.
                The calculation is BASE_REWARD = Base Daily Rewadr / Total Staked Nfts
              </p>
            </div>
          </details>
          <details>
            <summary>What is the price of nft on mainet?</summary>
            <div className="faq__content">
              <p>0.005ETH Per 1 Nft.</p>
            </div>
          </details>
          <details>
            <summary>How many supply nfts at mainet?</summary>
            <div className="faq__content">
              <p>
                Only 21000 Nft
              </p>
            </div>
          </details>
          <details>
            <summary>How many supply $FRC?</summary>
            <div className="faq__content">
              <p>The initial supply is 21 million $FRC.</p>
              <p>And the allocation is as follows:</p>
              <p>- 70% for Public Sale</p>
              <p>- 15% for Initial Liquidity, and locked for 10 years</p>
              <p>- 10% for Airdrop</p>
              <p>- 5% for Foundation Long-term Endowment.</p>
            </div>
          </details>
          <details>
            <summary>
              What about after testnet, will there be an airdrop to the testers?
            </summary>
            <div className="faq__content">
              <p>
                yes! that's for sure, as a reward to the community there will be
                an allocation of tokens that are recorded on the blockchain that
                have participated in the testnet.
              </p>
              <p>
                It will be distributed after public sales and initial liquidity.
              </p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}

export default Faq;
