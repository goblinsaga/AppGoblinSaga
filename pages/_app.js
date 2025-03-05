import { ThirdwebProvider, metamaskWallet, walletConnect, okxWallet, coinbaseWallet, trustWallet, useAddress } from "@thirdweb-dev/react";
import { Polygon } from "@thirdweb-dev/chains";
import Head from "next/head";
import { Provider } from "react-redux";
import store from "../src/redux/store";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <ThirdwebProvider
        autoConnect={true}
        activeChain={Polygon}
        supportedChains={[Polygon]}
        supportedWallets={[
          metamaskWallet(),
          coinbaseWallet(),
          trustWallet(),
        ]}
        clientId={process.env.NEXT_PUBLIC_CLIENT_ID}
      >
        <Head>
          <title>Mining App</title>
          <link rel="icon" href="img/favicon.ico" />
          <link
            href="https://db.onlinewebfonts.com/c/b77483504f720bf0ce1d3f83f694ea52?family=Pexico-Regular"
            rel="stylesheet"
          />
          {/* Styles */}
          <link
            type="text/css"
            rel="stylesheet"
            href="/css/plugins.css?ver=4.1"
          />
          <link type="text/css" rel="stylesheet" href="/css/style.css?ver=4.1" />
          <meta
          name="description"
          content="Goblin Saga's official NFT Mining App. Join now to DeFi world with Goblin Saga NFTs."
          />
          <meta
            name="keywords"
            content="NFT, Pixel Art, Mining, Token Mining, Idle Game, Web3 Game"
          />

          {/* Open Graph (Facebook, LinkedIn, etc.) */}
          <meta property="og:title" content="Goblin Saga" />
          <meta
            property="og:description"
            content="Goblin Saga's official NFT Mining App. Join now to DeFi world with Goblin Saga NFTs."
          />
          <meta property="og:image" content="/img/MLGSA.png" />
          <meta property="og:url" content="https://app.goblinsaga.xyz" />
          <meta property="og:type" content="website" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Goblin Saga" />
          <meta
            name="twitter:description"
            content="Goblin Saga's official NFT Mining App. Join now to DeFi world with Goblin Saga NFTs."
          />
          <meta name="twitter:image" content="/img/MLGSA.png" />
        </Head>
        <BlockedWalletChecker>
          <Component {...pageProps} />
        </BlockedWalletChecker>
      </ThirdwebProvider>
    </Provider>
  );
}

function BlockedWalletChecker({ children }) {
  const address = useAddress();

  // Cadena de direcciones bloqueadas separadas por comas
  const blockedAddressesString = "0x587c6a42D33629a8Da9Cd98b90cAe8c914440f2A, 0x5cad1edf6bbf8baa75d384f8c2b3b38b7107ec80";

  // Convertir la cadena en un array de direcciones
  const blockedAddresses = blockedAddressesString
    .split(",") // Separa la cadena por comas
    .map(addr => addr.trim().toLowerCase()); // Elimina espacios y convierte a minúsculas

  // Verifica si la dirección conectada está en la lista de direcciones bloqueadas
  if (address && blockedAddresses.includes(address.toLowerCase())) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="blog__item">
          <p style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'red', fontSize: '20px' }}>YOUR ACCOUNT HAS BEEN BLOCKED</p>
          <p style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '18px' }}>REASON: Suspicious activity or unallowable transactions.</p>
          <p style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px', textAlign: "center" }}>We hope you understand, we want to protect our community holder's investment. If you think this is a mistake please contact Discord support.</p>
          <div>
            <p style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px' }}>Learn more about this</p>
            <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px' }}><a href="https://docs.goblinsaga.xyz/ecosystem-overview/protection-and-measures">Market Protection and Stability Measures</a></span>
          </div>
        </div>
      </div>
    );
  }

  return children;
}

export default MyApp;
