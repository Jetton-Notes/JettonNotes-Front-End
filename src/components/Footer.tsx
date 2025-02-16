import { Stack } from "@mui/material";

export function RouteFooter(props: { content: string }) {

    return <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "center", p: 2 }}>
        <p>{props.content}</p>
    </Stack>
}
