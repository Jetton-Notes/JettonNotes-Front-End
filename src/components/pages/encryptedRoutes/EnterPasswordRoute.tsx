import { Button, Box, Typography, Paper, TextField, Stack } from "@mui/material";
import { RouteFooter } from "../../Footer";

export type EnterPasswordProps = {
    password: string,
    setPassword: (to: string) => void,
    decryptAccount: () => Promise<void>,
    goToCreateNewAccount: () => void
}

export function EnterPasswordRoute(props: EnterPasswordProps) {
    return <Box >
        <Paper sx={{ maxWidth: 936, margin: "auto", overflow: "hidden", mt: "10px" }}>
            <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Typography component="h1" variant="h4">Jetton Notes</Typography>
            </Stack>
            <Stack sx={{ padding: "30px" }} direction={"row"} justifyContent="center">
                <Typography component="p" variant="subtitle1">Enter your password to decrypt the account</Typography>
            </Stack>


            <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <TextField type="password" label="Password" value={props.password} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    props.setPassword(event.target.value);
                }}></TextField>
            </Stack>

            <Stack sx={{ mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Button onClick={async () => await props.decryptAccount()} variant="contained">Decrypt Account</Button>
            </Stack>


            <Stack sx={{ mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Button onClick={() => { props.goToCreateNewAccount() }} variant="contained">Create New Account</Button>
            </Stack>


            <RouteFooter content="The Jetton Notes currently use tgBTC on Ton Testnet"></RouteFooter>
        </Paper>
    </Box >

}