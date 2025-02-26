import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const XGsaTokenBalance = () => {
  const [balance, setBalance] = useState(null);
  const [provider, setProvider] = useState(null); // Estado para el proveedor
  const tokenAddress = '0x8a5135ffb75af2460605d26c190db5862c6ec55b'; // Dirección del token GSA
  const contractAddress = '0x675d4244fa9fB9D57Ef22A556c8ce5B85839Abe4'; // Dirección del contrato donde queremos verificar el balance

  const tokenABI = [
    // ABI mínima para balanceOf
    "function balanceOf(address owner) view returns (uint256)"
  ];

  useEffect(() => {
    // Inicializar el proveedor solo en el cliente
    if (typeof window !== "undefined" && window.ethereum) {
      setProvider(new ethers.providers.Web3Provider(window.ethereum));
    }
  }, []);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        if (!provider) return; // Esperar a que el proveedor esté disponible
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
        const balance = await tokenContract.balanceOf(contractAddress);
        const formattedBalance = ethers.utils.formatUnits(balance, 18);

        // Formatear con comas y 2 decimales
        setBalance(parseFloat(formattedBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
      } catch (error) {
        console.error("Error on loading:", error);
      }
    };

    fetchBalance();
  }, [provider]);

  return (
    <div>
      {balance !== null ? <p>{balance} $xGSA</p> : <p>Loading...</p>}
    </div>
  );
};

export default XGsaTokenBalance;
