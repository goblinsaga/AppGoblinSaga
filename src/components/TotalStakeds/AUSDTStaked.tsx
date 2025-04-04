import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

// Dirección del contrato del token ERC-20
const tokenContractAddress = '0x6ab707Aca953eDAeFBc4fD23bA73294241490620';

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
const smartContractAddress = '0x124026f834b208595b54a19a94cf10f55568bb55';

// Función para formatear números en miles (K) o millones (M) sin decimales
const formatNumber = (num) => {
    if (num >= 1_000_000) {
        return (num / 1_000_000).toFixed(0) + 'M';
    }
    if (num >= 1_000) {
        return (num / 1_000).toFixed(0) + 'K';
    }
    return num.toString();
};

const useStakedUSDT = () => {
    const [balance, setBalance] = useState<string | null>(null);

    useEffect(() => {
        const provider = new ethers.providers.JsonRpcProvider('https://polygon-mainnet.g.alchemy.com/v2/k2giPV8cSqnNo8IYCqbkonOpJKYyoaVR');

        const fetchBalance = async () => {
            try {
                // Crear una instancia del contrato del token
                const tokenContract = new ethers.Contract(tokenContractAddress, erc20Abi, provider);

                // Obtener el balance del contrato inteligente
                const balance = await tokenContract.balanceOf(smartContractAddress);

                // Formatear el balance (USDT tiene 6 decimales)
                const formattedBalance = ethers.utils.formatUnits(balance, 6);
                const balanceNumber = parseFloat(formattedBalance);

                // Verificar si el balance es muy pequeño (menor a 1)
                if (balanceNumber < 1) {
                    setBalance('0');
                } else {
                    // Formatear el número para mostrarlo
                    const formattedNumber = formatNumber(balanceNumber);
                    setBalance(formattedNumber);
                }
            } catch (error) {
                console.error('Error fetching token balance:', error);
                setBalance(null);
            }
        };

        fetchBalance();
    }, []);

    return balance;
};

export default useStakedUSDT;
