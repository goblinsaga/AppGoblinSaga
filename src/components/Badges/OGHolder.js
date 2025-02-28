import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAddress } from "@thirdweb-dev/react";

const NFTCardOG = () => {
  const [isHolder, setIsHolder] = useState(null);
  const address = useAddress();

  const nftContractAddress = "0xf01190f77A2BE543674329F24E39e67B2C9804A1"; 
  const alchemyUrl = "https://polygon-mainnet.g.alchemy.com/v2/Rwyo0npJ8fyyLQQQ5vFlH9K3yva_adGb";

  useEffect(() => {
    const checkHolderStatus = async () => {
      if (address) {
        try {
          // Usar Alchemy como proveedor
          const provider = new ethers.providers.JsonRpcProvider(alchemyUrl);

          // Crear un contrato ERC-721
          const contract = new ethers.Contract(
            nftContractAddress,
            ["function balanceOf(address owner) view returns (uint256)"], // Llamada para verificar la cantidad de NFTs
            provider
          );

          // Consultar el balance de NFTs en la billetera
          const balance = await contract.balanceOf(address);

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
    return <p>Nothing to see here.</p>;
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
      {isHolder === true ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <a href="https://launchpad.heymint.xyz/mint/og-goblinsaga" target="_blank" rel="noopener noreferrer">
            <img
              src="/img/OG-HOLDER.png"
              alt="OG Holder"
              style={{ width: "65px", height: "auto", cursor: "pointer" }}
            />
          </a>
          <p style={{ fontSize: "12px", margin: "5px 0 0 0", textAlign: "center" }}>OG Hold</p>
        </div>
      ) : isHolder === false ? (
        <a href="https://launchpad.heymint.xyz/mint/og-goblinsaga" target="_blank" rel="noopener noreferrer">
          <p style={{ fontSize: "12px", margin: "5px 0 0 0", cursor: "pointer" }}>
            Not OG - Claim now
          </p>
        </a>
      ) : null}
    </div>
  );
};

export default NFTCardOG;
