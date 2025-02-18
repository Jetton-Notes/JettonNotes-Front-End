import { Accordion, AccordionDetails, AccordionSummary, Typography, Stack } from "@mui/material"
import { ReactNode } from "react"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


export type InfoProps = {
    children: ReactNode,
    summary: string
}

export default function Info(props: InfoProps) {
    return <Stack sx={{ mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}>
        <Accordion sx={{ width: "80%" }}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
            >
                <Typography component="span" sx={{ color: "gray" }}>{props.summary}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {props.children}
            </AccordionDetails>
        </Accordion>
    </Stack>
}