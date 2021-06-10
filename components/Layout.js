import React from 'react';

import Box from '@material-ui/core/Box';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';

import {
    useWeb3React,
    UnsupportedChainIdError
} from "@web3-react/core";
import {
    NoEthereumProviderError,
    UserRejectedRequestError as UserRejectedRequestErrorInjected
} from "@web3-react/injected-connector";

import { useDarkmode } from '../lib/ui-context';
import { useEagerConnect, useInactiveListener } from "../lib/injected-connector-hooks";

import { lightTheme, darkTheme } from '../theme';

import Header from './Header';
import Footer from './Footer';



function getErrorMessage(error) {
    if (error instanceof NoEthereumProviderError) {
        return "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.";
    } else if (error instanceof UnsupportedChainIdError) {
        return "You're connected to an unsupported network.";
    } else if (
        error instanceof UserRejectedRequestErrorInjected ||
        error instanceof UserRejectedRequestErrorWalletConnect ||
        error instanceof UserRejectedRequestErrorFrame
    ) {
        return "Please authorize this website to access your Binance Smart Chain account.";
    } else {
        console.error(error);
        return "An unknown error occurred. Check the console for more details.";
    }
}

const useStyles = makeStyles((theme) => ({
    bodyContainer: {
        [theme.breakpoints.up('md')]: {
            height: "100vh"
        }
    },
}));


export default function Layout({ children }) {
    const classes = useStyles();
    const darkmodeContext = useDarkmode();
    const theme = darkmodeContext.darkmode ? darkTheme : lightTheme;

    const context = useWeb3React();
    const {
        connector,
        library,
        chainId,
        account,
        activate,
        deactivate,
        active,
        error
    } = context;

    const [activatingConnector, setActivatingConnector] = React.useState();
    React.useEffect(() => {
        console.log('running')
        if (activatingConnector && activatingConnector === connector) {
            setActivatingConnector(undefined);
        }
    }, [activatingConnector, connector]);

    // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
    const triedEager = useEagerConnect();
    // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
    useInactiveListener(!triedEager || !!activatingConnector);

    return (
        <ThemeProvider theme={theme}>
            <Box className={classes.bodyContainer} bgcolor="background.default">
                <Header setActivatingConnector={setActivatingConnector} getErrorMessage={getErrorMessage} />
                {children}
                <Footer />
            </Box>
        </ThemeProvider>
    );
}
