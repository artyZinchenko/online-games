import { createTheme } from '@mui/material';

export const customTheme = createTheme({
    typography: {
        allVariants: {
            color: '#ffffff',
        },
        body2: {
            color: '#262421',
        },
        h5: {
            color: '#262421',
        },
    },
    palette: {
        primary: {
            main: '#81b64c',
        },
        background: {
            default: '#312e2b',
        },
        text: {
            primary: '#ffffff',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    fontSize: '1em',
                    fontWeight: '600',
                    color: '#ffffff',
                },
            },
        },
        MuiModal: {
            styleOverrides: {
                root: {
                    color: '#262421',
                },
            },
        },
    },
});
