import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const GsaTokenBalance = () => {
  const [balance, setBalance] = useState(null);
  const [provider, setProvider] = useState(null); // Estado para el proveedor
  const tokenAddress = '0xC3882D10e49Ac4E9888D0C594DB723fC9cE95468'; // Dirección del token GSA
  const contractAddress = '0x23673A4CF7943E5D06487420B08bB15dB1ac7C12'; // Dirección del contrato donde queremos verificar el balance

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
