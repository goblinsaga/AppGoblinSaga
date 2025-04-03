import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

// Dirección del contrato del token ERC-20
const tokenContractAddress = '0xfa68FB4628DFF1028CFEc22b4162FCcd0d45efb6';

// ABI del contrato ERC-20 (simplificado)
const erc20Abi = [
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "balance",
                "type": "uint256"
            }
        ],
        "type": "function"
    }
];

// Dirección del contrato inteligente del cual queremos obtener el balance
const smartContractAddress = '0x5A0b55E1dbD455d3973fA3A2B807AB156b91a9B7';

// Función para formatear números en miles (K) o millones (M) sin decimales
const formatNumber = (num) => {
    if (num >= 1_000_000) {
        return Math.round(num / 1_000_000); // Devuelve un número entero para millones
    }
    if (num >= 1_000) {
        return Math.round(num / 1_000); // Devuelve un número entero para miles
    }
    return Math.round(num); // Devuelve el número entero tal cual
};

const useStakedMATICX = () => {
    const [balance, setBalance] = useState<number | null>(null);

    useEffect(() => {
        const provider = new ethers.providers.JsonRpcProvider('https://polygon-mainnet.g.alchemy.com/v2/k2giPV8cSqnNo8IYCqbkonOpJKYyoaVR'); // Usando Polygon (Matic) RPC

        const fetchBalance = async () => {
            try {
                // Crear una instancia del contrato del token
                const tokenContract = new ethers.Contract(tokenContractAddress, erc20Abi, provider);

                // Obtener el balance del contrato inteligente
                const balance = await tokenContract.balanceOf(smartContractAddress);

                // Formatear el balance (asumiendo que el token tiene 18 decimales)
                const formattedBalance = ethers.utils.formatUnits(balance, 18);

                // Formatear el número para mostrarlo en miles (K) o millones (M) sin decimales
                const formattedNumber = formatNumber(parseFloat(formattedBalance));
                setBalance(formattedNumber); // Convertir a número entero
            } catch (error) {
                console.error('Error fetching token balance:', error);
                setBalance(null);
            }
        };

        fetchBalance();
    }, []);

    return balance;
};

export default useStakedMATICX;