import "../styles/globals.css";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
require("@solana/wallet-adapter-react-ui/styles.css");

const WalletConnectionProvier = dynamic(
  () => import("../context/WalletConnectionProvider"),
  { ssr: false }
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WalletConnectionProvier>
      <Component {...pageProps} />
    </WalletConnectionProvier>
  );
}

export default MyApp;
