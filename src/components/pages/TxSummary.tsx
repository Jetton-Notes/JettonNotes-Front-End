import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { RelayTransaction } from '../../actions/relayTransaction';
import { RelayerMissingTransferFallback } from '../../actions/redeemJettons';
import { useTonClient } from "../../hooks/useTonClient";
import { useTonConnect } from "../../hooks/useTonConnect";

export type TxSummaryProps = {
    transferValue: () => Promise<{
        proof: any,
        publicSignals: any,
        exactRelayerFee: string,
        transferTo: string,
        amount: string,
        currentCommitment: string,
        utxoCommitment: string
    } | undefined | void>,

    jettonTicker: string,
    openSnackbar: (to: string) => void
}

export default function TxSummary(props: TxSummaryProps) {
    const [open, setOpen] = React.useState(false);
    const [details, setDetails] = React.useState({
        exactRelayerFee: "",
        transferTo: "",
        amount: "",
        currentCommitment: "",
        utxoCommitment: ""
    });
    const { wallet, sender, network } = useTonConnect();

    const { client } = useTonClient();

    const [snark, setSnark] = React.useState<any>({ proof: [], publicSignals: [] })

    const handleClickOpen = async () => {
        const res = await props.transferValue();
        if (res) {
            const { proof, publicSignals, exactRelayerFee, transferTo,
                amount,
                currentCommitment,
                utxoCommitment } = res;

            setDetails({
                exactRelayerFee,
                transferTo,
                amount,
                currentCommitment,
                utxoCommitment
            })
            setSnark({ proof, publicSignals })
            setOpen(true);
        }
    };

    const handleClose = () => {
        setOpen(false);

        setDetails({
            exactRelayerFee: "",
            transferTo: "",
            amount: "",
            currentCommitment: "",
            utxoCommitment: ""
        })
        setSnark({ proof: [], publicSignals: [] })
    };

    const relayTransaction = async () => {
        //TODO: RUN FALLBACK FOR NOW!

        //const result = await RelayTransaction(snark.proof, snark.publicSignals);

        if (!client) {
            props.openSnackbar("Falling back to browser wallet. Connect your wallet.")
            return;
        }


        await RelayerMissingTransferFallback(client,
            //@ts-ignore
            sender,
            snark.proof,
            snark.publicSignals);

        setOpen(false);

    }

    return (
        <React.Fragment>
            <Button variant="contained" onClick={handleClickOpen}>
                Transfer Value
            </Button>
            <Dialog
                open={open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirm Transaction"}
                </DialogTitle>
                <DialogContent>
                    <table style={{ maxWidth: "80%", overflow: "auto" }}>
                        <thead>
                            <tr>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Transfer From</td>
                                <td><pre style={{ overflow: "auto" }}>{details.currentCommitment}</pre></td>
                            </tr>
                            <tr>
                                <td>Transfer to</td>
                                <td><pre style={{ overflow: "auto" }}>{details.transferTo}</pre></td>
                            </tr>
                            <tr>
                                <td>Transfer Amount</td>
                                <td><pre style={{ overflow: "auto" }}>{details.amount} {props.jettonTicker}</pre></td>
                            </tr>
                            <tr>
                                <td>UTXO Address</td>
                                <td><pre style={{ overflow: "auto" }}>{details.utxoCommitment}</pre></td>
                            </tr>
                            <tr>
                                <td>Relayer Fee</td>
                                <td><pre style={{ overflow: "auto" }}>{details.exactRelayerFee} {props.jettonTicker}</pre></td>
                            </tr>
                        </tbody>
                    </table>
                    <p>If relayer is down the transfer falls back to local wallet. The tgBTC fee is not added when using the local wallet.</p>
                    <h4>FOR TESTNET THE RELAYING FALLS BACK TO USE THE LOCAL WALLET. ANY ADDRESS CAN BECOME A RELAYER, THEY WILL RECEIVE THE FEE.</h4>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" onClick={async () => await relayTransaction()} autoFocus>
                        Approve
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}