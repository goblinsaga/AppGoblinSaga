import Link from "next/link";
import CombinedRewards from "./UserStats/TTRewards";
import UserBalance from "./UserStats/UserBalance";
import ClaimxGSA from "./OptionButtons/ClaimxGSA";
import BusinessButton from "./OptionButtons/BussinessButton";
import BoxButton from "./OptionButtons/BoxButton";
import UnstakeAllNFT from "./OptionButtons/UnstakeAllNFT";
import GoblinsMiningCount from "./GoblinsMiningCount";
import NFTCardOG from "./Badges/OGHolder";
import EmperorCheck from "./Badges/EmperorRank"
import { useState, useEffect } from "react";
import KingCheck from "./Badges/KingRank";
import MonarchCheck from "./Badges/MonarchRank";
import LordCheck from "./Badges/LordRank";
import WizardCheck from "./Badges/WizardRank";
import WarriorCheck from "./Badges/WarriorRank";
import NFTCardHighRank from "./Badges/HighRank";
import PolygonGasPrice from "./PolygonGasPrice";
import NewUsers from "./NewUsers";
import UnstakeAllBox from "./OptionButtons/UnstakeAllBox";
import StakeAllBox from "./OptionButtons/StakeALLBox";
import UnstakeAllMines from "./OptionButtons/UnstakeAllMines";
import StakeAllMines from "./OptionButtons/StakeAllMines";
import StakeUnstakeNFTs from "./StakeUnstake";
import TaskCenterApp from "./TaskCenter";
import ZeusCheck from "./Badges/ZeusHelper";
import ZeusCenterApp from "./ZeusHelpBanner";

