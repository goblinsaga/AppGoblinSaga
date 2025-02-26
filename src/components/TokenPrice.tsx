import { useEffect, useState } from 'react';
import axios from 'axios';

const TokenPrice = () => {
    const [tokenPriceUSD, setTokenPriceUSD] = useState(null);

    useEffect(() => {
        const fetchTokenPrice = async () => {
            try {
                const response = await axios.get(
                    'https://api.geckoterminal.com/api/v2/networks/polygon_pos/pools/0xf307d80857f08becc90404fca6be332395169ea7'
                );
                setTokenPriceUSD(response.data.data.attributes.base_token_price_usd);
            } catch (error) {
                console.error('Error al obtener el precio del token:', error.message);
            }
        };

        fetchTokenPrice();
        const interval = setInterval(fetchTokenPrice, 1000 * 60 * 60);
        return () => clearInterval(interval);
    }, []);

    const formatPrice = (price) => {
        if (!price) return 'Loading...';

        // Convertir el precio a string con 11 decimales
        const priceStr = parseFloat(price).toFixed(10).toString();

        // Separar la parte entera de la decimal
        const [integerPart, decimalPart] = priceStr.split('.');

        // Contar los ceros consecutivos al inicio de la parte decimal
        const zeros = decimalPart.match(/^0+/);
        const zerosCount = zeros ? zeros[0].length : 0;

        // Resto de los números después de los ceros
        const remainingNumbers = decimalPart.slice(zerosCount);

        // Construir el formato: cantidad de ceros en pequeño alineado correctamente y desplazado 5px hacia abajo
        return `${integerPart}.0<span style="font-size: 0.7em; line-height: 1; display: inline-block; position: relative; top: 5px;">${zerosCount}</span>${remainingNumbers}`;
    };

    return (
        <div>
            <p style={{ margin: "0" }}>
                $
                {tokenPriceUSD !== null ? (
                    <span dangerouslySetInnerHTML={{ __html: formatPrice(tokenPriceUSD) }} />
                ) : (
                    'Loading...'
                )}{' '}
            </p>
        </div>
    );
};
export default TokenPrice;
