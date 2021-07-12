import { ethers } from "ethers";
import React, {FC, useEffect} from "react";
import {connect} from "react-redux";
import {AppStateType} from "../../redux/redux-store";
import {NFTContract} from "../../assets/constants";
import {NFT_ABI} from "../../assets/abis/NFT_ABI";

type MapStateToPropsType = {
    isConnected: boolean,
}
type MapDispatchToPropsType = {}
type OwnPropsType = {}
type PropsType = MapStateToPropsType & MapDispatchToPropsType & OwnPropsType;

const ViewTokens: FC<PropsType> = (props) => {
    useEffect(() => {

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const NFTContractInstance = new ethers.Contract(NFTContract, NFT_ABI, provider)
        type TokenType = {
            tokenId: number
            tokenOwner: string
            name: string
            description: string
            file: string
        }
        let tokens: TokenType[];

        (async () => {
            let nextTokenID = +await NFTContractInstance.getNextTokenId()
            let tokensIDs: number[] = []
            for(let i =0; i<nextTokenID; i++){
                tokensIDs.push(i)
            }
            let tokensOwners: string[] = await Promise.all(
                tokensIDs.map((id) => {
                    return NFTContractInstance.ownerOf(id)
                })
            )
            let tokensURIs: string[] = await Promise.all(
                tokensIDs.map((id) => {
                    return NFTContractInstance.tokenURI(id)
                })
            )
            let tokensData = await Promise.all(
                tokensURIs.map((URI) => {
                    return fetch(`https://ipfs.io/ipfs/${URI}`)
                })
            )
            console.log(tokensData)
        })()

    }, [])
    return (
        <div>

        </div>
    )
}
const MapStateToProps = (state: AppStateType): MapStateToPropsType => ({
    isConnected: state.auth.isConnected
})
const ViewTokensContainer = connect<MapStateToPropsType, MapDispatchToPropsType, OwnPropsType, AppStateType>(MapStateToProps, {})(ViewTokens)
export default ViewTokensContainer