const MinerStats = () => {
  const [isVerified, setIsVerified] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const handleVerificationStatus = (isVerified, loading) => {
    setIsVerified(isVerified);
    setLoading(loading);
  };

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const badgeStyle = {
    transform: isMobile ? 'scale(0.8)' : 'scale(1)',
    transition: 'transform 0.3s ease'
  };

  return (
    <section style={{ marginTop: "-100px", marginBottom: "150px" }} className="section">
      <div className="container" style={{ paddingBottom: "30px" }}>
        <ZeusCenterApp />
      </div>
      <div id="apps" className="container">
        {/* News Shotcode */}
        <div className="blog__item">
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <GoblinsMiningCount />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap", // Para asegurar que los elementos se ajusten bien en pantalla pequeña.
            }}
          >
            <div
              style={{
                width: "auto",
                height: "auto",
                flex: "1 1 auto", // Permite que los elementos se adapten.
              }}
              className="blog__item"
            >
              <div className="counter">
                <span className="cc">
                  <img style={{ marginTop: "-3px" }} src="/img/GSAV2.png" alt="" />
                </span>
              </div>
              <div className="meta">
                <p>$GSA Incoming</p>
              </div>
              <div className="title">
                <h5><CombinedRewards /></h5>
              </div>
            </div>
            <div
              style={{
                width: "auto",
                height: "auto",
                flex: "1 1 auto",
              }}
              className="blog__item"
            >
              <div className="counter">
                <span className="cc">
                  <img style={{ marginTop: "-3px" }} src="/img/GSAV2.png" alt="" />
                </span>
              </div>
              <div className="meta">
                <p>$GSA Balance</p>
              </div>
              <div className="title">
                <h5><UserBalance /></h5>
              </div>
            </div>
            <div>
              <p style={{ textAlign: "center", paddingTop: "2rem" }}>My Badges</p>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                maxWidth: isMobile ? '100%' : '900px',
                margin: '0 auto'
              }}>
                {[
                  <NFTCardHighRank />,
                  <NFTCardOG />,
                  <EmperorCheck onVerificationStatus={handleVerificationStatus} />,
                  <KingCheck onVerificationStatus={handleVerificationStatus} />,
                  <MonarchCheck onVerificationStatus={handleVerificationStatus} />,
                  <LordCheck onVerificationStatus={handleVerificationStatus} />,
                  <WizardCheck onVerificationStatus={handleVerificationStatus} />,
                  <WarriorCheck onVerificationStatus={handleVerificationStatus} />
                ].map((BadgeComponent, index) => (
                  <div
                    key={index}
                    style={{
                      ...badgeStyle,
                      width: isMobile ? '25%' : 'auto',
                      boxSizing: 'border-box',
                      padding: isMobile ? '1px' : '5px',
                      display: 'flex',
                      justifyContent: 'center',
                      transition: 'transform 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      const target = e.currentTarget;
                      target.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      const target = e.currentTarget;
                      target.style.transform = 'scale(1)';
                    }}
                  >
                    {BadgeComponent}
                  </div>
                ))}
              </div>
              
              <p style={{ textAlign: "center", paddingTop: "2rem" }}>Special Badges</p>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                maxWidth: isMobile ? '100%' : '900px',
                margin: '0 auto'
              }}>
                {[
                  <ZeusCheck onVerificationStatus={handleVerificationStatus} />,
                ].map((BadgeComponent, index) => (
                  <div
                    key={index}
                    style={{
                      ...badgeStyle,
                      width: isMobile ? '25%' : 'auto',
                      boxSizing: 'border-box',
                      padding: isMobile ? '1px' : '5px',
                      display: 'flex',
                      justifyContent: 'center',
                      transition: 'transform 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      const target = e.currentTarget;
                      target.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      const target = e.currentTarget;
                      target.style.transform = 'scale(1)';
                    }}
                  >
                    {BadgeComponent}
                  </div>
                ))}
              </div>
              <div style={{ paddingTop: "2rem" }} className="containerGrid">
                <ClaimxGSA />
                <BusinessButton />
                <BoxButton />
              </div>
              <div style={{ paddingBottom: "1rem" }}>
                <PolygonGasPrice />
              </div>
            </div>
          </div>
          <div style={{ height: "235px" }} className="blog__item">
            <div className="meta">
              <p>Menu App</p>
            </div>
            <div className="read_more">
              <Link href="/shop">
                <a>
                  <span>Item Shop</span>
                </a>
              </Link>
            </div>
            <div className="read_more">
              <Link href="/defi#token-swap">
                <a>
                  <span>Token Swap</span>
                </a>
              </Link>
            </div>
            <div className="read_more">
              <Link href="/defi#stake">
                <a>
                  <span>Token Stake</span>
                </a>
              </Link>
            </div>
            <div className="read_more">
              <Link href="/defi#restake">
                <a>
                  <span>Token Restake</span>
                </a>
              </Link>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: "30px", marginTop: "30px" }}>
          <NewUsers />
        </div>

        <div id="migration" className="blog__item" style={{ height: "auto" }}>
          <p style={{ textAlign: "center" }}>Migrate Goblins to V2</p>
          <p style={{ textAlign: "center", fontSize: "12px" }}>(If you are new user just click on Mine)</p>
          <div style={{ marginTop: "30px" }} className="right_bot">
            <UnstakeAllNFT />
          </div>
          <div style={{ marginTop: "30px" }} className="left_bot">
            <StakeUnstakeNFTs />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            paddingBottom: "2rem",
            flexWrap: "wrap",
            marginTop: "30px",
          }}
        >
          <div
            style={{
              width: "260px",
              flex: "1 1 auto",
            }}
            className="blog__item"
          >
            <p style={{ textAlign: "center" }}>Migrate Items to V2</p>
            <p style={{ textAlign: "center", fontSize: "11px" }}>(Only Old Users)</p>
            <div className="containerGrid">
              <UnstakeAllMines />
              <StakeAllMines />
            </div>
            <p style={{ textAlign: "center", fontSize: "11px", marginTop: "10px" }}>If you have problems using Mine Button use Set Mine option on <a href="/shop" style={{ color: "green" }}>Shop</a></p>
          </div>
          <div
            style={{
              width: "260px",
              flex: "1 1 auto",
            }}
            className="blog__item"
          >
            <p style={{ textAlign: "center" }}>Migrate S. Items to V2</p>
            <p style={{ textAlign: "center", fontSize: "11px" }}>(Only Old Users)</p>
            <div className="containerGrid">
              <UnstakeAllBox />
              <StakeAllBox />
            </div>
            <p style={{ textAlign: "center", fontSize: "11px", marginTop: "10px" }}>If you have problems using Mine Button use Set Mine option on <a href="/shop" style={{ color: "green" }}>Shop</a></p>
          </div>
        </div>
        {/* !News Shotcode */}
        <div>
          <TaskCenterApp />
        </div>
      </div>
    </section>
  );
};

export default MinerStats;
