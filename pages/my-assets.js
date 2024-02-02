
import { ethers } from "ethers"
import { useEffect,useState } from "react"
import Web3Modal from 'web3modal'

import {
  nftaddress, nftmarketaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'


export default function MyAssets() {

    const [nfts, setNfts] = useState([])
    const [loadingState, setLoadingState] = useState('non-loaded')



    useEffect(()=>{
        loadNFTs()
    }, [])

    async function loadNFTs() {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)      
        const signer = provider.getSigner()   
        
        const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
        const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
        const data = await marketContract.fetchMyNFTs()
        const items = await Promise.all(data.map(async i => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId)
        let meta = JSON.parse(tokenUri);



        let price = ethers.utils.formatUnits(i.price.toString(),'ether')
        let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.image,
            name: meta.name,
            description: meta.description
        }

        return item
        }))
        setNfts(items)
        setLoadingState('loaded')
    }
    
    if (loadingState=== 'loaded' && !nfts.length) return (
        <h1 className="px-20 py-10 text-3xl">没有拥有作品</h1>
        )

    return (
        <div className="flex justify-center">
            <div className="px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                    {
                        nfts.map((nft, i)=>(
                            <div key={i} className="border shadow rounded-xl overflow-hidden"> 
                            <img src ={nft.image} className="rounded"/>
                    
                            <div className="p-4 bg-black">
                                <p style={{ height:'64px' }} className="text-2xl font-semibold">{nft.name}</p>
                                <div style= {{ heigh: '70px', overflow: 'hidden'}}>
                                <p className ="text-gray-400">{nft.description}</p>
                                </div>
                            </div>
                            <div className="p-4 bg-black">
                                <p className="text-2xl mb-4 font-bold text-white">{nft.price} ETH</p>
                            </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>      
    )


}