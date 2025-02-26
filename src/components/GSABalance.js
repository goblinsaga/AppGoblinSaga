import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const GsaTokenBalance = () => {
  const [balance, setBalance] = useState(null);
  const [provider, setProvider] = useState(null); // Estado para el proveedor
  const tokenAddress = '0xC1e2859c9D20456022ADe2d03f2E48345cA177C2'; // Dirección del token GSA
  const contractAddress = '0xfa4aC4ADFB3D98646B16ec7a2d4d7c3082ab31D9'; // Dirección del contrato donde queremos verificar el balance

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
      {balance !== null ? <p>{balance} $GSA</p> : <p>Loading...</p>}
    </div>
  );
};

export default GsaTokenBalance;
