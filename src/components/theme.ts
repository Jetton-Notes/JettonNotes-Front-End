import { createTheme } from "@mui/material";

export default function getTheme() {
    let theme = createTheme({
        palette: {
            primary: {
                light: '#efe9d1',
                // main: '#2d5840',
                main: '#6096e6',

                dark: '#006db3',
            },
        },
        typography: {
            h5: {
                fontWeight: 500,
                fontSize: 26,
                letterSpacing: 0.5,
            },
        },
        shape: {
            borderRadius: 8,
        },
        components: {
            MuiTab: {
                defaultProps: {
                    disableRipple: true,
                },
            },
        },
        mixins: {
            toolbar: {
                minHeight: 48,
            },
        },
    });

    theme = {
        ...theme,
        components: {
            MuiDrawer: {
                styleOverrides: {
                    paper: {
                        backgroundColor: '#081627',
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'none'
                    },
                    contained: {
                        boxShadow: 'none',
                        '&:active': {
                            boxShadow: 'none',
                        },
                        "&:hover": {
                            backgroundColor: '#b2ccf3'
                        }
                    },
                },
            },
            MuiTabs: {
                styleOverrides: {
                    root: {
                        marginLeft: theme.spacing(1),
                    },
                    indicator: {
                        height: 3,
                        borderTopLeftRadius: 3,
                        borderTopRightRadius: 3,
                        backgroundColor: theme.palette.common.white,
                    },
                },
            },
            MuiTab: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                        margin: '0 16px',
                        minWidth: 0,
                        padding: 0,
                        [theme.breakpoints.up('md')]: {
                            padding: 0,
                            minWidth: 0,
                        },
                    },
                },
            },
            MuiIconButton: {
                styleOverrides: {
                    root: {
                        padding: theme.spacing(1),
                    },
                },
            },
            MuiTooltip: {
                styleOverrides: {
                    tooltip: {
                        borderRadius: 4,
                    },
                },
            },
            MuiDivider: {
                styleOverrides: {
                    root: {
                        backgroundColor: 'rgb(255,255,255,0.15)',
                    },
                },
            },
            MuiListItemButton: {
                styleOverrides: {
                    root: {
                        '&.Mui-selected': {
                            color: '#b2ccf3',
                        },
                    },
                },
            },
            MuiListItemText: {
                styleOverrides: {
                    primary: {
                        fontSize: 14,
                        fontWeight: theme.typography.fontWeightMedium,
                    },
                },
            },
            MuiListItemIcon: {
                styleOverrides: {
                    root: {
                        color: 'inherit',
                        minWidth: 'auto',
                        marginRight: theme.spacing(2),
                        '& svg': {
                            fontSize: 20,
                        },
                    },
                },
            },
            MuiAvatar: {
                styleOverrides: {
                    root: {
                        width: 32,
                        height: 32,
                    },
                },
            },
        },

    };
    return theme;
}