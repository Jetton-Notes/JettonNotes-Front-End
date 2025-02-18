import { Box, Typography, Paper, Stack } from "@mui/material";

export function SplashScreenRoute() {
    return <Box sx={{ height: "100%" }} >
        <Paper sx={{ height: "100%", maxWidth: 936, margin: "auto", overflow: "hidden", mt: "10px" }}>
            <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Typography component="h1" variant="h4">Jetton Notes</Typography>

            </Stack>
            <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
            </Stack>
        </Paper>
    </Box >
}