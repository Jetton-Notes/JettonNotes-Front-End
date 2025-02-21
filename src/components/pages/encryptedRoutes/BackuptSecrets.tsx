import { Button, Box, Typography, Paper, TextField, Stack, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { RouteFooter } from "../../Footer";
import React from "react";
import { deposit, parseNote, toNoteHex } from "../../../crypto/cryptonotes";
import { encryptData, Status } from "../../../crypto/encrypt";
import { sha512 } from "ton-crypto";
import { saveAccountIdentifier, saveAccountKey } from "../../../storage";
import { EncryptedRoutes } from "../../Base";


export type BackupSecretsPageProps = {
    password: string,
    setPassword: (to: string) => void,
    navigate: (to: EncryptedRoutes) => void
}

export function BackupSecrets(props: BackupSecretsPageProps) {
    const [masterNote, setMasterNote] = React.useState("");
    const [copiedSecret, setCopiedSecret] = React.useState(false);

    React.useEffect(() => {
        const getMasterNote = async () => {
            const noteString = await deposit({ currency: "masterkey" });
            setMasterNote(noteString);
        }
        getMasterNote()
    }, [])

    async function masterKeySaved() {
        //Here I need to encrypt the masterkey, save it to indexed db and then navigate to an new page
        const identifierBuff = await sha512(masterNote);
        const account_id = toNoteHex(identifierBuff);
        const ciphertext = await encryptData(masterNote, props.password);
        if (ciphertext.status === Status.Failure) {
            console.error("unable to encrypt")
            // Unable to encrypt, should not occur
            return;
        }

        await saveAccountKey(ciphertext.data).then(async () => {
            await saveAccountIdentifier(account_id).then(async () => {
                props.navigate(EncryptedRoutes.ENTERPASSWORD);
                props.setPassword("");
            })
        })
    }


    return <Box >
        <Paper sx={{ maxWidth: 936, margin: "auto", overflow: "hidden", mt: "10px" }}>
            <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Typography component="h1" variant="h4">Jetton Notes</Typography>
            </Stack>
            <Stack sx={{ padding: "30px" }} direction={"row"} justifyContent="center">
                <Typography component="p" variant="subtitle1">You can see the master Note here. Copy it. This note is used to create hierarchical deterministic accounts.</Typography>
            </Stack>

            <pre style={{ overflow: "auto", maxWidth: "80%", margin: "0 auto" }}>{masterNote}</pre>

            <Stack sx={{ mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <FormGroup>
                    <FormControlLabel label="I have backed up the Master Key" control={<Checkbox checked={copiedSecret} onChange={
                        (event: React.ChangeEvent<HTMLInputElement>) => {
                            setCopiedSecret(event.target.checked);
                        }
                    }></Checkbox>}></FormControlLabel>
                </FormGroup>
            </Stack>
            <Stack sx={{ mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Button disabled={!copiedSecret} variant="contained" onClick={async () => { await masterKeySaved() }}>Continue</Button>                </Stack>
            <RouteFooter content="The secret is used for powering the account abstraction. Keep it confidential. If you lose your secret, there is no way to recover the wallet!" ></RouteFooter>
            <Stack sx={{ mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Button variant="outlined" onClick={() => { props.navigate(EncryptedRoutes.NEWACCOUNT) }}>Go Back</Button>
            </Stack>
        </Paper >
    </Box >
}

