import { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter } from "react-router-dom";
import '@rainbow-me/rainbowkit/styles.css';
import { initFlowbite } from 'flowbite';
import "./index.scss"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  RainbowKitProvider, 
  lightTheme, getDefaultWallets
} from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import {
  polygonMumbai,
  xdcTestnet
} from 'wagmi/chains';

import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

import AllRoutes from './Routes/Routes';
import { getItem } from './services/localStorageService';
import { socket } from './services/socket.io';


const { chains, provider } = configureChains(
  [ 
    polygonMumbai],
  [
    jsonRpcProvider({
      rpc: chain => {
        return ({ http:chain.rpcUrls.public.http[0] })
      }
    }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  projectId: 'c6c87cc10f645e92f464fc998ce1f0a0',
  chains
});

const wagmiConfig = createClient({
  autoConnect: true,
  connectors,
  provider
})

function App() {

  const {id} = getItem('user') || {}
  useEffect(() => {
    initFlowbite();
  });

  useEffect(()=>{
   if(id) {
     socket.emit('newUser',id)
   }
  },[])
  
  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        closeButton={
          <button
            style={{
              width: "30px",
              backgroundColor: "inherit",
              border: "none",
              color: "white",
            }}
          >
            X
          </button>
        }
      />
      <WagmiConfig  client={wagmiConfig}>
        <RainbowKitProvider coolMode chains={chains} modalSize="compact" theme={
lightTheme({

          accentColorForeground: 'white',
          borderRadius: 'small',
          fontStack: 'system',
          overlayBlur: 'small', 
          connectButtonText: "#000",


        })}>
          <BrowserRouter>
            <AllRoutes />
          </BrowserRouter>
        </RainbowKitProvider>
      </WagmiConfig>
        
    </>
  )
}

export default App
