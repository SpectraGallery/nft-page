import { ethers } from "ethers";
import { useState } from "react";
import Web3Modal from 'web3modal';
import { useRouter } from 'next/router';
    
import { nftaddress, nftmarketaddress} from '../config';
import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json';
    
export default function CreateItem() {
    const [formInput, updateFormInput] = useState({ price: '', name: '', description: ''});
    const router = useRouter();
    
    async function createItem() {
      const { name, description, price, image } = formInput;
      if (!name || !description || !price || !image) {
          console.log("Form input is missing");
          return;
      }
     
      try {
        console.log("JASON", formInput)
        
          await createSale(formInput)
      } catch (error) {
          console.error("Failed to create item:", error);
      }
  }
  
    async function createSale(formInput) {

        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()

        const provider = new ethers.providers.Web3Provider(connection)      
        const signer = provider.getSigner()   
        
        let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
        const metadata = {
          name: formInput.name,
          description: formInput.description,
          image: formInput.image,
        }
        
        let inputdata = JSON.stringify(metadata)
        let transaction = await contract.createToken(inputdata)
                
        let tx =await transaction.wait()

        let event = tx.events[0]

        let value = event.args[2]
        let tokenId = value.toNumber()
        console.log(tokenId)


        const price = ethers.utils.parseUnits(formInput.price, 'ether')
        contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
        let listingPrice = await contract.getListingPrice()
        listingPrice = listingPrice.toString()

        transaction = await contract.createMarketItem(
            nftaddress, tokenId, price, {value: listingPrice}
        )
        await transaction.wait()
        router.push('/')
    }


  return (
    <div className="flex justify-center">
        <div className="w-1/2 flex flex-col pb-12">
            <input 
            placeholder="Asset Name"
            className="mt-8 border rounded p-4"
            onChange={e=>updateFormInput({...formInput, name: e.target.value})}
            />
            <textarea
            placeholder="Asset Descrption"
            className="mt-2 border rounded p-4"
            onChange={e=>updateFormInput({...formInput, description: e.target.value})}
            />
            <input 
            placeholder="Asset Price in ETH"
            className="mt-2 border rounded p-4"
            onChange={e=>updateFormInput({...formInput, price: e.target.value})}
            />
            <input 
            placeholder="Image URL" 
            className="mt-2 border rounded p-4" 
            onChange={e => updateFormInput({ ...formInput, image: e.target.value })} 
            />
            {formInput.image && 
            (<img className="rounded mt-4" width="350" src={formInput.image} 
            alt="Preview" />)}   
            <button onClick={createItem} className="font-bold mt-4 bg-blue-500 text-white rounded p-4 shadow-lg">
            铸造与上传 
            </button>
        </div>
    </div>
  )
}