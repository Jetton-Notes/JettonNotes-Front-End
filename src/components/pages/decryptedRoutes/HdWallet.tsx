import { Button, Box, Typography, Paper, TextField, Stack } from "@mui/material";
import { RouteFooter } from "../../Footer";

export type HdWalletProps = {
    account_id: string

}

//TODO: This HDWallet should render the identifier for the wallet and show a backup page
//If the password is entered correctly it should show the master note
//TODO: It should also show the derived addresses and show if they have balance

//THen when it's been copied the user can make the deposit
export function HdWallet(props: HdWalletProps) {
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
                {/* <TextField type="number" label="Deposit Amount" value={props.depositAmount} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    props.setDepositAmount(event.target.value);
                }}></TextField> */}

            </Stack>
            {/* <Stack sx={{ mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}> */}
            {/* <Button variant="contained" onClick={() => props.createNoteClicked(props.depositAmount)}>Create Note</Button>                </Stack> */}
            <RouteFooter content="The Jetton Notes currently use tgBTC on Ton Testnet"></RouteFooter>
        </Paper>
    </Box >
}