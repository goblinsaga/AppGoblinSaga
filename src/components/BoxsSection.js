'use client';

import { useAddress } from "@thirdweb-dev/react";
import Box from "./Box";
import { useState, } from "react";
import BoxRewards from "./UserStats/BoxRewards";


const BoxsSection = () => {
  const address = useAddress();
  const [showNFTs, setShowNFTs] = useState(false);
  const toggleNFTs = () => setShowNFTs(!showNFTs);

  return (
    <section id="roadmap">
      <div id="sitems" className="container">
        <h3
          className="fn__maintitle big"
          data-text="S. Items Working"
          data-align="center"
        >
          S. Items Working
        </h3>

        {address ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: "15px" }}>
            <button className="metaportal_fn_buttonLW" onClick={toggleNFTs}>
              {showNFTs ? "Hide NFTS" : "Show NFTS"}
            </button>
          </div>
        ) : (
          <p style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Nothing to see here.</p>
        )}
        
        {showNFTs && (
          <div style={{ marginBottom: "150px" }} className="gridNFT">
            <div style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              flexDirection: "row",
              width: "100%",
            }}>
              <Box />
            </div>
          </div>
        )}
        <div style={{ paddingBottom: "5rem" }}>
          <BoxRewards />
        </div>
      </div>
    </section>
  );
};

export default BoxsSection;
