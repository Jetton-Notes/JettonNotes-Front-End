import { Button, Box, Typography, Paper, TextField, Stack } from "@mui/material";
import { RouteFooter } from "../../Footer";

export type HdWalletUtxosProps = {
    account_id: string

}

//TODO: This needs to show a paginated list of HDWallet Utxos
//It needs to be generated per wallet

export function HdWalletUtxos(props: HdWalletUtxosProps) {
    return <Box >
        <Paper sx={{ maxWidth: 936, margin: "auto", overflow: "hidden", mt: "10px" }}>
            <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Typography component="h1" variant="h4">HD Wallet</Typography>
            </Stack>
            <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <pre>{props.account_id.slice(0, 6)}...{props.account_id.slice(props.account_id.length - 6, props.account_id.length)}</pre>
            </Stack>
            <Stack sx={{ padding: "30px" }} direction={"row"} justifyContent="center">
                <Typography component="p" variant="subtitle1">This is a hierarchical deterministic wallet for Jetton Notes that allows you to transfer Jettons with account abstraction and pay for fees using the Jetton instead of Ton. You don't need a Ton wallet to transfer Jettons but inf the relayer is down it will fall back wallet transfers.</Typography>
            </Stack>

            <Stack sx={{ mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <TextField sx={{ width: "80%" }} type="text" label="Transfer To Note" onChange={(event: React.ChangeEvent<HTMLInputElement>) => {

                }}></TextField>

            </Stack>
            <Stack sx={{ mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <TextField sx={{ width: "80%" }} type="number" label="Transfer Amount" onChange={(event: React.ChangeEvent<HTMLInputElement>) => {

                }}></TextField>
            </Stack>
            <Stack sx={{ mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <TextField sx={{ width: "70%" }} type="text" label="Unspent Transaction" onChange={(event: React.ChangeEvent<HTMLInputElement>) => {

                }}></TextField>
                <Button sx={{ width: "10%" }} variant="outlined">Assign</Button>
            </Stack>

            <Stack sx={{ mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Button variant="contained">Transfer Value</Button>
            </Stack>

            <RouteFooter content="The Jetton Notes currently use tgBTC on Ton Testnet"></RouteFooter>
        </Paper>
    </Box >
}