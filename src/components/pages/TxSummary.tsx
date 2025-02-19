import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export type TxSummaryProps = {
    transferValue: () => Promise<{ proof: any, publicSignals: any } | undefined>;
    // transferTo: string,
    // transferAmount: string

}

export default function TxSummary(props: TxSummaryProps) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = async () => {
        const res = await props.transferValue();
        if (res) {
            const { proof, publicSignals } = res;
            setOpen(true);
        }
    };

    const handleClose = () => {
        setOpen(false);

        //TODO: Try to send via relayer, if can't fall back to wallet!
    };

    return (
        <React.Fragment>
            <Button variant="contained" onClick={handleClickOpen}>
                Transfer Value
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirm Transaction"}
                </DialogTitle>
                <DialogContent>
                    {/* <DialogContentText id="alert-dialog-description"> */}
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Transfer From</td>
                                <td>0x....</td>
                            </tr>
                            <tr>
                                <td>Transfer to</td>
                                <td>0x...</td>
                            </tr>
                            <tr>
                                <td>Transfer Amount</td>
                                <td>0 tgBTC</td>
                            </tr>
                            <tr>
                                <td>UTXO Address</td>
                                <td>0x</td>
                            </tr>
                        </tbody>
                    </table>
                    <p>The relayer fee is 0 tgBTC, if relayer is down the transfer falls back to local wallet. The tgBTC fee is not added when using the local wallet.</p>
                    {/* </DialogContentText> */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleClose} autoFocus>
                        Approve
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}