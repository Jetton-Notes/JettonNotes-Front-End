import { Button, Box, Typography, Paper, TextField, Stack } from "@mui/material";
import { RouteFooter } from "../../Footer";
import Info from "../../styled/Info";

export type RedeemRouteProps = {
    noteString: string,
    setNoteString: (to: string) => void,
    redeemClicked: () => Promise<void>
}

export function RedeemRoute(props: RedeemRouteProps) {
    return <Box >
        <Paper sx={{ maxWidth: 936, margin: "auto", overflow: "hidden", mt: "10px" }}>
            <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Typography component="h1" variant="h4">Redeem Jetton Notes</Typography>
            </Stack>
            <Info summary="How the redemption works?">
                <Stack sx={{ padding: "30px" }} direction={"row"} justifyContent="center">
                    <Typography component="p" variant="subtitle1">Enter the secret from your Jetton Note to withdraw the full balance to your wallet address. Once you have withdrawn the Jetton Note, it can't be used again.</Typography>
                </Stack>
            </Info>

            <Stack sx={{ mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <TextField sx={{ width: "80% " }} type="text" label="Jetton Note Secret" value={props.noteString} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    props.setNoteString(event.target.value);
                }}></TextField>

            </Stack>

            <Stack sx={{ mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Button onClick={() => props.redeemClicked()} variant="contained">Redeem Note</Button></Stack>
            <RouteFooter content="The Jetton Notes currently use tgBTC on Ton Testnet"></RouteFooter>
        </Paper>
    </Box >
}

