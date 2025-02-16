import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

const pages = ['Create Note', 'Pay to Note', 'Redeem Note', 'Note Balance'];

import { CHAIN, TonConnectButton } from "@tonconnect/ui-react";
import { useTonConnect } from '../hooks/useTonConnect';

export type ResponsiveAppBarProps = {
    selectPage: (index: number) => void,
    // TODO: hide the menu if the page is signup
    hideMenu: boolean
}


function ResponsiveAppBar(props: ResponsiveAppBarProps) {
    const { network } = useTonConnect();

    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const pageSelectClicked = (page: string) => () => {
        console.log("click")
        props.selectPage(pages.indexOf(page));
        setAnchorElNav(null);
    }

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>

                    {props.hideMenu ? null : (
                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{ display: { xs: 'block', md: 'none' } }}
                            >
                                {pages.map((page) => (
                                    <MenuItem key={page} onClick={pageSelectClicked(page)}>
                                        <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>)}
                    {props.hideMenu ? <Box></Box> :
                        (<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            {pages.map((page) => (
                                <Button
                                    key={page}
                                    onClick={pageSelectClicked(page)}
                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                >
                                    {page}
                                </Button>
                            ))}
                        </Box>)}
                    {props.hideMenu ? null :
                        <Box sx={{ flexGrow: 0, display: "flex", flexDirection: "row", gap: 1 }}>
                            <h4>{network
                                ? network === CHAIN.MAINNET
                                    ? "mainnet"
                                    : "testnet"
                                : "N/A"}</h4>
                            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                <TonConnectButton></TonConnectButton>
                            </Box>
                        </Box>}
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default ResponsiveAppBar;