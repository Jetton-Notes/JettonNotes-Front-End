import { jsPDF } from "jspdf";

import { appName, website, botlink } from "../constants";

export interface DownloadA4NoteProps {
    bearerText: string,
    denomination: string,
    commitment: string,
    cardType: string,
    dataUrl: any,
    noteString: string,
    commitmentQRCodeString: string,
    commitmentQRCodeDataUrl: any,
    network: string,
    tokenAddress: string
}


export function downloadA4PDF(
    { bearerText,
        denomination,
        commitment,
        cardType,
        dataUrl,
        noteString,
        commitmentQRCodeString,
        commitmentQRCodeDataUrl,
        network,
        tokenAddress }: DownloadA4NoteProps) {
    //Using default page , which is A4 and units in milimeters
    let doc = new jsPDF();
    const networkName = network;
    // doc.addImage("/imgs/LowOpacity.png", "PNG", 0, 0, 210, 297);
    //@ts-ignore
    var { TextField } = jsPDF.AcroForm;
    // Gonna do the title
    doc.setFontSize(25);
    doc.text(cardType, 45, 11)

    // info string about website under title in grey
    doc.setFontSize(20);
    let prevTextColor = doc.getTextColor();
    doc.setTextColor("#808080");
    doc.text(`${website} ${botlink}`, 45, 20);
    //https://t.me/jetton_notes_bot
    doc.setTextColor(prevTextColor);

    // and subtitle with string splitting
    doc.setFontSize(15);
    const subtitleMaxLineWidth = 150;
    let splitSubtitle = doc.splitTextToSize(bearerText, subtitleMaxLineWidth);
    doc.text(splitSubtitle, 45, 28)
    // The commitment qr code 
    doc.addImage(commitmentQRCodeDataUrl, "JPEG", 1, 3, 40, 40);

    // The Logo image
    // /?TODO:  This is the logo placeholder 
    // doc.addImage("/imgs/BunnyLogoBW.jpg", "JPEG", 160, 3, 40, 40);
    // doc.ellipse(180, 25, 20, 20);

    // An Info text about the verification
    doc.setFontSize(10);
    doc.text(`To verify the note, open ${website} and scan the QR code or paste the code. You can safely share this code with others.`, 3, 50);
    //and the commitment string with string splitting
    doc.setFontSize(5);
    doc.text(commitmentQRCodeString, 3, 55);

    // Draw a line under the top part 
    doc.setLineWidth(0.2);
    doc.setDrawColor("#808080");
    doc.line(3, 60, 207, 60);
    // The terms and conditons start
    doc.setTextColor("#808080");
    doc.setFontSize(20);
    doc.text(TermsAndConditionsTitle, 3, 67)
    // 6 points with line string splitting
    doc.setFontSize(10);
    let termsLineWidth = 200;
    let splitTerms = doc.splitTextToSize(Terms, termsLineWidth);
    doc.text(splitTerms, 3, 74)
    doc.setTextColor(prevTextColor);


    doc.setFontSize(13);
    doc.text(`Jetton: ${denomination}`, 45, 247);
    doc.text(`Network: ${networkName}`, 45, 254);
    doc.text(`Jetton Master Address: ${tokenAddress}`, 45, 261);
    doc.setTextColor("#808080");
    doc.text("To withdraw the value scan the QR Code or", 45, 268)
    doc.text(`paste the code into the DApp at ${website}`, 45, 274)
    doc.setTextColor(prevTextColor);
    doc.setFontSize(18);
    doc.text("Use the QR Code to withdraw the value. Keep this confidential", 2, 235);

    // Add the QR code to the right and add the bunny note string under it
    doc.addImage(dataUrl, "JPEG", 1, 240, 40, 40);
    doc.setFontSize(5);
    doc.text(noteString, 3, 285);

    // Add an input form with transfer to and transfer from!
    doc.setTextColor("#808080");
    doc.setFontSize(10);
    doc.text("Transfer from:", 3, 185);
    let transferFromField = new TextField();
    transferFromField.Rect = [3, 190, 50, 30];
    transferFromField.multiline = true;
    doc.addField(transferFromField);
    doc.text("Transfer to:", 60, 185);
    let transferToField = new TextField();
    transferToField.Rect = [60, 190, 50, 30];
    transferToField.multiline = true;
    doc.addField(transferToField);

    doc.text("Comment:", 116, 185);
    let transferComment = new TextField();
    transferComment.Rect = [116, 190, 50, 30];
    transferComment.multiline = true;
    doc.addField(transferComment);

    doc.setFontSize(10);
    doc.text("You can add extra information about the Jetton Note to comply with regulation.", 3, 180);
    doc.setFontSize(13);

    // Draw a line under the extra fields
    doc.setDrawColor("#808080");
    doc.line(3, 225, 207, 225);

    doc.text(`${website} ${botlink}`, 3, 292);

    doc.save(`jettonnote-${denomination}-${commitment}.pdf`)


    //FOR TESTING RENDER THE DOCUMENT IN A SEPARATE WINDOW!!
    // var string = doc.output('datauristring');
    // console.log(string);
    // var embed = "<embed width='100%' height='100%' src='" + string + "'/>"
    // var x = window.open() as Window;
    // x.document.open();
    // x.document.write(embed);
    // x.document.close();
}

export const TermsAndConditionsTitle = `Terms and Conditions`



export const Terms = `The following terms and conditions apply to the use of ${appName} on the website ${website} and bot ${botlink}\n
PURPOSE: A jetton note is a printable and verifiable claim to withdraw value that was deposited into a smart contract through the website ${website}. It is designed to facilitate the transfer of value between parties who deposit into and withdraw funds from a smart contract.\n
INDEMNIFICATION: The creator of the smart contract and the website ${website} are indemnified from any claims, damages, or losses arising from the use of ${appName}. Parties acknowledge and agree that they use Jetton Note at their own risk and that the creator of the smart contract and the website ${website} shall not be liable for any damages, losses, or expenses arising from the use of Jetton Note. ${website} offers no guarantee of any kind. Use it at your own risk.\n
VERIFICATION: Jetton Note can be verified on the blockchain. Parties acknowledge and agree that they are solely responsible for verifying the authenticity of the Jetton Note and ensuring that it has not been tampered with.\n
TRANSFERABILITY: Jetton Note is transferable and can be redeemed by the holder of the note. Parties acknowledge and agree that they are solely responsible for transferring the note to the intended recipient and that the creator of the smart contract and the website ${website} shall not be liable for any losses or damages arising from the transfer of the note.\n
GOVERNING LAW AND JURISDICTION: These terms and conditions shall be governed by and construed in accordance with the laws of the jurisdiction where the parties are located. Any dispute arising between the parties shall be resolved in the courts of the jurisdiction where the parties are located without involving ${website} or the creator of the smart contract.\n
By using Jetton Note on the website ${website}, parties acknowledge and agree to be bound by these terms and conditions. If parties do not agree to these terms and conditions, they should not use the Jetton Note and the website ${website}`;


