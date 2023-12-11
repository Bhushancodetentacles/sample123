import { toast } from "react-toastify";
import useContractUtils from "./useContractUtils";
import { ethers } from "ethers";
import { useAccount } from "wagmi";

function useContractService() {
    const { address } = useAccount()
    const {
        NFTMarketPlaceWriteContractRef,
        tokenWriteContractRef,
        NFTWriteContractRef,
        isWalletConnected,
        isWrongWalletConnected
    } = useContractUtils();


    // market place contract fn*********************//
    //FOR FIXED SALE
    const listNFTForFixedSale = async (tokenId, price, collectionAddress) => {
        const value = ethers.utils.parseUnits(price, 18)
        try {
            const result = await NFTMarketPlaceWriteContractRef.listNFTForFixedSale(tokenId, value, collectionAddress)
            return result
        } catch (error) {
            throw error
        }
    }

    //FOR BUY NFT FORM FIXED SALE
    const purchaseNFTFromFixedSale = async (_fixedSaleIndex) => {
        try {
            const result = await NFTMarketPlaceWriteContractRef.purchaseNFTFromFixedSale(_fixedSaleIndex)
            return result
        } catch (error) {
            throw error
        }
    }
    //FOR MAKE OFFER FIXED SALE
    const makeOfferForFixedSaleNFT = async (_fixedSaleIndex, offerAmount) => {
        try {
            const value = ethers.utils.parseUnits(offerAmount, 18)
            const result = await NFTMarketPlaceWriteContractRef.makeOfferForFixedSaleNFT(_fixedSaleIndex, value)
            return result
        } catch (error) {
            throw error
        }
    }
    //FOR MAKE OFFER NON LISTED 
    const makeOfferForNFT = async (nftContract, tokenId, offerAmount) => {
        const value = ethers.utils.parseUnits(offerAmount, 18)
        try {
            const result = await NFTMarketPlaceWriteContractRef.makeOfferForNFT(nftContract, tokenId, value)
            return result
        } catch (error) {
            throw error
        }
    }
    //FOR AUCTION SALE
    const listNFTForAuction = async (tokenId, startPrice, minBidIncrementPercentage, duration, collectionAddress) => {
        const value = ethers.utils.parseUnits(startPrice, 18)
        try {
            const result = await NFTMarketPlaceWriteContractRef.listNFTForAuction(tokenId, value, minBidIncrementPercentage, duration, collectionAddress)
            return result
        } catch (error) {
            throw error
        }
    }
    //accept fixed sell offer
    const acceptOfferForFixedSaleNFTFn = async (_fixedSaleIndex, offerer) => {
        try {
            const result = await NFTMarketPlaceWriteContractRef.acceptOfferForFixedSaleNFT(_fixedSaleIndex, offerer)
            return result
        } catch (error) {
            throw error
        }
    }
    // FOR BUY NFT AUCTION SALE
    const placeNFTAuctionBid = async (auctionIndex, bidPrice) => {
        const value = ethers.utils.parseUnits(bidPrice, 18)
        try {
            const result = await NFTMarketPlaceWriteContractRef.placeNFTAuctionBid(auctionIndex, value)
            return result
        } catch (error) {
            throw error
        }
    }
    // FOR REMOVE NFT from AUCTION SALE
    const removeNFTFromAuction = async (auctionIndex) => {
        try {
            const result = await NFTMarketPlaceWriteContractRef.removeNFTFromAuction(auctionIndex)
            return result
        } catch (error) {
            throw error
        }
    }
    // FOR REMOVE NFT from FIXED SALE
    const removeNFTFromFixedSale = async (_fixedSaleIndex) => {
        try {
            const result = await NFTMarketPlaceWriteContractRef.removeNFTFromFixedSale(_fixedSaleIndex)
            return result
        } catch (error) {
            throw error
        }
    }

    // Approval
    const listNFTApproval = async (collectionAddress, marketPlaceContractAddress, tokenId) => {
        try {
            const contractRef = await NFTWriteContractRef(collectionAddress)
            const checkAllowance = await contractRef.getApproved(tokenId)
            if (checkAllowance.toLowerCase() !== import.meta.env.VITE_APP_NFT_MARKET_PLACE_CONTRACT_ADDRESS.toLowerCase()) {
                const result = await contractRef.approve(marketPlaceContractAddress, tokenId)
                return result
            }
            return false
        } catch (error) {
            throw error
        }
    }
    //token contract approval 
    const tokenApprovalForMarketPlaceContract = async (marketPlaceContractAddress, amount) => {
        try {
            const value = ethers.utils.parseUnits(amount, 18)
            const checkAllowance = await tokenWriteContractRef.allowance(address, marketPlaceContractAddress)
            if (parseInt(checkAllowance, 16) <= parseInt(value, 16)) {
                const result = await tokenWriteContractRef.approve(marketPlaceContractAddress, value)
                return result
            }
            return false;
        } catch (error) {
            throw error
        }
    }
        //accept offer non listed
        const acceptOfferForNFT = async (_nonListIndex) => {
            try {
                const result = await NFTMarketPlaceWriteContractRef.acceptOfferForNFT(_nonListIndex)
                return result
            } catch (error) {
                throw error
            }
        }
    //handle metamask error
    const handleMetamaskError = (error) => {
        let errorMessage = "";
        switch (error.code) {
            case 'ACTION_REJECTED':
                errorMessage = error?.reason;
                break;
            case -32002:
                errorMessage = error?.reason;
                break;
            case 'UNPREDICTABLE_GAS_LIMIT':
                errorMessage = error.error.data.message;
                break;
            case 'INVALID_ARGUMENT':
                errorMessage = error?.reason;
                break;
            // Add more cases for specific error codes as needed
            default:
                errorMessage = "An error occurred while processing the transaction.";
                break;
        }
        // Show toaster message with errorMessage
        toast.error(errorMessage)
    };


    return {
        isWalletConnected,
        listNFTForFixedSale,
        handleMetamaskError,
        listNFTApproval,
        listNFTForAuction,
        placeNFTAuctionBid,
        purchaseNFTFromFixedSale,
        removeNFTFromAuction,
        tokenApprovalForMarketPlaceContract,
        removeNFTFromFixedSale,
        makeOfferForFixedSaleNFT,
        makeOfferForNFT,
        isWrongWalletConnected,
        acceptOfferForFixedSaleNFTFn,
        acceptOfferForNFT
    };
}

export default useContractService;
