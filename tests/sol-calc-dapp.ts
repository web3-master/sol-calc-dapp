import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { SolCalcDapp } from "../target/types/sol_calc_dapp";

describe("sol-calc-dapp", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SolCalcDapp as Program<SolCalcDapp>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
