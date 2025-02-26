import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAddress } from "@thirdweb-dev/react";

const NFTCardHighRank = () => {
  const address = useAddress(); // Obtener la dirección de la billetera
  const [isHolder, setIsHolder] = useState(null); // Estado para verificar si es holder

  const nftContractAddress = "0x3AbEc11f132e055a766A8e92eE1EBF9aBFF42e08"; // Reemplaza con la dirección del contrato High Rank
  const alchemyUrl = "https://polygon-mainnet.g.alchemy.com/v2/k2giPV8cSqnNo8IYCqbkonOpJKYyoaVR"; // Reemplaza con tu API Key de Alchemy

  useEffect(() => {
    const checkHolderStatus = async () => {
      if (address) {
        try {
          // Usar Alchemy como proveedor
          const provider = new ethers.providers.JsonRpcProvider(alchemyUrl);

          // Crear un contrato ERC-1155 (Edition Drop)
          const contract = new ethers.Contract(
            nftContractAddress,
            ["function balanceOf(address owner, uint256 id) view returns (uint256)"], // Llamada para verificar la cantidad de NFTs
            provider
          );

          // Verificar el balance del NFT (usando el tokenId 0 como ejemplo)
          const tokenId = 0; // Reemplaza con el tokenId correcto
          const balance = await contract.balanceOf(address, tokenId);

          // Verificar si tiene al menos un NFT
          setIsHolder(balance.gt(0)); // Si el balance es mayor que 0, es holder
        } catch (error) {
          console.error("Error al verificar el estado del holder:", error);
          setIsHolder(false);
        }
      }
    };

    checkHolderStatus();
  }, [address]);

  if (!address) {
    return null;
  }

  return (
    <div
      style={{
        border: "1px solid grey",
        width: "100px",
        height: "100px",
        borderRadius: "5px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {isHolder === true ? ( // Si es holder
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <a
              href="https://docs.goblinsaga.xyz/ecosystem-overview/high-rank-goblin"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/img/HIGH-RANK-GOBLIN.png"
                alt="High-Rank Goblin"
                style={{
                  width: "65px",
                  height: "auto",
                  cursor: "pointer",
                  borderRadius: "50%",
                }}
              />
            </a>
            <p
              style={{
                fontSize: "12px",
                margin: "5px 0 0 0",
                textAlign: "center",
              }}
            >
              Elite H.R.
            </p>
          </div>
        </>
      ) : isHolder === false ? ( // Si no es holder
        <a
          href="https://docs.goblinsaga.xyz/ecosystem-overview/high-rank-goblin"
          target="_blank"
          rel="noopener noreferrer"
        >
          <p
            style={{
              fontSize: "12px",
              margin: "5px 0 0 0",
              cursor: "pointer",
            }}
          >
            Not Elite Member
          </p>
        </a>
      ) : null}
    </div>
  );
};

export default NFTCardHighRank;