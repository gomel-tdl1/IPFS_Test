import React, {ChangeEvent, FC, useState} from 'react';
import {Button, Input, notification} from "antd";
import IPFS from 'ipfs'
import {ethers} from 'ethers';
import {NFTContract} from "../../assets/constants";
import {NFT_ABI} from "../../assets/abis/NFT_ABI";
import {connect} from "react-redux";
import {AppStateType} from "../../redux/redux-store";

type MapStateToPropsType = {
    isConnected: boolean,
}
type MapDispatchToPropsType = {}
type OwnPropsType = {}
type PropsType = MapStateToPropsType & MapDispatchToPropsType & OwnPropsType;

const CreateNFTToken: FC<PropsType> = React.memo((props) => {
    let [name, setName] = useState<string>('');
    let [description, setDescription] = useState<string>('');
    let [fileUint8Array, setFileUint8Array] = useState<any[] | null>(null);
    let ipfs: any;

    const handleFileSelected = (e: ChangeEvent<HTMLInputElement>) => {
        // @ts-ignore
        let file = e.target.files[0]
        let reader = new FileReader()
        reader.readAsArrayBuffer(file)
        reader.onload = async (e) => {
            let buffer = e.target?.result;
            // @ts-ignore
            setFileUint8Array(new Uint8Array(buffer));
        }
    }

    const handleClickCreateNFT = async () => {

        if (!props.isConnected) {
            notification.error({
                key: 'updatable',
                message: 'Please connect to MetaMask'
            })
            return;
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum).getSigner()
        const NFTContractInstance = new ethers.Contract(NFTContract, NFT_ABI, provider)

        if (name && description && fileUint8Array) {
            if(!ipfs) ipfs = await IPFS.create();
            let ipfsFileHash = await ipfs.add(fileUint8Array);
            let metadata = JSON.stringify({
                name,
                description,
                file: ipfsFileHash.path
            })
            let metadataHash = await ipfs.add(metadata);
            console.log(metadataHash)
            await NFTContractInstance?.mint(metadataHash.path);
            setName('')
            setDescription('')
        } else {
            notification.error({
                key: 'updatable',
                message: 'Please fill in all the fields'
            })
        }

    }

    const inputWidth = {
        width: '350px'
    }

    return (
        <div className='flex flex-col gap-4 items-center p-8'>
            <Input onChange={(e) => {
                setName(e.target.value)
            }} value={name} placeholder='Name' style={inputWidth}/>
            <Input onChange={(e) => {
                setDescription(e.target.value)
            }} value={description} placeholder='Description' style={inputWidth}/>
            <input type={'file'} onChange={handleFileSelected}/>
            <Button type={'primary'} onClick={handleClickCreateNFT}>Create</Button>
        </div>
    );
})

const MapStateToProps = (state: AppStateType): MapStateToPropsType => ({
    isConnected: state.auth.isConnected
})

const CreateNFTTokenContainer = connect<MapStateToPropsType, MapDispatchToPropsType, OwnPropsType, AppStateType>(MapStateToProps, {})(CreateNFTToken)

export default CreateNFTTokenContainer;
