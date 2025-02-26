import { useEffect, useState } from "react";
import axios from "axios";

const MATIC_PRICE_API =
    "https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd";
const GSA_PRICE_API =
    "https://api.geckoterminal.com/api/v2/networks/polygon_pos/pools/0xf307d80857f08becc90404fca6be332395169ea7";

const APRCalculator = () => {
    const [maticPrice, setMaticPrice] = useState<number | null>(null);
    const [gsaPrice, setGsaPrice] = useState<number | null>(null);
    const [apr, setAPR] = useState<number | null>(null);

    const formatPrice = (price: number | null) => {
        if (!price) return "Loading...";

        // Convertir el precio a string con 11 decimales
        const priceStr = parseFloat(price.toString()).toFixed(9).toString();

        // Separar la parte entera de la decimal
        const [integerPart, decimalPart] = priceStr.split(".");

        // Contar los ceros consecutivos al inicio de la parte decimal
        const zeros = decimalPart.match(/^0+/);
        const zerosCount = zeros ? zeros[0].length : 0;

        // Resto de los números después de los ceros
        const remainingNumbers = decimalPart.slice(zerosCount);

        // Construir el formato: cantidad de ceros en pequeño alineado correctamente y desplazado 5px hacia abajo
        return `${integerPart}.0<span style="font-size: 0.7em; line-height: 1; display: inline-block; position: relative; top: 5px;">${zerosCount}</span>${remainingNumbers}`;
    };

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                // Obtener precio de MATIC desde CoinGecko
                const maticResponse = await axios.get(MATIC_PRICE_API);
                const matic = maticResponse.data?.["matic-network"]?.usd;

                // Validar si el precio de MATIC es correcto
                if (!matic || isNaN(matic)) {
                    console.error("Error: Precio de MATIC inválido.");
                    return;
                }

                // Obtener precio de GSA desde GeckoTerminal
                const gsaResponse = await axios.get(GSA_PRICE_API);

                // Cambiar a base_token_price_usd
                const gsa = parseFloat(
                    gsaResponse.data?.data?.attributes?.base_token_price_usd
                );

                // Verificar si el valor del GSA es correcto
                if (!gsa || isNaN(gsa)) {
                    console.error("Error: Precio de GSA inválido.");
                    return;
                }

                setMaticPrice(matic);
                setGsaPrice(gsa);

                // Cálculo del APR
                const gsaPerDay = (1000 * 24) / 48; // 1000 GSA cada 48 horas
                const gsaPerYear = gsaPerDay * 365;
                const earningsUSD = gsaPerYear * gsa;
                const aprValue = (earningsUSD / matic) * 100;

                setAPR(aprValue);
            } catch (error) {
                console.error("Error al obtener precios:", error.message);
            }
        };

        fetchPrices();
        const interval = setInterval(fetchPrices, 1000 * 60); // Se actualiza cada 60 segundos
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            {maticPrice !== null && gsaPrice !== null ? (
                <>
                    <p style={{ color: "yellow" }} className="text-lg font-bold">
                        APR: {apr !== null ? `${apr.toFixed(2)}%` : "Loading..."}
                    </p>
                    <p>1 $POL = 1000 $GSA/48H</p>
                </>
            ) : (
                <p className="text-sm">Loading...</p>
            )}
        </div>
    );
};

export default APRCalculator;
