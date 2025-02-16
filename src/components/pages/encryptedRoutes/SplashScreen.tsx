import { Box, Typography, Paper, Stack } from "@mui/material";


export function SplashScreenRoute() {
    return <Box >
        <Paper sx={{ maxWidth: 936, margin: "auto", overflow: "hidden", mt: "10px" }}>
            <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Typography component="h1" variant="h4">Welcome to Jetton Notes</Typography>
            </Stack>
        </Paper>
    </Box >

}