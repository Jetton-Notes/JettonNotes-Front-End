import { decryptData, Status } from "../crypto/encrypt";
import { getAccountKey } from "../storage";
import { bip32derivedDeposit, generateNoteWithdrawProof, parseNote, toNoteHex } from "../crypto/cryptonotes";
import { fromNano } from "ton-core";

//This will get the zkSnark for the relayed transaction
export async function getRelayerSnark(
    transferTo: bigint,
    amount: bigint,
    currentUtxoIndex: number,
    password: string
) {
    const workchain = 0n;
    const recipient = 0n; // There don't matter because they are not checked during a relayed tx..

    const accountKeyFound = await getAccountKey();
    if (accountKeyFound) {
        const masterKeyData = await decryptData(accountKeyFound.cipherText.buffer, password);

        if (masterKeyData.status === Status.Success) {
            const parsedNote = await parseNote(masterKeyData.data);
            const currentNote = await bip32derivedDeposit({
                masterSecret: parsedNote.deposit.secret,
                masterNullifier: parsedNote.deposit.nullifier,
                counter: currentUtxoIndex,
            })
            const utxoNote = await bip32derivedDeposit({
                masterSecret: parsedNote.deposit.secret,
                masterNullifier: parsedNote.deposit.nullifier,
                counter: currentUtxoIndex + 1,
            })

            const { proof, publicSignals } = await generateNoteWithdrawProof({
                deposit: currentNote,
                recipient,
                workchain,
                transferto_commitment: transferTo,
                transferto_amount: amount,
                utxo_commitment: utxoNote.commitment,
                snarkArtifacts: {
                    wasmFilePath: "./circuit.wasm",
                    zkeyFilePath: "./circuit_final.zkey"
                }
            });

            return {
                success: true,
                snark: {
                    proof, publicSignals
                },
                renderedTxDetails: {
                    transferTo: toNoteHex(transferTo),
                    amount: fromNano(amount),
                    currentCommitment: toNoteHex(currentNote.commitment),
                    utxoCommitment: toNoteHex(utxoNote.commitment)

                },
                error: ""
            }
        }


    }

    return {
        success: false,
        snark: {},
        renderedTxDetails: {
            transferTo: "",
            amount: "",
            currentCommitment: "",
            utxoCommitment: "",
        },
        error: ""
    }

}