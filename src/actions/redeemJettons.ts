import { Sender, toNano } from "@ton/core";
import { g1Compressed, g2Compressed, generateNoteWithdrawProof, hexToBigint, parseNote, SplitAddress } from "../crypto/cryptonotes";

//@ts-ignore
import { buildBls12381, utils } from "ffjavascript";
import { TonClient } from "ton";
import { getDepositWithdrawContract } from "./depositJettons";


import Buff from "node:buffer";

const Buffer = Buff.Buffer;


export async function redeemjettons(
    client: TonClient,
    sender: Sender,
    noteString: string,
    wallet: string
) {
    const parsedNote = await parseNote(noteString);
    const [workchain, splitRawAddress] = SplitAddress(wallet);
    const recipient_bigint = hexToBigint(splitRawAddress);
    const { proof, publicSignals } = await generateNoteWithdrawProof({
        deposit: parsedNote.deposit,
        recipient: recipient_bigint,
        workchain: parseInt(workchain),
        transferto_commitment: 0n,
        transferto_amount: 0n,
        utxo_commitment: 0n,
        snarkArtifacts: {
            wasmFilePath: "./circuit.wasm",
            zkeyFilePath: "./circuit_final.zkey"
        }
    })

    const curve = await buildBls12381();
    const proofProc = utils.unstringifyBigInts(proof);
    const pi_aS = g1Compressed(curve, proofProc.pi_a);
    const pi_bS = g2Compressed(curve, proofProc.pi_b);
    const pi_cS = g1Compressed(curve, proofProc.pi_c);
    const pi_a = Buffer.from(pi_aS, "hex");
    const pi_b = Buffer.from(pi_bS, "hex");
    const pi_c = Buffer.from(pi_cS, "hex");

    const depositWithdrawClient = getDepositWithdrawContract(client);

    await depositWithdrawClient.sendWithdraw(
        sender, {
        pi_a,
        pi_b,
        pi_c,
        pubInputs: publicSignals,
        value: toNano("0.15") // 0.15 Ton fee
    }
    );
}

//TODO: If the relayer is missing I fall back to another address
export async function RelayerMissingTransferFallback(client: TonClient, sender: Sender, proof: any, publicSignals: any) {

    const curve = await buildBls12381();
    const proofProc = utils.unstringifyBigInts(proof);
    const pi_aS = g1Compressed(curve, proofProc.pi_a);
    const pi_bS = g2Compressed(curve, proofProc.pi_b);
    const pi_cS = g1Compressed(curve, proofProc.pi_c);
    const pi_a = Buffer.from(pi_aS, "hex");
    const pi_b = Buffer.from(pi_bS, "hex");
    const pi_c = Buffer.from(pi_cS, "hex");

    const depositWithdrawClient = getDepositWithdrawContract(client);

    await depositWithdrawClient.sendTransfer_note(sender, {
        pi_a,
        pi_b,
        pi_c,
        pubInputs: publicSignals,
        value: toNano("0.15")
    });
}

