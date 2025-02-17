import { Button, Box, Typography, Paper, TextField, Stack, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { RouteFooter } from "../../Footer";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export type HdWalletProps = {
    account_id: string
    showUTXOsPage: () => void
}

//THen when it's been copied the user can make the deposit
export function HdWallet(props: HdWalletProps) {
    return <Box >
        <Paper sx={{ maxWidth: 936, margin: "auto", overflow: "hidden", mt: "10px" }}>
            <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Typography component="h1" variant="h4">Wallet</Typography>
            </Stack>
            <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <pre>{props.account_id.slice(0, 6)}...{props.account_id.slice(props.account_id.length - 6, props.account_id.length)}</pre>
            </Stack>
            <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Button onClick={() => props.showUTXOsPage()}>UTXOs</Button>
            </Stack>
            <Stack sx={{ padding: "30px" }} direction={"row"} justifyContent="center">
                <Typography component="p" variant="subtitle1">This is a hierarchical deterministic wallet for Jetton Notes that allows you to transfer Jettons with account abstraction and pay for fees using the Jetton instead of Ton. You don't need a Ton wallet to transfer Jettons but inf the relayer is down it will fall back wallet transfers.</Typography>
            </Stack>
            <Stack sx={{ mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <TextField sx={{ width: "80%" }} type="text" label="Jetton Note to Spend (Note Secret)" onChange={(event: React.ChangeEvent<HTMLInputElement>) => {

                }}></TextField>

            </Stack>
            <Stack sx={{ mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <TextField sx={{ width: "80%" }} type="text" label="Transfer To Note (Commitment)" onChange={(event: React.ChangeEvent<HTMLInputElement>) => {

                }}></TextField>

            </Stack>
            <Stack sx={{ mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <TextField sx={{ width: "80%" }} type="number" label="Transfer Amount" onChange={(event: React.ChangeEvent<HTMLInputElement>) => {

                }}></TextField>
            </Stack>
            <Stack sx={{ mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Accordion sx={{ width: "80%" }}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                    >
                        <Typography component="span">The UTXO address for the unspent amount will be automatically assigned, But you can specify a custom note.</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Stack sx={{ mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                            <TextField sx={{ width: "80%" }} type="text" label="Unspent Transaction Output" onChange={(event: React.ChangeEvent<HTMLInputElement>) => {

                            }}></TextField>

                        </Stack>
                    </AccordionDetails>
                </Accordion>
            </Stack>
            <Stack sx={{ mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Button variant="contained">Transfer Value</Button>
            </Stack>


            <RouteFooter content="The transfer fee is 0 tgBTC"></RouteFooter>
        </Paper>
    </Box >
}