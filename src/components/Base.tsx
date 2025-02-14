import { Button, Box, Typography, CssBaseline, IconButton, Snackbar, ThemeProvider, Paper, TextField, Stack } from "@mui/material";
import * as React from "react";
import CloseIcon from '@mui/icons-material/Close';
import getTheme from "./theme";
import { useTonConnect } from "../hooks/useTonConnect";
import { TonConnectButton } from "@tonconnect/ui-react";
import { CHAIN } from "@tonconnect/protocol";
import ResponsiveAppBar from "./AppBar";

const theme = getTheme();

export enum Routes {
    CREATE = "CREATE",
    PAYTO = "PAYTO",
    REDEEM = "REDEEM",
    NOTEBALANCE = "NOTEBALANCE"
}


export default function Base() {

    const [currentRoute, setCurrentRoute] = React.useState(Routes.CREATE);

    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState("");

    //The note string that can be redeemed
    const [noteString, setNoteString] = React.useState("");

    const [depositAmount, setDepositAmount] = React.useState("");

    const [noteCommitment, setNoteCommitment] = React.useState("");

    const [jettonBalance, setJettonBalance] = React.useState("0");
    const [jettonTicker, setJettonTicker] = React.useState("tgBTC");

    const openSnackbar = (msg: string) => {
        setSnackbarOpen(true);
        setSnackbarMessage(msg);
    }

    const closeSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    }






    const getRoutes = () => {
        switch (currentRoute) {
            case Routes.CREATE:
                return <CreateRoute depositAmount={depositAmount} setDepositAmount={setDepositAmount}></CreateRoute>
            case Routes.PAYTO:
                return <PayToRoute depositAmount={depositAmount} setDepositAmount={setDepositAmount} noteCommitment={noteCommitment} setNoteCommitment={setNoteCommitment}></PayToRoute>
            case Routes.REDEEM:
                return <RedeemRoute noteString={noteString} setNoteString={setNoteString}></RedeemRoute>
            case Routes.NOTEBALANCE:
                return <NoteBalanceRoute jettonBalance={jettonBalance} jettonTicker={jettonTicker} noteCommitment={noteCommitment} setNoteCommitment={setNoteCommitment}></NoteBalanceRoute>
            default:
                return <div>Invalid route</div>
        }
    }

    const selectPage = (indx: number) => {
        setDepositAmount("");
        setNoteCommitment("");

        switch (indx) {
            case 0:
                setCurrentRoute(Routes.CREATE);
                break;
            case 1:
                setCurrentRoute(Routes.PAYTO);
                break;
            case 2:
                setCurrentRoute(Routes.REDEEM);
                break;
            case 3:
                setCurrentRoute(Routes.NOTEBALANCE);
                break;
            default:
                break;
        }


    }

    const snackBarAction = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={closeSnackbar}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    return <ThemeProvider theme={theme}>
        <Box sx={{ display: "fle    x", minHeight: "100vh" }}>
            <CssBaseline />
            <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                <ResponsiveAppBar selectPage={selectPage}></ResponsiveAppBar>
                {getRoutes()}
            </Box>
        </Box>
        <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={closeSnackbar}
            message={snackbarMessage}
            action={snackBarAction}
        ></Snackbar>
    </ThemeProvider>
}


function RouteFooter() {

    return <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "center", p: 2 }}>
        <p>The Jetton Notes currently use tgBTC on Ton Testnet</p>
    </Stack>
}

export type CreateRouteProps = {
    depositAmount: string,
    setDepositAmount: (to: string) => void
}

