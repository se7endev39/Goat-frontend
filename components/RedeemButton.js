

import React from 'react';
import { ethers } from 'ethers';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';

import SimpleModal from '../components/SimpleModal'


import {
    useWeb3React,
} from "@web3-react/core";

const useStyles = makeStyles((theme) => ({
    buttonContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '2.5%',
        width: '50%'
    },
}));

export default function RedeemButton({ xDittoContract, dittoContract, inputXDitto }) {
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

    const [xDittoAllowanceAmount, setXDittoAllowanceAmount] = React.useState('0');
    const [approvalLoading, setApprovalLoading] = React.useState(false);
    const [redeemLoading, setRedeemLoading] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');
    const [modalOpen, setModalOpen] = React.useState(false);

    React.useEffect(() => {

        const getAllowanceAmount = async () => {
            const xDittoAllowance = await xDittoContract.allowance(account, xDittoContract.address);
            const formattedXDittoAllowance = ethers.utils.formatUnits(xDittoAllowance, 18);
            setXDittoAllowanceAmount(formattedXDittoAllowance);
        }

        if (xDittoContract)
            getAllowanceAmount();

    }, [xDittoContract, dittoContract])

    const showError = async (message) => {
        setErrorMessage(message);
        await new Promise(r => setTimeout(r, 5000));
        setErrorMessage('');
    }

    const approveRedeem = async () => {
        const amountToApprove = ethers.utils.parseUnits(`1000000000000000000000000.0`, 9);
        setApprovalLoading(true);
        try {
            const approvalTx = await xDittoContract.approve(xDittoContract.address, amountToApprove);
            await approvalTx.wait();
            getAllowanceAmount();
        } catch (error) {
            console.error(error)
        }
        setApprovalLoading(false);
    }

    const redeem = async () => {
        const inputXDittoToRedeemWith = ethers.utils.parseUnits(inputXDitto, 18);
        setRedeemLoading(true);
        try {
            const redeemTx = await xDittoContract.burn(inputXDittoToRedeemWith);
            await redeemTx.wait();
            setModalOpen(true);
        } catch (error) {
            console.error(error);
            if (error.message.includes('MetaMask Tx Signature: User denied transaction signature.'))
                showError('Transaction cancelled.');
        }
        setRedeemLoading(false);
    }


    if (account === undefined || account === null) {
        return (
            <Box className={classes.buttonContainer} >
                <Button type="button">Connect wallet to BSC mainnet to continue</Button>
            </Box>
        );
    }

    if (!(parseFloat(inputXDitto) > 0) || inputXDitto === undefined || inputXDitto === '') {
        return (
            <Box className={classes.buttonContainer} >
                <Button type="button">Enter an amount</Button>
            </Box>
        )
    }

    if (approvalLoading) {
        return (
            <Box className={classes.buttonContainer} >
                <Button type="button" variant="contained" color="primary" size="large">
                    <Box paddingRight={2} paddingTop={1}>
                        <CircularProgress color="white" size={20} />
                    </Box>
                    Approval loading
                </Button>
            </Box>
        )
    }

    if (parseInt(xDittoAllowanceAmount) === 0) {
        return (
            <Box className={classes.buttonContainer} >
                <Button type="button" variant="contained" color="primary" size="large" onClick={() => {
                    approveRedeem();
                }}> Approve Redeem</Button >
            </Box>
        )
    }

    if (redeemLoading) {
        return (
            <Box className={classes.buttonContainer} >
                <Button type="button" variant="contained" color="primary" size="large">
                    <Box paddingRight={2} paddingTop={1}>
                        <CircularProgress color="white" size={20} />
                    </Box>
                    Redeeming
                </Button>
            </Box>
        )
    }

    return (
        <Box className={classes.buttonContainer} >
            <div>
                <Button type="button" variant="contained" color="primary" size="large" onClick={() => {
                    redeem();
                }}> Redeem</Button>
            </div>
            {errorMessage && <Typography>{errorMessage}</Typography>}
            <SimpleModal open={modalOpen} setModalOpen={setModalOpen} heading={'Successfully redeemed DITTO'} bodyText={'Refresh page & check wallet balance :)'} />
        </Box>
    );
};
