import { fromNano } from "@ton/core";
import { bip32derivedDeposit, parseNote, toNoteHex } from "../crypto/cryptonotes";
import { decryptData, encryptData, Status } from "../crypto/encrypt";
import { getAccountKey, setLastAddressUTXOIndex, setLastCommtiment } from "../storage";
import { getCommitmentBalanceWithoutWallet } from "./depositJettons";

export async function getNextValidWallet(password: string, account_id: string, startIndex: number, showError: (msg: string) => void) {
    const accountKeyFound = await getAccountKey();
    if (accountKeyFound) {
        const masterKeyData = await decryptData(accountKeyFound.cipherText.buffer, password);
        if (masterKeyData.status === Status.Success) {
            const parsedNote = await parseNote(masterKeyData.data);

            let search = true;
            let i = startIndex;
            let fetchedBalance = "0";
            let commitment = "";
            while (search) {
                const next = await generateNextNote(
                    parsedNote.deposit.secret,
                    parsedNote.deposit.nullifier,
                    i,
                    password,
                    account_id
                )
                //Now do a fetch to check if the commitment is valid or has deposit etc...
                try {
                    const balance = await getCommitmentBalanceWithoutWallet(BigInt(next.commitment));

                    if (balance.nullifier != 0n) {
                        //It's nullified, so I need to increment the index
                        i++;
                    } else {
                        //Else I got it...probably
                        search = false;
                        setLastAddressUTXOIndex(i, account_id);
                        setLastCommtiment(i, account_id, next.commitment);
                        fetchedBalance = fromNano(balance.depositAmount)
                        commitment = next.commitment;
                    }

                } catch (err: any) {
                    //Some other exit code means I abort...
                    search = false;
                    showError("Network error.")
                    //I set the last index so I know where to continue from to try again
                    setLastAddressUTXOIndex(i, account_id);
                    setLastCommtiment(i, account_id, next.commitment)
                }
            }

            return { fetchedBalance, commitment, success: true }
        }
        //If there is no account key, the whole thing should do nothing.
    }
    return {
        success: false,
        fetchedBalance: "",
        commitment: ""
    }
}

export async function generateNextNote(
    masterSecret: bigint,
    masterNullifier: bigint,
    index: number,
    password: string,
    account_id: string
) {
    const derived = await bip32derivedDeposit({
        masterSecret,
        masterNullifier,
        counter: index
    })
    const commitment = toNoteHex(derived.commitment);
    const noteString = toNoteHex(derived.preimage, 64);
    const cipherTextOptions = await encryptData(noteString, password);
    return {
        key: generateKey(account_id, index, commitment),
        value: cipherTextOptions.data,
        commitment
    }
}

function generateKey(account_id: string, index: number, commitmentHash: string) {
    return `${account_id}&&${index}**${commitmentHash}`;
}

//This separates the keys at the special characters
export function parseKeys(key: string): { account_id: string, index: string, commitmentHash: string } {
    const firstSplit = key.split("&&");
    const secondSplit = firstSplit[1].split("**");

    return {
        account_id: firstSplit[0],
        index: secondSplit[0],
        commitmentHash: secondSplit[1]
    }
}

