import { Button, Box, Typography, Paper, TextField, Stack } from "@mui/material";
import { RouteFooter } from "../../Footer";
import Info from "../../styled/Info";


export type NoteBalanceRouteProps = {
    noteCommitment: string,
    setNoteCommitment: (to: string) => void,
    jettonBalance: string,
    jettonTicker: string,
    fetchBalance: (balanceOf: string) => Promise<void>
}

export function NoteBalanceRoute(props: NoteBalanceRouteProps) {
    return <Box >
        <Paper sx={{ maxWidth: 936, margin: "auto", overflow: "hidden", mt: "10px" }}>
            <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Typography component="h1" variant="h4">Jetton Note Balance</Typography>
            </Stack>
            <Info summary="How to know if a note is valid?">
                <Stack sx={{ padding: "30px" }} direction={"row"} justifyContent="center">
                    <Typography component="p" variant="subtitle1">Use the commitment to check the note.The balance will show if it's available. You will see a message if the note has no deposit or if it was already spent. The balance of the the Jetton can be updated via a new deposit or it can be redeemed using the Jetton Note Secret.</Typography>
                </Stack>
            </Info>


            <Stack sx={{ mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <TextField sx={{ width: "80%" }} type="text" label="View Key (Commitment)" value={props.noteCommitment} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    props.setNoteCommitment(event.target.value);
                }}></TextField>
            </Stack>
            <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Typography component="h1" variant="h5">{props.jettonBalance} {props.jettonTicker}</Typography>
            </Stack>
            <Stack sx={{ mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Button onClick={async () => await props.fetchBalance(props.noteCommitment)} variant="contained">View Balance</Button>
            </Stack>

            <RouteFooter content="The Jetton Notes currently use tgBTC on Ton Testnet"></RouteFooter>
        </Paper>
    </Box >
}