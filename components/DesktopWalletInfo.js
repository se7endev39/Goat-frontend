import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from "@material-ui/core/styles";
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
    jss4355:{
        width: '80%',
        margin: '16px 0px',
        padding: '4px 16px',
        boxShadow: '0px 4px 4px rgb(0 0 0 / 25%)',
        borderRadius: '50px',
        backgroundColor: '#132333'
    }
}));

const WhiteTextTypography = withStyles({
    root: {
      color: "#FFFFFF"
    }
  })(Typography);

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
        <Box className={classes.desktopContainer} display="flex" flexDirection="column" alignItems="center">
            <Box className={classes.jss4355}>
                <WhiteTextTypography  variant="h8">DITTO in wallet</WhiteTextTypography>
                {
                    account === undefined
                        ?
                        <WhiteTextTypography color="primary" variant="body2" style={{ paddingTop: '10px' }}>{'...'}</WhiteTextTypography>
                        :
                        account === null
                            ?
                            <WhiteTextTypography color="textPrimary" variant="body2" style={{ paddingTop: '10px' }}>{None}</WhiteTextTypography>
                            :
                            <Box textAlign='center'>
                                <WhiteTextTypography color="textPrimary" variant="body2" style={{ paddingTop: '10px' }}>{`${parseFloat(dittoBalance).toFixed(4)} DITTO`}</WhiteTextTypography>
                                <WhiteTextTypography color="textPrimary" variant="body2" style={{ paddingTop: '5px' }}>{`${dittoInUSD.toFixed(2)} USD`}</WhiteTextTypography>
                            </Box>

                }
            </Box>
            <Box className={classes.jss4355}>
                <WhiteTextTypography color="primary" variant="h8" style={{ paddingTop: '40px' }}>xDITTO in wallet</WhiteTextTypography>
                {
                    account === undefined
                        ?
                        <WhiteTextTypography color="textPrimary" variant="body2" style={{ paddingTop: '10px' }}>{'...'}</WhiteTextTypography>
                        :
                        account === null
                            ?
                            <WhiteTextTypography color="textPrimary" variant="body2" style={{ paddingTop: '10px' }}>{None}</WhiteTextTypography>
                            :
                            <Box textAlign='center'>
                                <WhiteTextTypography color="textPrimary" variant="body2" style={{ paddingTop: '10px' }}>{`${parseFloat(xDittoBalance).toFixed(4)} xDITTO`}</WhiteTextTypography>
                                {/* <WhiteTextTypography color="textPrimary" variant="body2" style={{ paddingTop: '5px' }}>{`${xDittoInUSD.toFixed(2)} USD`}</WhiteTextTypography> */}
                            </Box>


                }
            </Box>
            <Box className={classes.jss4355}>
                <WhiteTextTypography color="primary" variant="h8" style={{ paddingTop: '40px' }}>1mile$BOTT = 1$GOAT</WhiteTextTypography>
                {
                    account === undefined
                        ?
                        <WhiteTextTypography color="textPrimary" variant="body2" style={{ paddingTop: '10px' }}>{'...'}</WhiteTextTypography>
                        :
                        account === null
                            ?
                            <WhiteTextTypography color="textPrimary" variant="body2" style={{ paddingTop: '10px' }}>{Unavailable}</WhiteTextTypography>
                            :
                            <WhiteTextTypography color="textPrimary" variant="body2" style={{ paddingTop: '10px' }}>{`1 xDITTO = ${parseFloat(exchangeRate).toFixed(4)} DITTO`}</WhiteTextTypography>
                }
            </Box>
        </Box>
    );
};
