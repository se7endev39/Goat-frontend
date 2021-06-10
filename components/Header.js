

import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import Brightness3Icon from '@material-ui/icons/Brightness3';
import IconButton from '@material-ui/core/IconButton';

import Image from 'next/image'


import {
    useWeb3React,
} from "@web3-react/core";

import { useDarkmode } from '../lib/ui-context';

import {
    injected,
} from '../lib/connectors'


const useStyles = makeStyles((theme) => ({
    desktopContainer: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        }
    },
    mobileContainer: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    }
}));

export default function Header({ setActivatingConnector, getErrorMessage }) {
    const darkmodeContext = useDarkmode();

    const classes = useStyles();
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

    return (
        <div>
            <Box className={classes.desktopContainer} justifyContent="center" alignItems="center">
                <Image
                    src="/images/ditto.png"
                    alt="Main Ditto logo mascot"
                    width={'100%'}
                    height={'100%'}
                />
                <Box paddingLeft="20px">
                    <Typography variant="h3" color="primary">Butter ($BUTT)</Typography>
                </Box>
            </Box>
            <Box className={classes.mobileContainer} paddingTop={'2%'} justifyContent="center" alignItems="center">
                <Image
                    src="/images/ditto.png"
                    alt="Main Ditto logo mascot"
                    width={'75%'}
                    height={'75%'}
                />
                <Box paddingLeft="5px">
                    <Typography variant="h3" color="primary">Ditto</Typography>
                </Box>
            </Box>
            <Box className={classes.mobileContainer} position="absolute" top="3.5%" right="5%" >
                <IconButton color="primary" aria-label="dark mode toggle" type="button" onClick={() => { darkmodeContext.setDarkmode(!darkmodeContext.darkmode); }}>
                    {darkmodeContext.darkmode ? <Brightness7Icon /> : <Brightness3Icon />}
                </IconButton>
            </Box>

            <Box className={classes.mobileContainer} alignItems='center' justifyContent='center' paddingTop="10px">
                <Box display="flex" flexDirection="row" alignItems='center' justifyContent="center" width={'100%'}>
                    <Typography variant="caption" color="textPrimary">
                        {
                            account === undefined
                                ?
                                "..."
                                :
                                account === null
                                    ?
                                    "None"
                                    :
                                    `${account.substring(0, 6)}...${account.substring(
                                        account.length - 4
                                    )}`
                        }
                    </Typography>

                    {(active || error) ? (
                        <Button
                            color="primary"
                            disableElevation
                            onClick={() => {
                                deactivate();
                            }}
                        >
                            Disconnect wallet
                        </Button>

                    ) :
                        <Button
                            color="primary"
                            disableElevation
                            onClick={() => {
                                setActivatingConnector(injected);
                                activate(injected);
                            }}
                        >
                            Connect wallet
                        </Button>
                    }
                </Box>

            </Box>
            <Box className={classes.mobileContainer} justifyContent='center'>
                {!!error && (
                    <Typography color="textPrimary" style={{ marginTop: "0.5rem", marginBottom: "0", textAlign: 'center', fontSize: "16px" }}>
                        {getErrorMessage(error)}
                    </Typography>
                )}
            </Box>

            <Box className={classes.desktopContainer} position="absolute" top="5%" right="5%" display="flex" flexDirection="column" width={'25%'}>
                <Box display="flex" flexDirection="row" alignItems='center' justifyContent="space-evenly">
                    <Typography variant="caption" color="textPrimary">
                        {
                            account === undefined
                                ?
                                "..."
                                :
                                account === null
                                    ?
                                    "None"
                                    :
                                    `${account.substring(0, 6)}...${account.substring(
                                        account.length - 4
                                    )}`
                        }
                    </Typography>

                    {(active || error) ? (
                        <Button
                            color="primary"
                            disableElevation
                            onClick={() => {
                                deactivate();
                            }}
                        >
                            Disconnect wallet
                        </Button>

                    ) :
                        <Button
                            color="primary"
                            disableElevation
                            onClick={() => {
                                setActivatingConnector(injected);
                                activate(injected);
                            }}
                        >
                            Connect wallet
                        </Button>
                    }


                    <IconButton color="primary" aria-label="dark mode toggle" type="button" onClick={() => { darkmodeContext.setDarkmode(!darkmodeContext.darkmode); }}>
                        {darkmodeContext.darkmode ? <Brightness7Icon /> : <Brightness3Icon />}
                    </IconButton>

                </Box>
                <Box>
                    {!!error && (
                        <Typography color="textPrimary" style={{ marginTop: "0.5rem", marginBottom: "0", textAlign: 'center', fontSize: "16px" }}>
                            {getErrorMessage(error)}
                        </Typography>
                    )}
                </Box>

            </Box>
        </div>


    );
};
