import { Button, Box, Typography, Paper, TextField, Stack } from "@mui/material";
import { RouteFooter } from "../../Footer";

export type CreateRouteProps = {
    onNotify: (msg: string, type: string) => void,
    createNoteClicked: () => Promise<void>
}


export function CreateRoute(props: CreateRouteProps) {
    return <Box >
        <Paper sx={{ maxWidth: 936, margin: "auto", overflow: "hidden", mt: "10px" }}>
            <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Typography component="h1" variant="h4">Jetton Notes Burner Wallet</Typography>
            </Stack>
            <Stack sx={{ padding: "30px" }} direction={"row"} justifyContent="center">
                <Typography component="p" variant="subtitle1">Jetton Notes are financial claims for value that was deposited into a smart contract. Currently available for tgBTC. It can be used to store value without a wallet or to transfer value off-chain.</Typography>
            </Stack>
            <Stack sx={{ mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Button variant="contained" onClick={() => props.createNoteClicked()}>Create Crypto Note</Button></Stack>
            <RouteFooter content="The Jetton Notes currently use tgBTC on Ton Testnet"></RouteFooter>
        </Paper>
    </Box >
}