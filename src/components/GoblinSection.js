'use client';

import { useAddress, useContract, useContractRead, useOwnedNFTs } from "@thirdweb-dev/react";
import NFTCard from "./NFTCard";
import { useState, useEffect } from "react";
import { nftDropContractAddress, stakingContractAddress } from "../../consts/contractAddresses2";
import ErrorMessagePopup from '../components/popups/ErrorMessagePopup';
import SuccessMessagePopup from '../components/popups/SuccessMessagePopup';
import { client } from "../app/client";
import { MediaRenderer } from "thirdweb/react";
import GoblinRewards from "./UserStats/GoblinsRewards";

const GoblinSection = () => {
  const [showNFTs, setShowNFTs] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [miningStatus, setMiningStatus] = useState('');

  const toggleNFTs = () => setShowNFTs(!showNFTs);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const address = useAddress();
  const { contract: nftDropContract } = useContract(nftDropContractAddress, "nft-drop");
  const { contract } = useContract(stakingContractAddress);
  const { data: ownedNfts } = useOwnedNFTs(nftDropContract, address);
  const { data: stakedTokens } = useContractRead(contract, "getStakeInfo", [address]);

  async function stakeNft(id) {
    if (!address) return;

    const isApproved = await nftDropContract?.isApproved(address, stakingContractAddress);
    if (!isApproved) {
      await nftDropContract?.setApprovalForAll(stakingContractAddress, true);
    }

    setMiningStatus('Mining...');

    try {
      await contract?.call("stake", [[id]]);
      setSuccessMessage('Goblin Mining'); // Mensaje de éxito
    } catch (error) {
      console.error(error);
      setErrorMessage('Transaction Rejected, Try Again'); // Mensaje de error
    } finally {
      setMiningStatus(''); // Restablecer el estado después de completar el staking
    }
  }

  return (
    <section id="roadmap">
      <div id="goblins" className="container">
        <h3
          className="fn__maintitle big"
          data-text="Goblins"
          data-align="center"
        >
          Goblins
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
          <div className="gridNFT">
            {address ? (
              stakedTokens && stakedTokens[0]?.length > 0 ? (
                stakedTokens[0]?.map((stakedToken) => (
                  <NFTCard
                    tokenId={stakedToken.toNumber()}
                    key={stakedToken.toString()}
                  />
                ))
              ) : (
                <p>No staked NFTs found.</p>
              )
            ) : (
              <p style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Nothing to see here.</p>
            )}
          </div>
        )}
      </div>
      {showNFTs && (
        <div className="container">
          <h3
            className="fn__maintitle big"
            data-text="Unmined Goblins"
            data-align="center"
            style={{ marginTop: "50px" }}
          >
            Unmined Goblins
          </h3>

          <div style={{ marginBottom: "100px" }} className="gridNFT">
            {address ? (
              ownedNfts?.length > 0 ? (
                ownedNfts.map((nft) => (
                  <div key={nft.metadata.id.toString()}>
                    <MediaRenderer
                      client={client}
                      src={nft?.metadata.image}
                      className="nftMedia"
                      style={{
                        marginTop: "25px",
                        borderRadius: "10px",
                        marginBottom: "10px",
                        height: "300px",
                        width: "300px"
                      }}
                    />
                    <p style={{ textAlign: "center", marginTop: "10px" }}>{nft.metadata.name}</p>
                    <button
                      className="metaportal_fn_buttonLW"
                      style={{
                        width: "100%",
                        height: "45px",
                      }}
                      onClick={() => stakeNft(nft.metadata.id)}
                      disabled={miningStatus === 'Mining...'} // Desactivar el botón mientras se está minteando
                    >
                      {miningStatus || "Mine"} {/* Cambia el texto según el estado */}
                    </button>
                    {successMessage && <SuccessMessagePopup message={successMessage} onClose={() => setSuccessMessage('')} />}
                    {errorMessage && <ErrorMessagePopup message={errorMessage} onClose={() => setErrorMessage('')} />}
                  </div>
                ))
              ) : (
                <p>No owned NFTs found.</p>
              )
            ) : (
              <p style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Nothing to see here.</p>
            )}
          </div>
        </div>
      )}
      <div className="container" style={{ paddingBottom: "5rem" }}>
        <GoblinRewards />
      </div>
    </section>
  );
};

export default GoblinSection;
