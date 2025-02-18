import { Button, Box, Typography, Paper, TextField, Stack, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { RouteFooter } from "../../Footer";
import React from "react";
import { parseNote, toNoteHex } from "../../../crypto/cryptonotes";


export type ShowNoteSecretPageProps = {
    noteString: string,
    navigateToDeposit: () => void,
    setNoteCommitment: (to: string) => void
}

export function ShowNoteSecret(props: ShowNoteSecretPageProps) {
    const [commitment, setCommitment] = React.useState("");
    const [copiedSecret, setCopiedSecret] = React.useState(false);

    React.useEffect(() => {
        const getCommitment = async () => {
            const parsedNote = await parseNote(props.noteString);
            setCommitment(toNoteHex(parsedNote.deposit.commitment));
        }

        getCommitment()
    })

    function clickDeposit() {
        props.navigateToDeposit();
        props.setNoteCommitment(commitment);
    }

    return <Box >
        <Paper sx={{ maxWidth: 936, margin: "auto", overflow: "hidden", mt: "10px" }}>
            <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Typography component="h1" variant="h4">Jetton Note Secrets</Typography>
            </Stack>
            <Stack sx={{ padding: "30px" }} direction={"row"} justifyContent="center">
                <Typography component="p" variant="subtitle1">You can see the Jetton Note here. Copy it.</Typography>
            </Stack>

            <Stack sx={{ mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <div>The Commitment, used for depositing and checking balance:</div>
            </Stack>
            <pre style={{ overflow: "auto", maxWidth: "80%", margin: "0 auto" }}>{commitment}</pre>

            <Stack sx={{ mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <div>Note Secret used for withdrawing the balance:</div>
            </Stack>
            <pre style={{ overflow: "auto", maxWidth: "80%", margin: "0 auto" }}>{props.noteString}</pre>
            <Stack sx={{ mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <FormGroup>
                    <FormControlLabel label="I have backed up the View Key and Secret" control={<Checkbox checked={copiedSecret} onChange={
                        (event: React.ChangeEvent<HTMLInputElement>) => {
                            setCopiedSecret(event.target.checked);
                        }
                    }></Checkbox>}></FormControlLabel>
                </FormGroup>
            </Stack>

            <Stack sx={{ mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Button disabled={!copiedSecret} variant="contained" onClick={() => clickDeposit()}>Go to Deposit</Button>                </Stack>
            <RouteFooter content="The secret is used for withdrawing the value. Keep it confidential. If you lose your secret, there is no way to recover the deposit!" ></RouteFooter>
        </Paper >
    </Box >
}

