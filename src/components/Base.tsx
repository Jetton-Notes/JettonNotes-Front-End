import { Box, CssBaseline, IconButton, Snackbar, ThemeProvider } from "@mui/material";
import * as React from "react";
import CloseIcon from '@mui/icons-material/Close';
import getTheme from "./theme";
import ResponsiveAppBar from "./AppBar";
import { deposit, parseNote, toNoteHex } from "../crypto/cryptonotes";
import { NoteBalanceRoute } from "./pages/decryptedRoutes/NoteBalancePage";
import { CreateRoute } from "./pages/decryptedRoutes/CreateNoteRoute";
import { RedeemRoute } from "./pages/decryptedRoutes/RedeemRoute";
import { PayToRoute } from "./pages/decryptedRoutes/PayToRoute";
import { ShowNoteSecret } from "./pages/decryptedRoutes/ShowNoteSecret";
import { SplashScreenRoute } from "./pages/encryptedRoutes/SplashScreen";
import { EnterPasswordRoute } from "./pages/encryptedRoutes/EnterPasswordRoute";
import { NewAccountRoute } from "./pages/encryptedRoutes/NewAccountRoute";
import { BackupSecrets } from "./pages/encryptedRoutes/BackuptSecrets";
import { ImportSecrets } from "./pages/encryptedRoutes/ImportSecrets";
import { getAccountIdentifier, getAccountKey } from "../storage";
import { decryptData, Status } from "../crypto/encrypt";
import { HdWallet } from "./pages/decryptedRoutes/HdWallet";
import { SPLASHSCREENTIME } from "../constants";
import { HdWalletUtxos } from "./pages/decryptedRoutes/HDWalletUtxos";
import { useTonClient } from "../hooks/useTonClient";
import { useTonConnect } from "../hooks/useTonConnect";
import { CHAIN } from "@tonconnect/protocol";
import { depositJettons, getCommitmentBalance, getDepositWithdrawContract, getJettonWalletClient } from "../actions/depositJettons";
import { Address, toNano } from "@ton/core";

const theme = getTheme();

export enum DecryptedRoutes {
    CREATE = "Crypto Note",
    PAYTO = "Pay to Note",
    REDEEM = "Redeem Note",
    NOTEBALANCE = "Note Balance",
    SHOWNOTESECRET = "SHOWNOTESECRET",
    HDWALLET = "HD Wallet",
    HDWALLETUTXOS = "HDWALLETUTXOS"
}

export enum EncryptedRoutes {
    SPLASHSCREEN = "SPLASHSCREEN",
    ENTERPASSWORD = "ENTERPASSWORD",
    NEWACCOUNT = "NEWACCOUNT",
    BACKUPSECRETS = "BACKUPSECRETS",
    IMPORTSECRETS = "IMPORTSECRETS"
}

