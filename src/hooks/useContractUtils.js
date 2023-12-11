import { toast } from "react-toastify";
import {
    useAccount,
    useContract,
    useNetwork,
    useSigner,
    useSwitchNetwork
} from "wagmi";

import NFT_MARKET_PLACE_ABI from "../abi/NFTMarketPlace.abi.json";
import NFT_ABI from "../abi/NFTContract.abi.json";
import TOKEN_CONTRACT_ABI from "../abi/TokenContract.abi.json";
import { ethers } from "ethers";
import { getItem } from "../services/localStorageService";

function useContractUtilServices() {
    const { switchNetworkAsync } = useSwitchNetwork()
    const { walletAddress } = getItem('user')
    const { address } = useAccount();
    const { chain } = useNetwork();

    const { data: signer } = useSigner({
        onError(error) {
            throw error;
        },
    });


    //   let provider = new ethers.providers.JsonRpcProvider(
    //     process.env.REACT_APP_NETWORK_RPC
    //   );


    //token contract ref
    const tokenWriteContractRef = useContract({
        address: import.meta.env.VITE_APP_TOKEN_CONTRACT_ADDRESS,
        abi: TOKEN_CONTRACT_ABI,
        signerOrProvider: signer,
    });

    //nft market place ref
    const NFTMarketPlaceWriteContractRef = useContract({
        address: import.meta.env.VITE_APP_NFT_MARKET_PLACE_CONTRACT_ADDRESS,
        abi: NFT_MARKET_PLACE_ABI,
        signerOrProvider: signer,
    });

    //to get dynamic contract object for mint nft
    async function NFTWriteContractRef(collectionAddress) {
        if (!collectionAddress) return null
        return new ethers.Contract(collectionAddress, NFT_ABI, signer);
    }


    const isWalletConnected = async (chainId) => {
        try {
            if (!address) {
                return false;
            } else if (chain.id != chainId) {
                await switchNetworkAsync(chainId)
                return true
            } else {
                return true;
            }
        } catch (error) {
            throw error;
        }
    };

    const isWrongWalletConnected =  () => {
        try {
            if (address && address.toLowerCase() !== walletAddress) {
                return true;
            } else {
                return false
            }
        } catch (error) {
            throw error;
        }
    };


    return {
        NFTMarketPlaceWriteContractRef,
        tokenWriteContractRef,
        NFTWriteContractRef,
        isWalletConnected,
        isWrongWalletConnected
    };
}

export default useContractUtilServices;
