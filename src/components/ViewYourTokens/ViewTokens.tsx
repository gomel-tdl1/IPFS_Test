import {ethers} from "ethers";
import React, {FC, useEffect, useState} from "react";
import {connect} from "react-redux";
import {AppStateType} from "../../redux/redux-store";
import {NFTContract} from "../../assets/constants";
import {NFT_ABI} from "../../assets/abis/NFT_ABI";
import {encodingAPI} from "../../API/api";
import TokenCard from "./TokenCard";
import Title from "antd/es/typography/Title";
import {Pagination, Switch} from "antd";

type MapStateToPropsType = {
    isConnected: boolean,
    ipfs: any
}
type MapDispatchToPropsType = {}
type OwnPropsType = {}
type PropsType = MapStateToPropsType & MapDispatchToPropsType & OwnPropsType;

const ViewTokens: FC<PropsType> = (props) => {
    type TokenType = {
        tokenId: number
        tokenOwner: string
        name: string
        description: string
        file: string
    }
    let [tokensResData, setTokensResData] = useState<TokenType[] | null>(null)
    let [userAddress, setUserAddress] = useState<string>('')
    let [filteredTokens, setFilteredTokens] = useState<TokenType[] | null>(null)
    let [paginatedTokens, setPaginatedTokens] = useState<TokenType[] | null>(null)
    let [currentPage, setCurrentPage] = useState<number>(1)

    const handleSwitchChange = (e: boolean) => {
        if (e) {
            // @ts-ignore
            setFilteredTokens(tokensResData.filter(data => data.tokenOwner === userAddress))
            setCurrentPage(1)
        } else {
            setFilteredTokens(tokensResData)
            setCurrentPage(1)
        }
    }
    useEffect(()=>{
        // @ts-ignore
        let pagTokens = paginator(filteredTokens, currentPage)
        setPaginatedTokens(pagTokens)
    }, [filteredTokens, currentPage])

    function paginator(items: TokenType[], current_page: number, per_page_items: number = 20) {
        let page = current_page
        let per_page = per_page_items
        let offset = (page - 1) * per_page
        let paginatedItems = items?.slice(offset).slice(0, per_page_items);
        return paginatedItems
    }

    useEffect(() => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const NFTContractInstance = new ethers.Contract(NFTContract, NFT_ABI, provider);

        (async () => {
            let address = await signer.getAddress()
            setUserAddress(address);

            let nextTokenID = +await NFTContractInstance.getNextTokenId()
            let tokensIDs: number[] = []
            for (let i = 0; i < nextTokenID; i++) {
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
                    return encodingAPI.getEncodingData(URI).then((response: any) => response.data)
                })
            )

            tokensData = tokensData.map((data, index) => {
                return {
                    ...data,
                    tokenId: tokensIDs[index],
                    tokenOwner: tokensOwners[index]
                }
            })

            setTokensResData(tokensData);
            setFilteredTokens(tokensData)

        })()
    }, [])

    const handlePageChanged = (page: number) => {
        setCurrentPage(page)
    }
    return (
        <div className='flex justify-center'>
            {props.isConnected &&
            <div className='py-6'>
                <Switch checkedChildren="My" unCheckedChildren="All" defaultChecked={false}
                        onChange={handleSwitchChange}/>
                <div className='grid grid-cols-3 gap-4 py-6'>
                    {paginatedTokens?.map(data => (
                        <TokenCard name={data.name} description={data.description} file={data.file}
                                   tokenId={data.tokenId}
                                   tokenOwner={data.tokenOwner}
                                   key={data.tokenId}/>
                    ))}
                </div>
                <Pagination current={currentPage} total={filteredTokens?.length} pageSize={20} onChange={handlePageChanged}/>
            </div>}

            {(props.isConnected && tokensResData?.length === 0) &&
            <Title level={4} className='mt-10'>You haven't tokens</Title>}

            {!props.isConnected &&
            <Title level={4} className='mt-10'>Please connect to MetaMask</Title>}
        </div>
    )
}
const MapStateToProps = (state: AppStateType): MapStateToPropsType => ({
    isConnected: state.auth.isConnected,
    ipfs: state.auth.ipfs
})
const ViewTokensContainer = connect<MapStateToPropsType, MapDispatchToPropsType, OwnPropsType, AppStateType>(MapStateToProps, {})(ViewTokens)
export default ViewTokensContainer