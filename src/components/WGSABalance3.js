import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const WGsaTokenBalanceTwo = () => {
  const [balance, setBalance] = useState(null);
  const [provider, setProvider] = useState(null); // Estado para el proveedor
  const tokenAddress = '0x6f5c47c85E55ef4E0d17c4d221C79d0e7a0A4650'; // Dirección del token GSA
  const contractAddress = '0xf060DC2A89ba68F125337A278a559f5337bcaace'; // Dirección del contrato donde queremos verificar el balance

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
      {balance !== null ? <p>{balance} $WGSA</p> : <p>Loading...</p>}
    </div>
  );
};

export default WGsaTokenBalanceTwo;
