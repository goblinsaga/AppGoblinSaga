'use client';

import React, { useEffect, useState } from "react";
import {
  useContract,
  useNFT,
  useAddress,
  toEther,
} from "@thirdweb-dev/react";
import {
  nftDropContractAddress,
  stakingContractAddress,
} from "../../consts/contractAddressesNew";
import { BigNumber } from "ethers";
import ErrorMessagePopup from '../components/popups/ErrorMessagePopup';
import SuccessMessagePopup from '../components/popups/SuccessMessagePopup';
import { MediaRenderer } from "thirdweb/react";
import { client } from "../app/client";

interface NFTCardProps {
  tokenId: number;
}

const NFTCard: React.FC<NFTCardProps> = ({ tokenId }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [claimableRewards, setClaimableRewards] = useState<BigNumber>();
  const [isWithdrawing, setIsWithdrawing] = useState(false); // Estado para controlar el botón

  const address = useAddress();
  const { contract } = useContract(nftDropContractAddress, "nft-drop");
  const { data: nft } = useNFT(contract, tokenId);
  const { contract: stakingContract } = useContract(stakingContractAddress);


  useEffect(() => {
    if (!stakingContract || !address) return;

    async function loadClaimableRewards() {
      const stakeInfo = await stakingContract?.call("getRewardsPerUnitTime");
      setClaimableRewards(stakeInfo);
    }

    loadClaimableRewards();

    const intervalId = setInterval(loadClaimableRewards, 1000);
    return () => clearInterval(intervalId);
  }, [stakingContract, address]);

  const truncateRevenue = (revenue: BigNumber) => {
    const convertToEther = toEther(revenue);
    const truncateValue = convertToEther.toString().slice(0, 6);
    return truncateValue;
  };

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 4000);
    
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 4000);
    
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleWithdraw = async () => {
    if (!stakingContract || !nft?.metadata?.id) {
      setErrorMessage('Error: Contract or NFT metadata unavailable.');
      return;
    }

    try {
      setIsWithdrawing(true); // Cambiar a "Withdrawing..." antes de realizar la transacción
      await stakingContract.call("withdraw", [[nft.metadata.id]]);
      setSuccessMessage('Goblin Taking a break');
    } catch (error) {
      setErrorMessage('Error: Transaction rejected or insufficient funds.');
    } finally {
      setIsWithdrawing(false); // Volver a estado normal después de la transacción
    }
  };

  return (
    <>
      {nft && (
        <div>
          {nft.metadata && (
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
          )}
          <div className="nftBox">
            <p style={{ textAlign: "center", marginTop: "10px" }}>{nft.metadata.name}</p>
            {claimableRewards && (
              <p style={{ textAlign: "center" }}> 
                <b>{truncateRevenue(claimableRewards)}</b>
                <img src="/img/LOGOS-xGS-32x32.png" alt="$GSA" style={{ width: "20px", height: "20px", margin: "-4px 5px" }} />
                <b style={{ fontSize: "12px" }}>24h</b>
              </p>
            )}
          </div>
          <button
            className="metaportal_fn_buttonLW"
            onClick={handleWithdraw}
            disabled={isWithdrawing} // Deshabilitar el botón durante la transacción
            style={{
              width: "100%",
              height: "45px",
            }}
          >
            {isWithdrawing ? "Withdrawing..." : "Withdraw"} {/* Texto dinámico */}
          </button>
          {successMessage && <SuccessMessagePopup message={successMessage} onClose={() => setSuccessMessage('')} />}
          {errorMessage && <ErrorMessagePopup message={errorMessage} onClose={() => setErrorMessage('')} />}
        </div>
      )}
    </>
  );
};

export default NFTCard;
