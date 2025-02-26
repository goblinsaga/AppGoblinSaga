import { useState } from "react";

const Faq = () => {
  const faqs1 = [
    {
      title: "Mint Phases",
      dec: "Supply control: By dividing the mining process into phases, the amount of NFTs available at each phase is controlled. This creates artificial scarcity and increases the value of NFTs among collectors and investors.",
    },
    {
      title: "NFT Rarities",
      dec: "The rarities of the NFTs are found in the metadata, ensuring that it is not lost in the NFT markets. Rarities range from 1 to 4444 and can vary according to the traits of the NFT piece, with the rarest being those with the lowest number in the rarity range.",
    },
    {
      title: "ERC-721",
      dec: "The NFTs are ERC-721, which means that they are 1/1 NFTs and that there are more copies of the same NFT as in the case of ERC-1155 NFTs, thus acquiring a higher value among collectors based on rarity ranks, as well as acquiring higher value as mining pieces for the $xGSA and $GSA token.",
    },
    {
      title: "Why Polygon Network?",
      dec: "Polygon's network is preferred for its lower transaction fees, greater scalability, Ethereum compatibility for easier NFT transfers, and a more energy-efficient proof-of-stake mechanism.",
    },
  ];
  const faqs2 = [
    {
      title: "Where is my NFT?",
      dec: "Mining with an NFT requires sending it to a smart contract, which locks it until withdrawal, ensuring your participation. You earn rewards in $xGSA tokens, managed by the contract, which may also control access to certain ecosystem benefits.",
    },
    {
      title: "Mint Phase 5?",
      dec: "Yes, there will be a 5th mining phase that will be exclusive for OG holders, where they will be able to mine their Goblins NFTs with $GSA.",
    },
    {
      title: "Season 2?",
      dec: "The second season is confirmed, where holders will be able to use mutation runes to acquire their NFTs for free.",
    },
  ];
  const [active, setActive] = useState(`0`);
  const faqMap = (arr, index) => {
    return arr.map((data, i) => (
      <div className="fn_cs_accordion" key={i}>
        <div className={`acc_item ${index + i === active ? "active" : ""}`}>
          <div
            className="acc_header"
            onClick={() =>
              setActive(`${index + i}` === active ? null : `${index + i}`)
            }
          >
            <h3 className="fn__maintitle" data-text={data.title}>
              {data.title}
            </h3>
            <span className="icon">
              <span />
            </span>
          </div>
          <div
            className="acc_content"
            style={{
              display: `${index + i === active ? "block" : "none"}`,
            }}
          >
            <p>{data.dec}</p>
          </div>
        </div>
      </div>
    ));
  };
  return (
    <section id="faq">
      <div className="container">
        <div className="fn_cs_faq">
          <div className="faq_col">
            <h3 className="fn__maintitle" data-text="FAQ">
              FAQ
            </h3>
            <div className="fn_cs_divider">
              <div className="divider">
                <span />
                <span />
              </div>
            </div>
            <div className="desc">
              <p>
                In this section you will find the most common questions about the project, if you have more doubts do not hesitate to contact us in our Discord Server.
              </p>
              <a>
                <img style={{ height: "80px" }} src="/img/LogoGS.png" alt="Goblin Saga" />
              </a>
            </div>
          </div>
          <div className="faq_col">
            <div className="fn_cs_accordion">{faqMap(faqs1, "a")}</div>
          </div>
          <div className="faq_col">
            <div className="fn_cs_accordion">{faqMap(faqs2, "b")}</div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Faq;
