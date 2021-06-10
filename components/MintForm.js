

import React from 'react';
import { ethers } from 'ethers';
import { debounce } from 'debounce';

import { makeStyles, withStyles } from '@material-ui/core/styles';

import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';


import {
    useWeb3React,
    UnsupportedChainIdError
} from "@web3-react/core";

import XDITTO_ABI from '../lib/contract/abi.json'
import DITTO_ABI from '../lib/contract/DITTOAbi.json'

import MintButton from './MintButton';


const useStyles = makeStyles((theme) => ({
    mintForm: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '10%',
        [theme.breakpoints.up('md')]: {
            marginTop: '2.5%'
        },
    },
    inputField: {
        width: '95%',
        [theme.breakpoints.up('md')]: {
            width: '40%'
        },
    }
}));

const StyledTextField = withStyles((theme) => ({
    root: {
        '& input:valid': {
            borderColor: theme.palette.text.primary,
            borderWidth: 2,
        },
    },
}))(TextField);



export default function MintForm() {
    const classes = useStyles();

    const [dittoInput, setDittoInput] = React.useState();
    const [dittoBalance, setDittoBalance] = React.useState('0');
    const [xDittoOutput, setXDittoOutput] = React.useState(0);
    const [xDittoContract, setXDittoContract] = React.useState();
    const [dittoContract, setDittoContract] = React.useState();
    const [outputEstimateLoading, setOutputEstimateLoading] = React.useState(false);

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

    React.useEffect(() => {
        const getXDittoContract = async () => {
            const newXDittoContract = new ethers.Contract('0xB0a1DE764A033A76f28E821fBe402EDBFEe937dB', XDITTO_ABI, library.getSigner());
            setXDittoContract(newXDittoContract);
        }

        const getDittoBalance = async () => {
            const dittoContract = new ethers.Contract('0x233d91a0713155003fc4dce0afa871b508b3b715', DITTO_ABI, library.getSigner());
            setDittoContract(dittoContract)
            const dittoBalance = await dittoContract.balanceOf(account);
            const formattedDittoBalance = ethers.utils.formatUnits(dittoBalance, 9);
            setDittoBalance(formattedDittoBalance);
        }

        if (library) {
            getXDittoContract();
            getDittoBalance();
        }

    }, [library, chainId]);

    const getXDittoMintOutput = async (input) => {
        let mintOutput;
        setOutputEstimateLoading(true);
        try {
            mintOutput = await xDittoContract.getMintAmount(input);
            setXDittoOutput(ethers.utils.formatUnits(mintOutput, 18));

        } catch (error) {
            console.error(error);
        }
        setOutputEstimateLoading(false);
    }


    const handleInputChange = (inputValue) => {
        if (inputValue === '' || inputValue === undefined) {
            setXDittoOutput(0);
        }
        else {
            const inputDitto = ethers.utils.parseUnits(inputValue, 9);
            getXDittoMintOutput(inputDitto)
        }
    }

    const calculateXDittoMintOutput = debounce((inputValue) => handleInputChange(inputValue), 500);


    return (
        <form className={classes.mintForm} noValidate autoComplete="off">
            <StyledTextField
                id="mint-amount-input"
                className={classes.inputField}
                label="Amount of DITTO to mint with"
                variant="outlined"
                color="primary"
                type="number"
                disabled={
                    (account === undefined || account === null)
                }
                value={dittoInput}
                onChange={(e) => {
                    setDittoInput(e.target.value);
                    calculateXDittoMintOutput(e.target.value);
                }}
                InputLabelProps={{ shrink: true }}
                inputProps={{
                    min: 0,
                }}
                InputProps={{
                    endAdornment:
                        <InputAdornment position="end">
                            <Button
                                disabled={
                                    (account === undefined || account === null || parseFloat(dittoBalance) === 0)
                                }
                                onClick={() => {
                                    setDittoInput(dittoBalance);
                                    calculateXDittoMintOutput(dittoBalance);
                                }}>
                                Max
                            </Button>
                            <Typography>DITTO</Typography>
                        </InputAdornment>,
                }} />
            <ArrowDownwardIcon color="primary" style={{ fontSize: 70, marginTop: '5px', marginBottom: '5px' }} />
            <StyledTextField
                id="xditto-amount-output"
                className={classes.inputField}
                label="Receive"
                variant="outlined"
                color="primary"
                value={xDittoOutput}
                InputProps={{
                    readOnly: true,
                    endAdornment:
                        <InputAdornment position="start">
                            {outputEstimateLoading ?
                                <Box paddingRight={5}>
                                    <CircularProgress color="primary" size={20} />
                                </Box>
                                : null}
                            <Typography>xDITTO</Typography>
                        </InputAdornment>,
                }} />
            <MintButton dittoContract={dittoContract} xDittoContract={xDittoContract} inputDitto={dittoInput} />
        </form>
    );
};
