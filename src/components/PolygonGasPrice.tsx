import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

const PolygonGasPrice: React.FC = () => {
  const [gasPrice, setGasPrice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGasPrice() {
      try {
        // Crear el proveedor JSON-RPC para la red Polygon
        const provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com");

        // Obtener el precio del gas en la red Polygon
        const price = await provider.getGasPrice();

        // Convertir el precio del gas de Wei a Gwei
        const gasPriceInGwei = ethers.utils.formatUnits(price, "gwei");

        // Redondear el precio del gas a un número entero
        const roundedGasPrice = Math.floor(parseFloat(gasPriceInGwei));

        setGasPrice(roundedGasPrice.toString());
      } catch (err) {
        console.error("Error:", err);
        setError("Error.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchGasPrice();

    // Establecer un intervalo para actualizar cada 30 segundos
    const interval = setInterval(fetchGasPrice, 30000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, []);

  // Determinar el color basado en el rango de gasPrice
  const getColor = (gasPrice: number) => {
    if (gasPrice >= 20 && gasPrice <= 45) return "green";
    if (gasPrice >= 46 && gasPrice <= 100) return "orange";
    if (gasPrice >= 101 && gasPrice <= 600) return "red";
    return "black"; // Para valores fuera de estos rangos
  };

  return (
    <div style={{ textAlign: "center", marginTop: "10px" }}>
      {isLoading ? (
        <p>Loading gas...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <p>
          Gas Tracker:{" "}
          <span style={{ color: getColor(parseInt(gasPrice || "0")) }}>
            {gasPrice} Gwei
          </span>
        </p>
      )}
    </div>
  );
};

export default PolygonGasPrice;