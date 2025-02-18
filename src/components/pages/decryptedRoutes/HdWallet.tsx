import { Button, Box, Typography, Paper, TextField, Stack } from "@mui/material";
import { RouteFooter } from "../../Footer";
import React from "react";
import Info from "../../styled/Info";

export type HdWalletProps = {
    account_id: string,
    password: string,
    showUTXOsPage: () => void
}

//THen when it's been copied the user can make the deposit

//TODO: It should fetch the index of the lastUTXO then use it to get the address with the balance

//TODO: it should automatically figure out the unspent transaction out field

export function HdWallet(props: HdWalletProps) {
    const [currentAddress, setCurrentAddress] = React.useState("");
    const [walletBalance, setWalletBalance] = React.useState("0");

    React.useEffect(() => {

        //TODO: getTheLastAddressUTXOIndex()
        //TODO: derive the address for index, using the master key
        //TODO: Check the balance of the UTXO


    }, [])



    return <Box >
        <Paper sx={{ maxWidth: 936, margin: "auto", overflow: "hidden", mt: "10px" }}>
            <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Typography component="h1" variant="h4">Wallet</Typography>
            </Stack>

            <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Button onClick={() => props.showUTXOsPage()}>UTXOs</Button>
            </Stack>
            <Info summary="How the UTXO wallet works?">
                <Stack sx={{ padding: "30px" }} direction={"row"} justifyContent="center">
                    <Typography component="p" variant="subtitle1">The wallet uses derived addresses. You can transfer to an address multiple times but spend only once. After spending the public address changes! Jetton Notes allows you to transfer Jettons with account abstraction and pay for fees using the Jetton instead of Ton. You don't need a Ton wallet to transfer Jettons but in the relayer is down it will fall back wallet transfers. </Typography>
                </Stack>
                <Stack sx={{ padding: "30px" }} direction={"row"} justifyContent="center">
                    <Typography component="p" variant="subtitle1">
                        Because the deposit accounts change, you can use the wallet identifier to check which masterkeys you are using.
                    </Typography>
                </Stack>
                <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                    <pre>Your wallet identifier is {props.account_id.slice(0, 6)}...{props.account_id.slice(props.account_id.length - 6, props.account_id.length)}</pre>
                </Stack>
            </Info>

            <Stack sx={{ mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <TextField sx={{ width: "80%" }} type="text" label="Transfer To" onChange={(event: React.ChangeEvent<HTMLInputElement>) => {

                }}></TextField>

            </Stack>
            <Stack sx={{ mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <TextField sx={{ width: "80%" }} type="number" label="Transfer Amount" onChange={(event: React.ChangeEvent<HTMLInputElement>) => {

                }}></TextField>
            </Stack>

            <Stack sx={{ mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Button variant="contained">Transfer Value</Button>
            </Stack>
            <RouteFooter content="The transfer fee is 0 tgBTC"></RouteFooter>

        </Paper>
    </Box >
}