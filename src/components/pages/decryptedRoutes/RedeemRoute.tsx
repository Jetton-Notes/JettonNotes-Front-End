import { Button, Box, Typography, Paper, TextField, Stack } from "@mui/material";
import { RouteFooter } from "../../Footer";
export type RedeemRouteProps = {
    noteString: string,
    setNoteString: (to: string) => void
}

export function RedeemRoute(props: RedeemRouteProps) {
    return <Box >
        <Paper sx={{ maxWidth: 936, margin: "auto", overflow: "hidden", mt: "10px" }}>
            <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Typography component="h1" variant="h4">Redeem Jetton Notes</Typography>
            </Stack>
            <Stack sx={{ padding: "30px" }} direction={"row"} justifyContent="center">
                <Typography component="p" variant="subtitle1">Enter the secret from your Jetton Note to withdraw the full balance to your wallet address. Once you have withdrawn the Jetton Note, it can't be topped up again.</Typography>
            </Stack>

            <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <TextField sx={{ width: "80% " }} type="text" label="Jetton Note Secret" value={props.noteString} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    props.setNoteString(event.target.value);
                }}></TextField>

            </Stack>

            <Stack sx={{ mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Button variant="contained">Redeem Note</Button></Stack>
            <RouteFooter content="The Jetton Notes currently use tgBTC on Ton Testnet"></RouteFooter>
        </Paper>
    </Box >
}

