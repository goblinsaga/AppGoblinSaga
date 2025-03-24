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
          <div style={{ display: "block" }} className="wallet" >
            <ConnectWallet
              theme={lightTheme({
                colors: {
                  modalBg: "#1b1221",
                  borderColor: "#1b1221",
                  separatorLine: "#4A0B67",
                  secondaryText: "#c4c4c4",
                  primaryText: "#ffffff",
                  connectedButtonBg: "#1b1221",
                  primaryButtonBg: "#1b1221",
                  primaryButtonText: "#ffffff",
                  secondaryButtonHoverBg: "#4A0B67",
                  connectedButtonBgHover: "#1b1221",
                  walletSelectorButtonHoverBg: "#4A0B67",
                  secondaryButtonText: "#ffffff",
                  secondaryButtonBg: "#4A0B67",
                },
              })}
              style={{
                width: "171px",
                height: "50px",
                pointerEvents: "auto",
                backgroundColor: "transparent",
                border: "none",
                borderRadius: "7px",
                border: "3px solid transparent",
                background: "linear-gradient(45deg, #1b1221, #1b1221) padding-box, linear-gradient(45deg, var(--mc1), var(--mc2), var(--mc1), var(--mc2)) border-box",
                backgroundClip: "padding-box, border-box",
                boxShadow: "0 4px 15px 2px rgba(142, 45, 226, 0.2)",
              }}
              hideBuyButton={true}
              hideSendButton={true}
              hideReceiveButton={true}
              modalTitle={"Goblin Saga"}
              switchToActiveChain={true}
              modalSize={"compact"}
              showThirdwebBranding={false}
              modalTitleIconUrl={"/img/favicon.ico"}
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
