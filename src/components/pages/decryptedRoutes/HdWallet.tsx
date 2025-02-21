import { Button, Box, Typography, Paper, TextField, Stack } from "@mui/material";
import { RouteFooter } from "../../Footer";
import React from "react";
import Info from "../../styled/Info";
import { getLastAddressUTXOIndex } from "../../../storage";
import { getNextValidWallet } from "../../../actions/generateUtxos";
import { fromNano, toNano } from "@ton/core";
import { getRelayerSnark } from "../../../actions/getRelayerSnark";
import TxSummary from "../TxSummary";
import { getRelayerFeeWithoutWallet } from "../../../actions/depositJettons";

export type HdWalletProps = {
    account_id: string,
    password: string,
    openSnackbar: (msg: string) => void,
    jettonTicker: string
}

export function HdWallet(props: HdWalletProps) {
    const [isWalletCalibrated, setIsWalletCalibrated] = React.useState(false);

    const [currentAddress, setCurrentAddress] = React.useState("");
    const [walletBalance, setWalletBalance] = React.useState("0");

    const [transferTo, setTransferTo] = React.useState("");
    const [amount, setAmount] = React.useState("");
    const [currentIndex, setCurrentIndex] = React.useState(0);
    React.useEffect(() => {
        const checkCalibration = async () => {
            const lastUtxoIndexFound = await getLastAddressUTXOIndex(props.account_id);
            if (lastUtxoIndexFound.success === false) {
                setIsWalletCalibrated(false)
            } else {
                try {
                    const { fetchedBalance, commitment, success } = await getNextValidWallet(props.password, props.account_id, lastUtxoIndexFound.data, props.openSnackbar);
                    setWalletBalance(fetchedBalance);
                    setCurrentAddress(commitment);
                    setIsWalletCalibrated(true);
                    setCurrentIndex(lastUtxoIndexFound.data)
                    if (!success) {
                        props.openSnackbar("failed to refresh wallet")
                    }
                } catch (err) {
                    props.openSnackbar("Error occured refreshing the wallet")
                    console.log(err)
                }
            }
        }
        checkCalibration()
    }, [])

    function copyAddress() {
        //TODO: copy the address that was set
        props.openSnackbar("Address copied to clipboard")
    }

    async function runCalibration() {
        // run generate notes.. starting at 0 index
        const { fetchedBalance, commitment, success } = await getNextValidWallet(props.password, props.account_id, 1, props.openSnackbar);
        // and find the last valid note with or without balance..

        if (success) {
            setWalletBalance(fetchedBalance);
            setCurrentAddress(commitment);
            setIsWalletCalibrated(true);

            return;
        }
        props.openSnackbar("Unable to finish calibration")
    }

    async function transferValue() {

        try {
            BigInt(transferTo)
        } catch (err) {
            props.openSnackbar("Invalid Transfer To entered.")
            return;
        }

        if (BigInt(transferTo) === 0n) {
            props.openSnackbar("Invalid transfer to");
            return;
        }

        if (isNaN(parseFloat(amount))) {
            props.openSnackbar("Invalid balance entered");
            return;
        }

        if (parseFloat(amount) <= 0) {
            props.openSnackbar("Unable to transfer zero balance");
            return;
        }

        if (toNano(walletBalance) < toNano(amount)) {
            props.openSnackbar("Not enough balance")
            return;
        }

        if (currentIndex === 0) {
            return;
        }

        const exactRelayerFee = await getRelayerFeeWithoutWallet();

        const snark = await getRelayerSnark(
            BigInt(transferTo),
            toNano(amount),
            currentIndex,
            props.password
        );
        if (snark.success) {
            const { proof, publicSignals } = snark.snark;

            return { proof, publicSignals, exactRelayerFee: fromNano(exactRelayerFee), ...snark.renderedTxDetails }
        } else {
            props.openSnackbar("Unable to compute withdraw proof");
            return;
        }
    }

    async function redeemBalanceClicked() {
        console.log("redeem balan2e clicked!")



    }

    return <Box >
        <Paper sx={{ maxWidth: 936, margin: "auto", overflow: "hidden", mt: "10px" }}>
            <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Typography component="h1" variant="h4">Wallet</Typography>
            </Stack>
            {isWalletCalibrated ? null :
                <Stack sx={{ padding: "30px", display: "flex", flexDirection: "row", justifyContent: "center" }}>
                    <Button variant="contained" sx={{ maxWidth: "200px" }} onClick={async () => await runCalibration()}>Calibrate Wallet</Button>
                </Stack>}

            {isWalletCalibrated ?
                <Stack sx={{ paddingLeft: "30px", paddingRight: "30px", display: "flex", flexDirection: "row", justifyContent: "center" }}>
                    <pre style={{ overflow: "auto" }}>{currentAddress}</pre>
                </Stack> : null}

            {isWalletCalibrated ?
                <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                    <pre style={{ overflow: "auto" }}>Balance: {walletBalance} {props.jettonTicker}</pre>
                </Stack> : null}

            <Info summary="How the UTXO wallet works?">
                <Stack sx={{ padding: "30px" }} direction={"row"} justifyContent="center">
                    <Typography component="p" variant="subtitle1">The wallet uses derived addresses. You can transfer to an address multiple times but spend only once. After spending the public address changes! Jetton Notes allows you to transfer Jettons with account abstraction and pay for fees using the Jetton instead of Ton. You don't need a Ton wallet to transfer Jettons but in the relayer is down it will fall back wallet transfers. </Typography>
                </Stack>
                <Stack sx={{ padding: "30px", overflow: "auto" }} direction={"row"} justifyContent="center">
                    <Typography component="p" variant="subtitle1">
                        Because the deposit accounts change, you can use the wallet identifier to check which masterkeys you are using.
                    </Typography>
                </Stack>
                <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                    <pre style={{ overflow: "auto" }}>Your wallet identifier is {props.account_id.slice(0, 6)}...{props.account_id.slice(props.account_id.length - 6, props.account_id.length)}</pre>
                </Stack>

                {/* <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                    <Typography component="p" variant="subtitle1">
                        You can redeem the balance of the wallet to your TON account
                    </Typography>
                    <Button onClick={redeemBalanceClicked}>Redeem Balance</Button>
                </Stack> */}
            </Info>
            {isWalletCalibrated ?
                <Stack sx={{ mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                    <TextField value={transferTo} disabled={!isWalletCalibrated} sx={{ width: "80%" }} type="text" label="Transfer To" onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setTransferTo(event.target.value)
                    }}></TextField>
                </Stack> : null}
            {isWalletCalibrated ?
                <Stack sx={{ padding: "30px", display: "flex", flexDirection: "row", justifyContent: "center" }}>
                    <Typography component="p" variant="subtitle2">Make sure the transfer to is correct, invalid transfers can't be recovered!</Typography>
                </Stack>
                : null}
            {isWalletCalibrated ?
                <Stack sx={{ mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                    <TextField value={amount} disabled={!isWalletCalibrated} sx={{ width: "80%" }} type="number" label="Transfer Amount" onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setAmount(event.target.value)
                    }}></TextField>
                </Stack>
                : null}

            {isWalletCalibrated ?
                <Stack sx={{ mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                    <TxSummary openSnackbar={props.openSnackbar} jettonTicker={props.jettonTicker} transferValue={transferValue}></TxSummary>
                </Stack>
                : null}
            <RouteFooter content="The Jetton Notes currently use tgBTC on Ton Testnet"></RouteFooter>
        </Paper>
    </Box >
}
