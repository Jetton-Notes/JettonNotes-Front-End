///SHOW THE MASTER KEY
import { Button, Box, Typography, Paper, TextField, Stack } from "@mui/material";
import React from "react";
import { decryptData, Status } from "../../../crypto/encrypt";
import { getAccountKey } from "../../../storage";

export type ShowMasterkeyProps = {
    password: string,
    openSnackbar: (msg: string) => void
}

export default function ShowMasterkey(props: ShowMasterkeyProps) {
    const [masterKey, setMasterkey] = React.useState("***********************************************")
    const [enteredPassword, setEnteredPassword] = React.useState("");

    async function showMasterkey() {
        if (props.password !== enteredPassword) {
            props.openSnackbar("Invalid password")
        }

        const accountKeyfound = await getAccountKey();

        const masterKeyData = await decryptData(accountKeyfound.cipherText.buffer, enteredPassword);
        if (masterKeyData.status === Status.Success) {
            setMasterkey(masterKeyData.data);

        } else {
            props.openSnackbar("Unable to decrypt account key")
        }
    }

    return <Box>
        <Paper sx={{ maxWidth: 936, margin: "auto", overflow: "hidden", mt: "10px" }}>

            <Stack sx={{ paddingLeft: "30px", paddingRight: "30px", display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <pre style={{ overflow: "scroll" }}>{masterKey}</pre>
            </Stack>



            <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <TextField type="password" label="Password" value={enteredPassword} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setEnteredPassword(event.target.value);
                }}></TextField>
            </Stack>

            <Stack sx={{ mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Button onClick={async () => { await showMasterkey() }} variant="contained">Reveal Key</Button>
            </Stack>

        </Paper>
    </Box >
}