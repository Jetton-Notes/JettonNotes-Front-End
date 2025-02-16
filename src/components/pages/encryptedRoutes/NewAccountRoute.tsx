import { Button, Box, Typography, Paper, TextField, Stack } from "@mui/material";
import { RouteFooter } from "../../Footer";

import React from "react";
import { EncryptedRoutes } from "../../Base";

export type NewAccountRouteProps = {
    setPassword: (to: string) => void,
    goToNextAccount: (to: EncryptedRoutes) => void,
    openSnackbar: (msg: string) => void
}

export function NewAccountRoute(props: NewAccountRouteProps) {
    const [passwordFirst, setPasswordFirst] = React.useState("");
    const [passwordSecond, setPasswordSecond] = React.useState("");

    const goto = (route: EncryptedRoutes) => () => {
        if (passwordFirst.length < 10) {
            props.openSnackbar("Password too short. 10 letters minimum.")
            return
        }
        if (passwordFirst !== passwordSecond) {
            props.openSnackbar("Passwords don't match")
            return;
        }

        props.goToNextAccount(route);
        props.setPassword(passwordFirst);
    }

    return <Box >
        <Paper sx={{ maxWidth: 936, margin: "auto", overflow: "hidden", mt: "10px" }}>
            <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Typography component="h1" variant="h4">New Account</Typography>
            </Stack>
            <Stack sx={{ padding: "30px" }} direction={"row"} justifyContent="center">
                <Typography component="p" variant="subtitle1">Enter a password to encrypt the account</Typography>
            </Stack>

            <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <TextField type="password" label="Password" value={passwordFirst} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setPasswordFirst(event.target.value);
                }}></TextField>
            </Stack>

            <Stack sx={{ marginTop: "10px", display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <TextField type="password" label="Password Again" value={passwordSecond} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setPasswordSecond(event.target.value);
                }}></TextField>
            </Stack>

            <Stack sx={{ mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Button onClick={() => goto(EncryptedRoutes.BACKUPSECRETS)()} variant="contained">Generate new account keys</Button>
            </Stack>

            <Stack sx={{ mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Button onClick={() => goto(EncryptedRoutes.IMPORTSECRETS)()} variant="contained">Import existing account</Button>
            </Stack>

            <RouteFooter content="The Jetton Notes currently use tgBTC on Ton Testnet"></RouteFooter>
        </Paper>
    </Box >

}