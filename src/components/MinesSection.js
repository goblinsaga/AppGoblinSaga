'use client';

import Businesses from "./Businesses";
import BusinessesTwo from "./Businesses2";
import { useState } from "react";
import { useAddress } from "@thirdweb-dev/react";
import MinesRewards from "./UserStats/MinesRewards";

const MinesSection = () => {
  const address = useAddress();
  const [showNFTs, setShowNFTs] = useState(false);


  const toggleNFTs = () => setShowNFTs(!showNFTs);

  return (
    <section id="roadmap">
      <div id="mines" className="container">
        <h3
          className="fn__maintitle big"
          data-text="Mines & Partners"
          data-align="center"
        >
          Mines & Partners
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
          <div style={{ marginTop: "50px", marginBottom: "100px" }} className="gridNFT">
            <div style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              flexDirection: "row",
              width: "100%",
            }}>
              <Businesses />
            </div>
          </div>
        )}

        {showNFTs && (
          <div>
            <h3
              className="fn__maintitle big"
              data-text="Partners"
              data-align="center"
            >
              Partners
            </h3>

            <div style={{ marginTop: "50px", marginBottom: "100px" }} className="gridNFT">
              <div style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                flexDirection: "row",
                width: "100%",
              }}>
                <BusinessesTwo />
              </div>
            </div>
          </div>
        )}
        <div style={{ paddingBottom: "5rem" }}>
          <MinesRewards />
        </div>
      </div>
    </section>
  );
};

export default MinesSection;
