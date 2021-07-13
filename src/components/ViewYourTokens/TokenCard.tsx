import {Card, Input, Modal, notification} from "antd";
import React, {FC, useEffect, useState} from "react";
import Meta from "antd/es/card/Meta";
import {ethers} from "ethers";
import {NFTContract} from "../../assets/constants";
import {NFT_ABI} from "../../assets/abis/NFT_ABI";
import Paragraph from "antd/es/typography/Paragraph";
import Text from "antd/es/typography/Text";

type PropsType = {
    tokenId: number
    tokenOwner: string
    name: string
    description: string
    file: string
}

const TokenCard: FC<PropsType> = (props) => {
    let [visible, setVisible] = useState<boolean>(false);
    let [confirmLoading, setConfirmLoading] = useState<boolean>(false);
    let [userAddress, setUserAddress] = useState<string>('');
    let [transferAddress, setTransferAddress] = useState<string>('')

    useEffect(() => {
        (async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            let address = await signer.getAddress();
            setUserAddress(address)
        })()
    }, [])

    const handleOk = async () => {
        if(!/^0x[0-9a-f]{40}$/i.test(transferAddress)){
            notification.error({
                key: 'updatable',
                message: 'Enter valid address'
            })
            return
        }
        setConfirmLoading(true)
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const NFTContractInstance = new ethers.Contract(NFTContract, NFT_ABI, signer)

        await NFTContractInstance.transferFrom(props.tokenOwner, transferAddress, props.tokenId);

        setConfirmLoading(false)
        setVisible(false)
    }
    const handleCancel = () => {
        setVisible(false)
    }

    return (
        <>
            <Card
                hoverable
                style={{width: 350}}
                cover={<img alt="example"
                            src={props.file ? `https://ipfs.io/ipfs/${props.file}` : "https://i.stack.imgur.com/6M513.png"}/>}
                onClick={() => {
                    if (props.tokenOwner === userAddress) {
                        setVisible(true)
                    } else {
                        notification.warning({
                            key: 'updatable',
                            message: 'You cant transfer this token, because you are not owner'
                        })
                    }
                }}
            >
                <Meta title={props.name} description={props.description}/>
                {props.tokenOwner === userAddress && (
                    <Paragraph>
                        <Text type='success'>Ready for transfer</Text>
                    </Paragraph>
                )}
            </Card>
            <Modal
                title="Transfer"
                visible={visible}
                onOk={handleOk}
                okButtonProps={{disabled: !transferAddress}}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <Input placeholder='Enter address to transfer' value={transferAddress}
                       onChange={(e) => setTransferAddress(e.target.value)}/>
            </Modal>
        </>
    )
}
export default TokenCard