function CreateRoute(props: CreateRouteProps) {
    return <Box >
        <Paper sx={{ maxWidth: 936, margin: "auto", overflow: "hidden", mt: "10px" }}>
            <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Typography component="h1" variant="h4">Jetton Notes</Typography>
            </Stack>
            <Stack sx={{ padding: "30px" }} direction={"row"} justifyContent="center">
                <Typography component="p" variant="subtitle1">Jetton Notes are financial claims for value that was deposited into a smart contract. Currently available for tgBTC. Enter the denomination, download the printable note and make a deposit to create one. It can be used to store value without a wallet or to transfer value.</Typography>
            </Stack>

            <Stack sx={{ mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <TextField type="number" label="Deposit Amount" value={props.depositAmount} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    props.setDepositAmount(event.target.value);
                }}></TextField>

            </Stack>

            <Stack sx={{ mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Button variant="contained">Create Note</Button>                </Stack>

            <RouteFooter></RouteFooter>

        </Paper>
    </Box >
}

export type PayToRoute = {
    depositAmount: string,
    setDepositAmount: (to: string) => void,
    noteCommitment: string,
    setNoteCommitment: (to: string) => void
}

function PayToRoute(props: PayToRoute) {
    return <Box >
        <Paper sx={{ maxWidth: 936, margin: "auto", overflow: "hidden", mt: "10px" }}>
            <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Typography component="h1" variant="h4">Pay to Jetton Notes</Typography>
            </Stack>
            <Stack sx={{ padding: "30px" }} direction={"row"} justifyContent="center">
                <Typography component="p" variant="subtitle1">Deposit Value into an existing Jetton Note. As long as the Jetton Note was not nullified, you can deposit more value into it. If you want to give somebody Jettons without you creating a new note, can remotely top up an existing Jetton Note.</Typography>
            </Stack>

            <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <TextField type="text" label="Note Commitment" value={props.noteCommitment} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    props.setNoteCommitment(event.target.value);
                }}></TextField>
            </Stack>

            <Stack sx={{ mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <TextField type="number" label="Deposit Amount" value={props.depositAmount} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    props.setDepositAmount(event.target.value);
                }}></TextField>

            </Stack>

            <Stack sx={{ mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Button variant="contained">Deposit</Button>
            </Stack>

            <RouteFooter></RouteFooter>
        </Paper>
    </Box >


}

export type RedeemRouteProps = {
    noteString: string,
    setNoteString: (to: string) => void
}

function RedeemRoute(props: RedeemRouteProps) {
    return <Box >
        <Paper sx={{ maxWidth: 936, margin: "auto", overflow: "hidden", mt: "10px" }}>
            <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Typography component="h1" variant="h4">Redeem Jetton Notes</Typography>
            </Stack>
            <Stack sx={{ padding: "30px" }} direction={"row"} justifyContent="center">
                <Typography component="p" variant="subtitle1">Enter the secret from your Jetton Note to withdraw the full balance to your wallet address. Once you have withdrawn the Jetton Note, it can't be topped up again.</Typography>
            </Stack>

            <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                    <TextField type="text" label="Jetton Note Secret" value={props.noteString} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        props.setNoteString(event.target.value);
                    }}></TextField>
                </Stack>
            </Stack>

            <Stack sx={{ mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Button variant="contained">Redeem Note</Button>                </Stack>


            <RouteFooter></RouteFooter>
        </Paper>
    </Box >
}

export type NoteBalanceRouteProps = {
    noteCommitment: string,
    setNoteCommitment: (to: string) => void,
    jettonBalance: string,
    jettonTicker: string
}

function NoteBalanceRoute(props: NoteBalanceRouteProps) {
    return <Box >
        <Paper sx={{ maxWidth: 936, margin: "auto", overflow: "hidden", mt: "10px" }}>
            <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Typography component="h1" variant="h4">Jetton Note Balance</Typography>
            </Stack>
            <Stack sx={{ padding: "30px" }} direction={"row"} justifyContent="center">
                <Typography component="p" variant="subtitle1">Check the balance of your Jetton Note using the Commitment. The balance of the the Jetton can be updated via a new deposit or it can be redeemed using the Jetton Note Secret.</Typography>
            </Stack>

            <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <div>{props.jettonBalance} {props.jettonTicker}</div>
            </Stack>

            <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <TextField type="text" label="Note Commitment" value={props.noteCommitment} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    props.setNoteCommitment(event.target.value);
                }}></TextField>
            </Stack>

            <Stack sx={{ mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Button variant="contained">View Balance</Button>
            </Stack>

            <RouteFooter></RouteFooter>
        </Paper>
    </Box >
}
