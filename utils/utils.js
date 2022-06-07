import { AnchorProvider, Program } from "@project-serum/anchor";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { STABLE_POOL_IDL, STABLE_POOL_PROGRAM_ID } from "./const";

export function getProgramInstance(connection, wallet) {
  if (!wallet.publicKey) throw new WalletNotConnectedError();

  const opts = {
    preflightCommitment: "processed",
  };

  const provider = new AnchorProvider(
    connection,
    wallet,
    AnchorProvider.defaultOptions()
  );
  const idl = STABLE_POOL_IDL;
  const programId = STABLE_POOL_PROGRAM_ID;
  const program = new Program(idl, programId, provider);

  return program;
}
