import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Payment from "../components/Payment";

const Login = () => {
  const wallet = useWallet();

  if (wallet.connected) {
    return <Payment />;
  }

  return (
    <div className="flex flex-col gap-5 justify-center items-center w-screen h-screen">
      <p className="text-4xl text-purple-400">Login to access this app</p>
      <WalletMultiButton />
    </div>
  );
};

export default Login;
