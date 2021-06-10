import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import {
    useWeb3React,
} from "@web3-react/core";


const useStyles = makeStyles((theme) => ({
    mobileContainer: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
        justifyContent: 'space-evenly'
    },
}));

export default function MobileWalletInfo({ dittoBalance, xDittoBalance, exchangeRate, usdPrice }) {

    const classes = useStyles();
    const context = useWeb3React();
    const {
        library,
        chainId,
        account,
        activate,
        deactivate,
        active,
        error
    } = context;
    const dittoInUSD = parseFloat(usdPrice) * parseFloat(dittoBalance);
    const xDittoInUSD = (parseFloat(usdPrice) * parseFloat(exchangeRate)) * parseFloat(xDittoBalance);


    return (
        <Box className={classes.mobileContainer}>
            <Box textAlign='center'>
                <Typography color="primary" variant="body2">DITTO in wallet</Typography>
                {
                    account === undefined
                        ?
                        <Typography color="textPrimary" variant="caption" style={{ paddingTop: '10px' }}>{'...'}</Typography>
                        :
                        account === null
                            ?
                            <Typography color="textPrimary" variant="caption" style={{ paddingTop: '10px' }}>{None}</Typography>
                            :
                            <Box>
                                <Typography color="textPrimary" variant="caption" style={{ paddingTop: '10px' }}>{`${parseFloat(dittoBalance).toFixed(4)} DITTO`}</Typography>
                                <br />
                                <Typography color="textPrimary" variant="caption" style={{ paddingTop: '5px' }}>{`${dittoInUSD.toFixed(2)} USD`}</Typography>
                            </Box>
                }
            </Box>
            <Box textAlign='center'>
                <Typography color="primary" variant="body2">xDITTO in wallet</Typography>
                {
                    account === undefined
                        ?
                        <Typography color="textPrimary" variant="caption" style={{ paddingTop: '10px' }}>{'...'}</Typography>
                        :
                        account === null
                            ?
                            <Typography color="textPrimary" variant="caption" style={{ paddingTop: '10px' }}>{None}</Typography>
                            :
                            <Box>
                                <Typography color="textPrimary" variant="caption" style={{ paddingTop: '10px' }}>{`${parseFloat(xDittoBalance).toFixed(4)} xDITTO`}</Typography>
                                <br />
                                <Typography color="textPrimary" variant="caption" style={{ paddingTop: '5px' }}>{`${xDittoInUSD.toFixed(2)} USD`}</Typography>
                            </Box>


                }
            </Box>
            <Box textAlign='center'>
                <Typography color="primary" variant="body2">Exchange rate</Typography>
                {
                    account === undefined
                        ?
                        <Typography color="textPrimary" variant="caption" style={{ paddingTop: '10px' }}>{'...'}</Typography>
                        :
                        account === null
                            ?
                            <Typography color="textPrimary" variant="caption" style={{ paddingTop: '10px' }}>{Unavailable}</Typography>
                            :
                            <Box>
                                <Typography color="textPrimary" variant="caption" style={{ paddingTop: '10px' }}>{`1 xDITTO`}</Typography>
                                <br />
                                <Typography color="textPrimary" variant="caption" style={{ paddingTop: '2px' }}>{`${parseFloat(exchangeRate).toFixed(4)} DITTO`}</Typography>
                            </Box>
                }
            </Box>
        </Box>
    );
};
