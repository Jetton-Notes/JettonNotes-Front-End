import { Button, Box, Typography, Paper, TextField, Stack } from "@mui/material";
import { RouteFooter } from "../../Footer";
import Info from "../../styled/Info";


export type PayToRoute = {
    depositAmount: string,
    setDepositAmount: (to: string) => void,
    noteCommitment: string,
    setNoteCommitment: (to: string) => void,
    depositClicked: (val: string, commitment: string) => Promise<void>
}

export function PayToRoute(props: PayToRoute) {
    return <Box >
        <Paper sx={{ maxWidth: 936, margin: "auto", overflow: "hidden", mt: "10px" }}>

            <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Typography component="h1" variant="h4">Pay to Jetton Notes</Typography>
            </Stack>

            <Info summary="Deposit value to a Jetton Note">
                <Stack sx={{ padding: "30px" }} direction={"row"} justifyContent="center">
                    <Typography component="p" variant="subtitle1">As long as the Jetton Note was not nullified, you can deposit more value into it. If you want to give somebody Jettons without you creating a new note, can remotely top up an existing Jetton Note.</Typography>
                </Stack>
            </Info>

            <Stack sx={{ mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <TextField sx={{ width: "80%" }} type="text" label="Note Commitment (View Key)" value={props.noteCommitment} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    props.setNoteCommitment(event.target.value);
                }}></TextField>
            </Stack>

            <Stack sx={{ mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <TextField sx={{ width: "80%" }} type="number" label="Deposit Amount" value={props.depositAmount} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    props.setDepositAmount(event.target.value);
                }}></TextField>
            </Stack>

            <Stack sx={{ mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Button variant="contained" onClick={async () => await props.depositClicked(props.depositAmount, props.noteCommitment)}>Deposit Value</Button>
            </Stack>

            <RouteFooter content="The Jetton Notes currently use tgBTC on Ton Testnet"></RouteFooter>
        </Paper>
    </Box >
}


