
import { currentNetwork, onlyCURR, tgBTC_jetton_master } from "../constants";
import { deposit, parseNote, toNoteHex } from "../crypto/cryptonotes";
import { downloadA4PDF } from "../pdf";
import { commitmentQR, createQR } from "../pdf/qrCode";

function getDenomination(depositAmount: string) {

}


export async function createNoteClicked(
    depositAmount: string,
    onNotify: (msg: string, type: string) => void) {

    const bearerText = `The smart contract on ${currentNetwork} will pay the bearer on demand the sum of ${depositAmount} ${onlyCURR}`


    //TODO: create the new commitment, prompt the download of the file
    //If download success, trigger jetton transfer deposit


    try {
        const parsed = parseFloat(depositAmount)

        if (isNaN(parsed) || parsed === 0 || parsed < 0) {
            throw new Error("Invalid")
        }

    } catch (err) {
        onNotify("Invalid deposit amount", "error")
        return;
    }


    const noteString = await deposit({ currency: "tgBTC", amount: depositAmount })
    const parsedNote = await parseNote(noteString);

    const commitmentBigint = parsedNote.deposit.commitment;
    const nullifierHashBigint = parsedNote.deposit.nullifierHash;

    const commitment = toNoteHex(commitmentBigint);
    const nullifierHash = toNoteHex(nullifierHashBigint);

    const commitmentQRData = await commitmentQR(
        {
            amount: depositAmount,
            currency: onlyCURR,
            commitment,
            nullifierHash
        })

    const dataUrl = await createQR(noteString);

    downloadA4PDF({
        bearerText,
        denomination: onlyCURR,
        commitment,
        cardType: "Jetton Note",
        dataUrl,
        noteString,
        commitmentQRCodeString: commitmentQRData.QRString,
        commitmentQRCodeDataUrl: commitmentQRData.buffer,
        network: currentNetwork,
        tokenAddress: tgBTC_jetton_master
    })


    //When the download finishes do the jetton deposit transaction


}