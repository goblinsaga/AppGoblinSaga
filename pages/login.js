import { useEffect } from "react";
import { ConnectWallet, lightTheme, useAddress } from "@thirdweb-dev/react"; // Usamos ConnectWallet y useAddress
import { useRouter } from "next/router";
import Link from "next/link";

const Login = () => {
  const address = useAddress(); // Obtén la dirección de la billetera conectada
  const router = useRouter();

  // Redirige a la página principal si el usuario está conectado
  useEffect(() => {
    if (address) {
      router.push("/"); // Redirigir a la página principal
    }
  }, [address, router]);

  return (
    <div className="container" style={{ position: "relative", zIndex: 1 }}>
      {/* Contenedor principal con fondo traslúcido */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          textAlign: "center",
          top: 0,
          left: 0,
          width: "100%",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <img src="/img/LogoGS.webp" style={{ width: "350px" }} />
        </div>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <p>The Definitive NFT Mining App</p>
        </div>

        <div className="metaportal_fn_buttonLW" style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "auto", height: "auto", zIndex: 10, position: "relative", }}>
          <ConnectWallet
            termsOfServiceUrl="https://goblinsaga.xyz/terms-conditions"
            privacyPolicyUrl="https://goblinsaga.xyz/policy"
            theme={lightTheme({
              colors: {
                modalBg: "#150024",
                borderColor: "#150024",
                separatorLine: "#150024",
                secondaryText: "#c4c4c4",
                primaryText: "#ffffff",
                connectedButtonBg: "transparent",
                primaryButtonBg: "transparent",
                primaryButtonText: "#ffffff",
                secondaryButtonHoverBg: "#000b42",
                connectedButtonBgHover: "transparent",
                walletSelectorButtonHoverBg: "#000b42",
                secondaryButtonText: "#ffffff",
                secondaryButtonBg: "#000b42",
              },
            })}
            hideBuyButton={true}
            hideSendButton={true}
            hideReceiveButton={true}
            modalTitle={"Goblin Saga"}
            switchToActiveChain={true}
            modalSize={"compact"}
            showThirdwebBranding={false}
            modalTitleIconUrl={"/img/favicon.ico"}
            btnTitle="Connect Wallet"
            welcomeScreen={{
              title: "The Definitive NFT Mining App",
              subtitle:
                "Conquer the DeFi world through NFTs, mining, and rewards in an innovative universe on Polygon 💎",
              img: {
                src: "/img/LogoGS.png",
                width: 320,
              },
            }}
            style={{
              zIndex: 20,
            }}
          />
        </div>
      </div>

      <div style={{ paddingBottom: "5rem", marginTop: "-50px" }} className="container">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ height: "auto", width: "350px" }} className="blog__item">
            <div className="meta">
              <p>Sub-Menu</p>
            </div>
            <div className="read_more">
              <Link href="https://goblinsaga.xyz">
                <a>
                  <span>Home</span>
                </a>
              </Link>
            </div>
            <div className="read_more">
              <Link href="https://goblinsaga.xyz/mint">
                <a>
                  <span>NFT Mint</span>
                </a>
              </Link>
            </div>
            <div className="read_more">
              <Link href="https://goblinsaga.xyz/#roadmap">
                <a>
                  <span>Step Map</span>
                </a>
              </Link>
            </div>
            <div className="read_more">
              <Link href="https://docs.goblinsaga.xyz">
                <a>
                  <span>White Paper</span>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
