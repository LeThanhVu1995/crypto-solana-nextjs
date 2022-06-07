import React from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolletWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { useMemo } from "react";
import { SOLANA_HOST } from "../utils/const";

const WalletConnectionProvider = ({ children }) => {
  const endpoint = useMemo(() => SOLANA_HOST, []);

  const wallets = useMemo(() => {
    return [new PhantomWalletAdapter(), new SolletWalletAdapter()];
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletConnectionProvider;
