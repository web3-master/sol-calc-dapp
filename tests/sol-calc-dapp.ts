import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { assert } from "chai";
import { SolCalcDapp } from "../target/types/sol_calc_dapp";

describe("sol-calc-dapp", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider);

  const calculator = anchor.web3.Keypair.generate();
  const program = anchor.workspace.SolCalcDapp as Program<SolCalcDapp>;

  it("Creates a calculator", async () => {
    await program.rpc.create("Welcome to Solana", {
      accounts: {
        calculator: calculator.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [calculator]
    });
    
    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.greeting == "Welcome to Solana");
  });

  it("Adds two numbers", async () => {
    await program.rpc.add(new anchor.BN(2), new anchor.BN(3), {
      accounts: {
        calculator: calculator.publicKey,
      }
    });

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(5)));
  });

  it("Subtracts two numbers", async () => {
    await program.rpc.subtract(new anchor.BN(10), new anchor.BN(4), {
      accounts: {
        calculator: calculator.publicKey
      }
    });

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(6)));
  });

  it("Multiplies two numbers", async () => {
    await program.rpc.multiply(new anchor.BN(10), new anchor.BN(3), {
      accounts: {
        calculator: calculator.publicKey
      }
    });

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(30)));
  });

  it("Divides two numbers", async () => {
    await program.rpc.divide(new anchor.BN(10), new anchor.BN(3), {
      accounts: {
        calculator: calculator.publicKey
      }
    });

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(3)));
    assert.ok(account.remainder.eq(new anchor.BN(1)));
  });

  it("Divide by zero", async () => {
    try {
      await program.rpc.divide(new anchor.BN(1), new anchor.BN(0), {
        accounts: {
          calculator: calculator.publicKey
        }
      });
      assert.ok(false);
    } catch (e) {
      const errMsg = "Divide by zero!";
      assert.equal(e.error.errorMessage, errMsg);
    }
  });
});
