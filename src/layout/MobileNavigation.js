import Link from "next/link";
import { Fragment, useState } from "react";
import { connect } from "react-redux";
import { navigationToggle, walletToggle } from "../redux/actions/siteSettings";
import { ConnectWallet, lightTheme } from "@thirdweb-dev/react";
const MobileNavigation = ({ walletToggle, navigationToggle }) => {
  const [toggle, setToggle] = useState(false);
  return (
    <Fragment>
      <div className="metaportal_fn_mobnav">
        <div className="mob_top">
          <div className="social_trigger">
            <div className="social">
              <ul>
                <li>
                  <a
                    href="https://www.x.com/goblinsaga_xyz"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Tw.
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div style={{ display: "block", width: "190px", height: "55px", zIndex: 10, position: "relative" }} className="metaportal_fn_buttonLW">
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
              btnTitle="Log In"
              welcomeScreen={{
                title: "The Definitive NFT Mining App",
                subtitle: "Conquer the DeFi world through NFTs, mining, and rewards in an innovative universe on Polygon 💎",
                img: {
                  src: "/img/LogoGS.png",
                  width: 320,
                },
              }}
              style={{
                zIndex: 20,
                width: "190px",
                height: "55px",
              }}
            />
          </div>
        </div>
        <div className="mob_mid">
          <div className="logo">
            <Link href="/">
              <a>
                <img style={{ height: "70px" }} src="/img/Logo_type2.png" alt="" />
              </a>
            </Link>
          </div>
          <div
            className={`trigger ${toggle ? "active" : ""}`}
            onClick={() => setToggle(!toggle)}
          >
            <span />
          </div>
        </div>
        <div className="mob_bot" style={{ display: toggle ? "block" : "none" }}>
          <ul>
            <li>
              <a className="creative_link" href="https://goblinsaga.xyz/#home">
                Home
              </a>
            </li>
            <li>
              <a className="creative_link" href="https://goblinsaga.xyz/#about">
                About
              </a>
            </li>
            <li>
              <a className="creative_link" href="https://app.goblinsaga.xyz/task-center">
                Task Center
              </a>
            </li>
            <li>
              <a className="creative_link" href="https://goblinsaga.xyz/#apps">
                Apps
              </a>
            </li>
            <li>
              <a className="creative_link" href="https://goblinsaga.xyz/#roadmap">
                Step Map
              </a>
            </li>
            <li>
              <Link href="https://goblinsaga.xyz/mint">
                <a className="creative_link">Mint</a>
              </Link>
            </li>
            <li>
              <Link href="https://goblinsaga.xyz/token">
                <a className="creative_link">Token</a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  navigation: state.site.navigation,
});

export default connect(mapStateToProps, { walletToggle, navigationToggle })(
  MobileNavigation
);
