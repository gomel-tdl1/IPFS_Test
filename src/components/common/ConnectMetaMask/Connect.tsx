import React, {FC, useEffect, useState} from "react";
import {Button} from "antd";
import Title from "antd/lib/typography/Title";
import {ethers} from "ethers";
import Text from "antd/es/typography/Text";
import {NFTContract} from "../../../assets/constants";
import {NFT_ABI} from "../../../assets/abis/NFT_ABI";

type PropsType = {
    isConnected: boolean,
    setIsConnected: (isConnected: boolean) => void
}

const ConnectMetaMask: FC<PropsType> = (props) => {
    let [userAddress, setUserAddress] = useState<string>('')
    let [balance, setBalance] = useState<number | null>(null)

    useEffect(() => {
        (async ()=>{
            if (props.isConnected) {
                let signer = new ethers.providers.Web3Provider(window.ethereum).getSigner()
                let address = await signer.getAddress()
                setUserAddress(address)

                let provider = new ethers.providers.Web3Provider(window.ethereum)
                let contractNFT = new ethers.Contract(NFTContract, NFT_ABI, provider)
                let signerBalance = await contractNFT.balanceOf(address)
                setBalance(+signerBalance)
            }
        })()

    }, [props.isConnected])

    const connectWallet = async () => {
        await window.ethereum.enable()
        props.setIsConnected(true)
    }
    return (
        <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
                <Title level={5} style={{color: 'white'}}>{userAddress}</Title>
                <div >
                    <Text code >{balance} NFT</Text>
                </div>

            </div>
            {!props.isConnected && <Button onClick={connectWallet}>Connect to MetaMask</Button>}
        </div>
    )
}

export default ConnectMetaMask