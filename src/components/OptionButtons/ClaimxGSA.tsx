import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { stakingContractAddress } from "../../../consts/contractAddressesNew";
import SuccessMessagePopup from "../popups/SuccessMessagePopup";
import ErrorMessagePopup from "../popups/ErrorMessagePopup";
import stakingContractABI from "../../../contracts/StakingContract.json"; // Asegúrate de tener el ABI del contrato

const ClaimxGSA = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 4000); // Cierra el mensaje de error después de 4 segundos

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 4000); // Cierra el mensaje de éxito después de 4 segundos

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleClaim = async () => {
    if (!window.ethereum) {
      setErrorMessage('No Ethereum wallet found.');
      return;
    }

    try {
      setIsClaiming(true);

      // Conectar la billetera
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      // Conectar al contrato
      const stakingContract = new ethers.Contract(stakingContractAddress, stakingContractABI, signer);

      // Llamar a la función claimRewards
      const tx = await stakingContract.claimRewards();
      await tx.wait(); // Espera a que la transacción sea minada

      setSuccessMessage('xGSA Claimed');
    } catch (error) {
      setErrorMessage('Error: Transaction rejected or insufficient funds.');
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div>
      {successMessage && <SuccessMessagePopup message={successMessage} onClose={() => setSuccessMessage('')} />}
      {errorMessage && <ErrorMessagePopup message={errorMessage} onClose={() => setErrorMessage('')} />}
      <button className="metaportal_fn_buttonLW" onClick={handleClaim} disabled={isClaiming}>
        {isClaiming ? "Claiming..." : "Claim Goblins"}
      </button>
    </div>
  );
};

export default ClaimxGSA;
