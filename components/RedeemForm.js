

import React from 'react';
import { ethers } from 'ethers'
import { debounce } from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';

import {
    useWeb3React,
    UnsupportedChainIdError
} from "@web3-react/core";

import XDITTO_ABI from '../lib/contract/abi.json';
import DITTO_ABI from '../lib/contract/DITTOAbi.json';

import RedeemButton from '../components/RedeemButton';

const useStyles = makeStyles((theme) => ({
    redeemForm: {
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

export default function RedeemForm() {
    const classes = useStyles();

    const [xDittoContract, setXDittoContract] = React.useState();
    const [dittoContract, setDittoContract] = React.useState();
    const [inputXDitto, setInputXDitto] = React.useState();
    const [xDittoBalance, setXDittoBalance] = React.useState('0');
    const [dittoOutput, setDittoOutput] = React.useState(0);

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
        const getXDittoValues = async () => {
            const newXDittoContract = new ethers.Contract('0xB0a1DE764A033A76f28E821fBe402EDBFEe937dB', XDITTO_ABI, library.getSigner());
            const latestXDittoBalance = await newXDittoContract.balanceOf(account);
            const formattedXDittoBalance = ethers.utils.formatUnits(latestXDittoBalance, 18);
            setXDittoBalance(formattedXDittoBalance);
            setXDittoContract(newXDittoContract);
        }

        const getDittoContract = async () => {
            const newDittoContract = new ethers.Contract('0x233d91a0713155003fc4dce0afa871b508b3b715', DITTO_ABI, library.getSigner());
            setDittoContract(newDittoContract);
        }

        if (library) {
            getXDittoValues();
            getDittoContract();
        }

    }, [library, chainId]);

    const getDittoRedeemOutput = async (input) => {
        const redeemOutput = await xDittoContract.getRedeemAmount(input);
        setDittoOutput(ethers.utils.formatUnits(redeemOutput, 9));
    }

    const handleInputChange = (inputValue) => {
        if (inputValue === '' || inputValue === undefined) {
            setDittoOutput(0);
        }
        else {
            const inputXDitto = ethers.utils.parseUnits(inputValue, 18);
            getDittoRedeemOutput(inputXDitto);
        }
    }

    const calculateDittoRedeemOutput = debounce((inputValue) => handleInputChange(inputValue), 500);


    return (
        <form className={classes.redeemForm} noValidate autoComplete="off">
            <TextField
                id="redeem-amount-input"
                className={classes.inputField}
                label="Amount of xDITTO to redeem from"
                variant="outlined"
                color="primary"
                value={inputXDitto}
                onChange={(e) => {
                    setInputXDitto(e.target.value);
                    calculateDittoRedeemOutput(e.target.value);
                }}
                type="number"
                disabled={
                    (account === undefined || account === null)
                }
                InputLabelProps={{ shrink: true }}
                inputProps={{
                    min: 0,
                }}
                InputProps={{
                    endAdornment: <InputAdornment position="start">
                        <Button
                            disabled={
                                (account === undefined || account === null || parseFloat(xDittoBalance) === 0)
                            }
                            onClick={() => {
                                setInputXDitto(xDittoBalance);
                                calculateDittoRedeemOutput(xDittoBalance);
                            }}>
                            Max
                            </Button>
                        <Typography>xDITTO</Typography>
                    </InputAdornment>,
                }} />
            <ArrowDownwardIcon color="primary" style={{ fontSize: 70, marginTop: '5px', marginBottom: '5px' }} />
            <TextField
                id="ditto-amount-ouput"
                className={classes.inputField}
                label="Receive"
                variant="outlined"
                value={dittoOutput}
                color="primary"
                InputProps={{
                    readOnly: true,
                    endAdornment: <InputAdornment position="start"><Typography>DITTO</Typography></InputAdornment>,
                }}
            />
            <RedeemButton xDittoContract={xDittoContract} dittoContract={dittoContract} inputXDitto={inputXDitto} />
        </form>
    );
};