export default function Base() {
    const { wallet, sender, network } = useTonConnect();
    const { client } = useTonClient();


    const [hideMenu, setHideMenu] = React.useState(true);

    const [password, setPassword] = React.useState("");
    const [accountId, setAccountId] = React.useState("");
    const [decryptedAccount, setDecryptedAccmount] = React.useState();
    const [showDecryptedRoutes, setShowDecryptedRoutes] = React.useState(false);

    const [currentDecryptedRoute, setCurrentDecryptedRoute] = React.useState(DecryptedRoutes.CREATE);
    const [loggedOutRoutes, setLoggedOutRoutes] = React.useState(EncryptedRoutes.SPLASHSCREEN);


    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState("");

    //The note string that can be redeemed
    const [noteString, setNoteString] = React.useState("");

    const [depositAmount, setDepositAmount] = React.useState("");

    const [noteCommitment, setNoteCommitment] = React.useState("");

    const [jettonBalance, setJettonBalance] = React.useState("0");
    const [jettonTicker, setJettonTicker] = React.useState("tgBTC");

    React.useEffect(() => {
        setTimeout(async () => {
            const account_id = await getAccountIdentifier();

            if (account_id.success) {
                //Found an account id, so there should be an account too...
                setLoggedOutRoutes(EncryptedRoutes.ENTERPASSWORD);
            } else {
                //Account id not found , there is no account
                setLoggedOutRoutes(EncryptedRoutes.NEWACCOUNT);
            }
        }, SPLASHSCREENTIME)
    }, [])



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



    const onNotify = (msg: string, type: string) => {

        openSnackbar(msg);
    }

    const createNoteClicked = async () => {
        const noteString = await deposit({ currency: "tgBTC" });
        setNoteString(noteString);
        setCurrentDecryptedRoute(DecryptedRoutes.SHOWNOTESECRET)
    }

    const decryptAccount = async () => {
        const accountKeyFound = await getAccountKey();
        if (accountKeyFound.success) {
            const data = await decryptData(accountKeyFound.cipherText.buffer, password);
            if (data.status === Status.Failure) {
                openSnackbar("Invalid password unable to decrypt account!")
                return;
            } else {
                console.log(data);
            }

        } else {
            openSnackbar("Account not found");
            return;
        }
        const account_id = await getAccountIdentifier();
        setAccountId(account_id.res)
        setShowDecryptedRoutes(true);
        setHideMenu(false);
    }

    const getCreateAccountRoutes = () => {
        switch (loggedOutRoutes) {
            case EncryptedRoutes.SPLASHSCREEN:
                return <SplashScreenRoute></SplashScreenRoute>
            case EncryptedRoutes.ENTERPASSWORD:
                return <EnterPasswordRoute
                    password={password}
                    setPassword={setPassword}
                    decryptAccount={decryptAccount}
                    goToCreateNewAccount={() => {
                        setLoggedOutRoutes(EncryptedRoutes.NEWACCOUNT)
                    }}
                ></EnterPasswordRoute>
            case EncryptedRoutes.NEWACCOUNT:
                return <NewAccountRoute
                    setPassword={setPassword}
                    goToNextAccount={(to: EncryptedRoutes) => setLoggedOutRoutes(to)}
                    openSnackbar={openSnackbar}
                ></NewAccountRoute>
            case EncryptedRoutes.BACKUPSECRETS:
                return <BackupSecrets setPassword={setPassword} navigate={setLoggedOutRoutes} password={password}></BackupSecrets>
            case EncryptedRoutes.IMPORTSECRETS:
                return <ImportSecrets navigate={setLoggedOutRoutes} setPassword={setPassword} password={password} openSnackbar={openSnackbar}></ImportSecrets>
            default:
                <div>invalid route</div>
        }
    }

    const depositValueClicked = async (_depositAmount: string, commitment: string) => {

        if (!wallet) {
            openSnackbar("Wallet is not connected");
            return;
        }

        if (!client) {
            openSnackbar("Unable to connect");
            return;
        }

        if (network !== CHAIN.TESTNET) {
            openSnackbar("Only testnet is supported");
            return;
        }

        if (parseFloat(_depositAmount) <= 0) {
            openSnackbar("Invalid deposit amount");
            return;
        }

        try {
            if (BigInt(commitment) <= 0) {
                openSnackbar("Invalid commitment");
                return;
            }
        } catch (err) {
            openSnackbar("Invalid commitment entered");
            return;
        }

        const jettonWalletClient = await getJettonWalletClient(client, wallet);

        console.log(jettonWalletClient);

        const depositWithdrawContract = getDepositWithdrawContract(client);




        //TODO: now get the jetton wallet of the connected wallet

        //TODO: then check the jetton balance of the wallet

        //TODO: then do the depoist via jetton

        console.log(_depositAmount)
        const res = await depositJettons(
            BigInt(commitment),
            toNano(_depositAmount),
            jettonWalletClient,
            //@ts-ignore
            sender,
            depositWithdrawContract,
            Address.parse(wallet)
        );

        console.log(res);
    }


    async function fetchBalance(_commitment: string) {
        if (!client) {
            openSnackbar("Unable to connect. Connect your wallet.");
            return;
        }

        const balance = await getCommitmentBalance(client, BigInt(_commitment));
        console.log(balance);
    }



    const getDecryptedRoutes = () => {
        switch (currentDecryptedRoute) {
            case DecryptedRoutes.CREATE:
                return <CreateRoute
                    onNotify={onNotify}
                    createNoteClicked={createNoteClicked}
                ></CreateRoute>
            case DecryptedRoutes.PAYTO:
                return <PayToRoute depositClicked={depositValueClicked} depositAmount={depositAmount} setDepositAmount={setDepositAmount} noteCommitment={noteCommitment} setNoteCommitment={setNoteCommitment}></PayToRoute>
            case DecryptedRoutes.REDEEM:
                return <RedeemRoute noteString={noteString} setNoteString={setNoteString}></RedeemRoute>
            case DecryptedRoutes.NOTEBALANCE:
                return <NoteBalanceRoute fetchBalance={fetchBalance} jettonBalance={jettonBalance} jettonTicker={jettonTicker} noteCommitment={noteCommitment} setNoteCommitment={setNoteCommitment}></NoteBalanceRoute>
            case DecryptedRoutes.SHOWNOTESECRET:
                return <ShowNoteSecret setNoteCommitment={setNoteCommitment} navigateToDeposit={() => setCurrentDecryptedRoute(DecryptedRoutes.PAYTO)} noteString={noteString}></ShowNoteSecret>
            case DecryptedRoutes.HDWALLET:
                return <HdWallet showUTXOsPage={() => setCurrentDecryptedRoute(DecryptedRoutes.HDWALLETUTXOS)} account_id={accountId}></HdWallet>
            case DecryptedRoutes.HDWALLETUTXOS:
                return <HdWalletUtxos account_id={accountId}></HdWalletUtxos>
            default:
                return <div>Invalid route</div>
        }
    }

    const selectPage = (page: DecryptedRoutes) => {
        setDepositAmount("");
        setNoteCommitment("");
        setCurrentDecryptedRoute(page)
    }

    const onLogout = () => {
        setHideMenu(true);
        setLoggedOutRoutes(EncryptedRoutes.ENTERPASSWORD);
        setPassword("");
        setShowDecryptedRoutes(false);
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
                <ResponsiveAppBar onLogout={onLogout} hideMenu={hideMenu} selectPage={selectPage}></ResponsiveAppBar>
                {showDecryptedRoutes ? getDecryptedRoutes() : getCreateAccountRoutes()}
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



