import React, {ChangeEvent, FC, useState} from 'react';
import {Button, Input, notification} from "antd";
import IPFS from 'ipfs'
import {ethers} from 'ethers';
import {NFTContract} from "../../assets/constants";
import {NFT_ABI} from "../../assets/abis/NFT_ABI";

type PropsType = {
    isConnected: boolean
}
const CreateNFTToken: FC<PropsType> = React.memo((props) => {
    let [name, setName] = useState<string>('');
    let [description, setDescription] = useState<string>('');
    let [fileUint8Array, setFileUint8Array] = useState<any[] | null>(null);
    let [metadataHashRes, setMetadataHashRes] = useState<string>('');

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
        let provider, NFTContractInstance;

        if(true){
            provider = new ethers.providers.Web3Provider(window.ethereum).getSigner()
            NFTContractInstance = new ethers.Contract(NFTContract, NFT_ABI, provider)
        }else{
            notification.error({
                key: 'updatable',
                message: 'Please connect to MetaMask'
            })
        }

        if(!metadataHashRes){
            if (name && description && fileUint8Array) {
                let ipfs = await IPFS.create();

                let ipfsFileHash = await ipfs.add(fileUint8Array);

                let metadata = JSON.stringify({
                    name,
                    description,
                    file: ipfsFileHash.path
                })
                let metadataHash = await ipfs.add(metadata);
                console.log(metadataHash)
                setMetadataHashRes(metadataHash.path)
                NFTContractInstance?.mint(metadataHash.path);

            } else {
                notification.error({
                    key: 'updatable',
                    message: 'Please fill in all the fields'
                })
            }
        }else{
            NFTContractInstance?.mint(metadataHashRes);
        }
    }

    return (
        <div className='flex flex-col gap-4 items-center p-8'>
            <Input onChange={(e) => {
                setName(e.target.value)
            }} value={name}/>
            <Input onChange={(e) => {
                setDescription(e.target.value)
            }} value={description}/>
            <input type={'file'} onChange={handleFileSelected}/>
            <Button type={'primary'} onClick={handleClickCreateNFT}>Create</Button>
        </div>
    );
})

export default CreateNFTToken;