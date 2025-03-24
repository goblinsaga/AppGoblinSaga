import Link from "next/link";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { navigationToggle, walletToggle } from "../redux/actions/siteSettings";
import { stickyNav } from "../utilits";
import { ConnectWallet, useAddress, useSigner, lightTheme, useDisconnect } from "@thirdweb-dev/react";

const Header = ({ walletToggle, navigationToggle }) => {
  const address = useAddress();
  const signer = useSigner();
  const disconnect = useDisconnect();
  const [hasSigned, setHasSigned] = useState(false);

  useEffect(() => {
    stickyNav();
  }, []);

  const requestSignature = async () => {
    if (signer && address) {
      const message = `By signing this message, you agree to the Terms and Conditions of Goblin Saga.`;
      try {
        const signature = await signer.signMessage(message);
        console.log("Signature:", signature);
        console.log("Address:", address);
        setHasSigned(true);

        // Guarda la firma o marca como firmado en localStorage
        localStorage.setItem(`signed_${address}`, "true");
      } catch (error) {
        console.error("User declined to sign the message.", error);
        setHasSigned(false);
        disconnect(); // Desconectar la billetera si el usuario no firma
      }
    }
  };

  useEffect(() => {
    if (address) {
      const alreadySigned = localStorage.getItem(`signed_${address}`) === "true";
      setHasSigned(alreadySigned);

      if (!alreadySigned) {
        requestSignature();
      }
    }
  }, [address]);

  return (
    <header id="header">
      <div className="header">
        <div className="header_in">
          <div className="trigger_logo">
            <div className="logo">
              <Link href="/">
                <a>
                  <img style={{ height: "50px" }} src="/img/Logo_type2.png" alt="" />
                </a>
              </Link>
            </div>
          </div>
          <div className="nav" style={{ opacity: 1 }}>
            <ul>
              <li>
                <Link href="https://goblinsaga.xyz/#home">
                  <a className="creative_link">Home</a>
                </Link>
              </li>
              <li>
                <Link href="https://goblinsaga.xyz/#about">
                  <a className="creative_link">About</a>
                </Link>
              </li>
              <li>
                <Link href="https://app.goblinsaga.xyz/task-center">
                  <a className="creative_link">Task Center</a>
                </Link>
              </li>
              <li>
                <Link href="https://goblinsaga.xyz/#apps">
                  <a className="creative_link">Apps</a>
                </Link>
              </li>
              <li>
                <Link href="https://goblinsaga.xyz/#roadmap">
                  <a className="creative_link">Step Map</a>
                </Link>
              </li>
              <li>
                <Link href="https://goblinsaga.xyz/mint">
                  <a className="creative_link">NFT Mint</a>
                </Link>
              </li>
              <li>
                <Link href="https://goblinsaga.xyz/token">
                  <a className="creative_link">Token Sale</a>
                </Link>
              </li>
            </ul>
          </div>
          <div style={{ display: "block" }} className="wallet">
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
              style={{
                width: "190px",
                height: "55px",
                pointerEvents: "auto",
                backgroundColor: "transparent",
                border: "none",
                borderRadius: "7px",
                border: "3px solid transparent",
                background: "linear-gradient(45deg, #1b1221, #1b1221) padding-box, linear-gradient(45deg, var(--mc1), var(--mc2), var(--mc1), var(--mc2)) border-box",
                backgroundClip: "padding-box, border-box",
                boxShadow: "0 4px 20px 2px rgba(142, 45, 226, 0.2)",
              }}
              hideBuyButton={true}
              hideSendButton={true}
              hideReceiveButton={true}
              modalTitle={"Goblin Saga"}
              switchToActiveChain={true}
              modalSize={"compact"}
              showThirdwebBranding={false}
              modalTitleIconUrl={"/img/favicon.ico"}
              welcomeScreen={{
                title: "The Definitive NFT Mining App",
                subtitle: "Conquer the DeFi world through NFTs, mining, and rewards in an innovative universe on Polygon 💎",
                img: {
                  src: "/img/LogoGS.png",
                  width: 320,
                },
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { walletToggle, navigationToggle })(Header);
