
let chai;
before(async () => {
    chai = await import('chai');
});

 describe("NFTMarket", function () {
    it("Should create and execute market sales", async function () {
      const expect = chai.expect;
        
      const Market = await ethers.getContractFactory("NFTMarket")
      const market = await Market.deploy()
      await market.deployed()
      const marketAddress = market.address

      const NFT = await ethers.getContractFactory("NFT")
      const nft = await NFT.deploy(marketAddress)
      await nft.deployed()
      const nftContractAddress = nft.address

      let listingPrice = await market.getListingPrice()
      listingPrice = listingPrice.toString()
      const auctionPrice = ethers.utils.parseUnits('100', 'ether')

      await nft.createToken("https://www.1.com")
      await nft.createToken("https://www.2.com")

      await market.createMarketItem(nftContractAddress, 1, auctionPrice, {value: listingPrice})
      await market.createMarketItem(nftContractAddress, 2, auctionPrice, {value: listingPrice})
    
      const [_, buyerAddress] = await ethers.getSigners()

      await market.connect(buyerAddress).createMarketSale(nftContractAddress,1,{value:auctionPrice})
    
     // let items = await market.fetchMarketItems()
     let items = await market.fetchItemsCreated()

      items = await Promise.all(items.map(async i =>{
        const tokenUri =await nft.tokenURI(i.tokenId)
        let item ={
          price : i.price.toString(),
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
          tokenUri
        }
        return item
      }))

      console.log('items:', items)

    });

  });
