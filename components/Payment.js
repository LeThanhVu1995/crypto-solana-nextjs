import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, Transaction } from "@solana/web3.js";
import Image from "next/image";
import { useEffect, useState } from "react";
import { SOLANA_HOST } from "../utils/const";
import { getProgramInstance } from "../utils/utils";
import v1 from "./../assets/v1.png";
import v2 from "./../assets/v2.png";
import v3 from "./../assets/v3.png";

const anchor = require("@project-serum/anchor");

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { web3 } = anchor;
const { SystemProgram } = web3;
const utf8 = anchor.utils.bytes.utf8;

const defaultAccount = {
  tokenProgram: TOKEN_PROGRAM_ID,
  clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
  systemProgram: SystemProgram.programId,
};

const convertFromUsdToSol = (usd) => {
  return usd / 42;
};

const generateData = () => {
  return [
    {
      title: "Voucher1",
      price: randomPriceUSD(),
      image: v1,
    },
    {
      title: "Voucher2",
      price: randomPriceUSD(),
      image: v2,
    },
    {
      title: "Voucher3",
      price: randomPriceUSD(),
      image: v3,
    },
    {
      title: "Voucher4",
      price: randomPriceUSD(),
      image: v1,
    },
    {
      title: "Voucher3",
      price: randomPriceUSD(),
      image: v3,
    },
    {
      title: "Voucher4",
      price: randomPriceUSD(),
      image: v1,
    },
  ];
};

const randomPriceUSD = () => {
  return Math.floor(Math.random() * 300) + 1;
};

const styles = {
  main: `w-screen h-screen bg-white text-black`,
  button: `bg-[#22C55E] m-3 text-white font-bold py-4 px-20 rounded-full hover:opacity-70 transition`,
  text: "text-4xl mb-10",
  buttons: `flex items-center`,
};

const makeSolCrypto = (numberSol) => {
  return numberSol * 1000000000;
};

const Payment = () => {
  const wallet = useWallet();
  const connection = new anchor.web3.Connection(SOLANA_HOST);
  const program = getProgramInstance(connection, wallet);
  const [balance, setBalance] = useState("0");
  const [desBalance, setDesBalance] = useState("0");

  useEffect(() => {
    const getBalance = async () => {
      const balance = await connection.getBalance(
        wallet.publicKey,
        "processed"
      );

      const desBalance = await connection.getBalance(
        new PublicKey("ArJtcwfSYjS6aBQqJaHQkVCBmT35v5igXpNq9x6928DG"),
        "processed"
      );
      setDesBalance((desBalance / LAMPORTS_PER_SOL).toFixed(3));
      setBalance((balance / LAMPORTS_PER_SOL).toFixed(3));
    };

    const subscriptionAccountChange = connection.onAccountChange(
      wallet.publicKey,
      (a, b, c) => {
        getBalance();
      },
      "processed"
    );

    getBalance();

    return () => {
      connection.removeAccountChangeListener(subscriptionAccountChange);
    };
  }, [wallet.publicKey]);

  const buyProduct = async (usd) => {
    try {
      const sol = convertFromUsdToSol(usd);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: new PublicKey(
            "ArJtcwfSYjS6aBQqJaHQkVCBmT35v5igXpNq9x6928DG"
          ),
          lamports: new anchor.BN(makeSolCrypto(sol)),
        })
      );

      const blockHash = await connection.getRecentBlockhash();
      transaction.feePayer = wallet.publicKey;
      transaction.recentBlockhash = blockHash.blockhash;
      const signed = await wallet.signTransaction(transaction);
      const result = await connection.sendRawTransaction(signed.serialize());
      toast("Success.");
    } catch (error) {
      toast(error.message);
      console.log(error);
    }
  };

  return (
    <div className={styles.main}>
      <ToastContainer />
      {/* <p className={styles.text}>Make Payment</p>
      <div className={styles.buttons}>
        <button className={styles.button} onClick={payClicked}>
          Pay 0.1 Sol
        </button>
        <button className={styles.button}>Verify Payment</button>
      </div> */}
      <div className="flex justify-center items-center">
        <h1 className="text-4xl font-bold t text-yellow-500">
          YOUR BALANCE : {balance} SOL
        </h1>
      </div>

      <div className="flex flex-row gap-16 justify-center">
        {generateData().map((item, i) => (
          <div key={i} className="flex flex-col justify-center items-center">
            <Image
              src={item.image}
              width="350px"
              height="350px"
              objectFit="contain"
            />
            <div className="text-lg text-yellow-300 bg-slate-500 p-5 rounded-lg mt-5 px-20">
              {item.title}
            </div>
            <button
              onClick={() => buyProduct(item.price)}
              className={styles.button}
            >
              {item.price} $
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-center items-end mt-20">
        <h1 className="text-4xl font-bold t text-yellow-500 text-right">
          HOST BALANCE : {desBalance} SOL
        </h1>
      </div>
    </div>
  );
};

export default Payment;
