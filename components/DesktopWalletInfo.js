import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import {
    useWeb3React,
} from "@web3-react/core";


const useStyles = makeStyles((theme) => ({
    desktopContainer: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        }
    },
}));

export default function DesktopWalletInfo({ dittoBalance, xDittoBalance, exchangeRate, usdPrice }) {

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
        <Box className={classes.desktopContainer} position="absolute" top="25%" right="7.5%" display="flex" flexDirection="column" alignItems="center">
            <Typography color="primary" variant="h6">DITTO in wallet</Typography>
            {
                account === undefined
                    ?
                    <Typography color="textPrimary" variant="body2" style={{ paddingTop: '10px' }}>{'...'}</Typography>
                    :
                    account === null
                        ?
                        <Typography color="textPrimary" variant="body2" style={{ paddingTop: '10px' }}>{None}</Typography>
                        :
                        <Box textAlign='center'>
                            <Typography color="textPrimary" variant="body2" style={{ paddingTop: '10px' }}>{`${parseFloat(dittoBalance).toFixed(4)} DITTO`}</Typography>
                            <Typography color="textPrimary" variant="body2" style={{ paddingTop: '5px' }}>{`${dittoInUSD.toFixed(2)} USD`}</Typography>
                        </Box>

            }
            <Typography color="primary" variant="h6" style={{ paddingTop: '40px' }}>xDITTO in wallet</Typography>
            {
                account === undefined
                    ?
                    <Typography color="textPrimary" variant="body2" style={{ paddingTop: '10px' }}>{'...'}</Typography>
                    :
                    account === null
                        ?
                        <Typography color="textPrimary" variant="body2" style={{ paddingTop: '10px' }}>{None}</Typography>
                        :
                        <Box textAlign='center'>
                            <Typography color="textPrimary" variant="body2" style={{ paddingTop: '10px' }}>{`${parseFloat(xDittoBalance).toFixed(4)} xDITTO`}</Typography>
                            {/* <Typography color="textPrimary" variant="body2" style={{ paddingTop: '5px' }}>{`${xDittoInUSD.toFixed(2)} USD`}</Typography> */}
                        </Box>


            }
            <Typography color="primary" variant="h6" style={{ paddingTop: '40px' }}>1mile$BOTT = 1$GOAT</Typography>
            {
                account === undefined
                    ?
                    <Typography color="textPrimary" variant="body2" style={{ paddingTop: '10px' }}>{'...'}</Typography>
                    :
                    account === null
                        ?
                        <Typography color="textPrimary" variant="body2" style={{ paddingTop: '10px' }}>{Unavailable}</Typography>
                        :
                        <Typography color="textPrimary" variant="body2" style={{ paddingTop: '10px' }}>{`1 xDITTO = ${parseFloat(exchangeRate).toFixed(4)} DITTO`}</Typography>
            }
        </Box>
    );
};
