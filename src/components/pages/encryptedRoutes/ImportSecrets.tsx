import { Button, Box, Typography, Paper, TextField, Stack } from "@mui/material";
import { RouteFooter } from "../../Footer";
import React from "react";
import { parseNote, toNoteHex } from "../../../crypto/cryptonotes";
import { sha512 } from "ton-crypto";
import { encryptData, Status } from "../../../crypto/encrypt";
import { saveAccountIdentifier, saveAccountKey } from "../../../storage";
import { EncryptedRoutes } from "../../Base";


export type ImportSecretsPageProps = {
    password: string,
    setPassword: (to: string) => void,
    openSnackbar: (msg: string) => void,
    navigate: (to: EncryptedRoutes) => void
}

export function ImportSecrets(props: ImportSecretsPageProps) {
    const [masterNote, setMasterNote] = React.useState("");

    async function CheckKeyAndProceed() {
        try {
            const parsedNote = await parseNote(masterNote);

            if (parsedNote.currency !== "masterkey") {
                throw new Error("Invalid note")
            }

            const identifierBuff = await sha512(masterNote);
            const account_id = toNoteHex(identifierBuff);
            const ciphertext = await encryptData(masterNote, props.password);
            if (ciphertext.status === Status.Failure) {
                console.error("Unable to encrypt")
                return;
            }

            await saveAccountKey(ciphertext.data).then(async () => {
                await saveAccountIdentifier(account_id).then(async () => {
                    props.navigate(EncryptedRoutes.ENTERPASSWORD);
                    props.setPassword("");
                })
            })



        } catch (err) {
            console.log(err);
            props.openSnackbar("Unable to import key");
            return;
        }


    }


    return <Box >
        <Paper sx={{ maxWidth: 936, margin: "auto", overflow: "hidden", mt: "10px" }}>
            <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Typography component="h1" variant="h4">Jetton Notes</Typography>
            </Stack>
            <Stack sx={{ padding: "30px" }} direction={"row"} justifyContent="center">
                <Typography component="p" variant="subtitle1">Enter your master note to import an account</Typography>
            </Stack>

            <TextField sx={{ width: "90%", margin: "10px", marginRight: "20px" }} type="text" label="Master Key" value={masterNote} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setMasterNote(event.target.value);
            }}></TextField>

            <Stack sx={{ mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Button variant="contained" onClick={() => { CheckKeyAndProceed() }}>Continue</Button>                </Stack>
            <RouteFooter content="The secret is used for withdrawing the value. Keep it confidential. If you lose your secret, there is no way to recover the deposit!" ></RouteFooter>
        </Paper >
    </Box >
}

