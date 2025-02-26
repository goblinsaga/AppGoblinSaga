import { useEffect, useState } from "react";
import axios from "axios";

const APRCalculatorTwo = () => {
  const [apr, setAPR] = useState<number | null>(null);

  useEffect(() => {
    const calculateAPR = () => {
      try {
        // Ratio conocido: 1,000,000 GSA = 500 xGSA cada 48 horas
        const xgsaPer48Hours = 500; // 500 xGSA cada 48 horas para 1,000,000 GSA
        const xgsaPerDay = xgsaPer48Hours / 2; // Ganancia diaria en xGSA
        const xgsaPerYear = xgsaPerDay * 365; // Ganancia anual en xGSA

        // Cálculo del APR
        const aprValue = (xgsaPerYear / 1000000) * 100; // Basado en 1,000,000 GSA invertidos

        setAPR(aprValue);
      } catch (error) {
        console.error("Error al calcular el APR:", error.message);
      }
    };

    calculateAPR();
  }, []);

  return (
    <div>
      {apr !== null ? (
        <>
          <p style={{ color: "yellow" }} className="text-lg font-bold">
            APR: {apr.toFixed(2)}%
          </p>
          <p>1,000,000 GSA = 500 xGSA/48H</p>
        </>
      ) : (
        <p className="text-sm">Loading...</p>
      )}
    </div>
  );
};

export default APRCalculatorTwo;