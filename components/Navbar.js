import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    MDBContainer, MDBModal, MDBModalBody, MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink, 
    MDBTooltip, MDBNavbarToggler, MDBCollapse, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, 
    MDBDropdownItem, MDBIcon, MDBRow, MDBCol, MDBListGroup, MDBListGroupItem, MDBCard
} from "mdbreact";
import axios from 'axios';
import { 
    useMoralis, useChain, useMoralisWeb3ApiCall, useMoralisWeb3Api
} from "react-moralis";
import NativeBalance from "./Moralis/NativeBalance";
import NativeUsdBalance from "./Moralis/NativeUsdBalance";
import { AvaxLogo, PolygonLogo, BSCLogo, ETHLogo } from "./Moralis/Logos";
import Avatar from 'react-avatar';

export default function Navbar() {
    const { 
        authenticate, isAuthenticated, user, login, logout, enableWeb3, isWeb3Enabled, isWeb3EnableLoading, web3EnableError, Moralis
    } = useMoralis();
    const Web3Api = useMoralisWeb3Api();
    const alphaVantageApi = process.env.NEXT_PUBLIC_ALPHAVANTAGE_API_KEY;
    const [chainName, setChainName] = useState("polygon");
    const [path, setPath] = useState("");

    //------ Moralis Web3 API methods for Native, ERC20 & NFT  ------//
    const { 
        fetch: nativeFetch, 
        data: nativeData, 
        error, 
        isLoading 
    }   =   useMoralisWeb3ApiCall(Web3Api.account.getNativeBalance, {
                chain: chainName,
            });

    const {
        fetch: tokenFetch, 
        data: tokenData, 
        error: tokenError, 
        isLoading: tokenIsLoading, 
    }   =   useMoralisWeb3ApiCall(Web3Api.account.getTokenBalances, {
                chain: chainName,
            });

    const {
        fetch: nftFetch,
        nfData: nftData,
        error: nftError,
        isLoading: nftLoading,
    }   =   useMoralisWeb3ApiCall(Web3Api.account.getNFTs, {
                chain: chainName,
            });

    //----------------- Setting User in state   ----------
    const [userState, setUserState] = useState(null);
    const [openModel, setOpenModel] = useState(false);

    const { switchNetwork, chainId, chain } = useChain();
    const [walletUser, setWalletUser] = useState(null);
    const [address, setAddress] = useState(null);
    const [chains, setChain] = useState("polygon test");
    const [price, setPrice] = useState(0);
    const [copied, setCopied] = useState(false);
    const [modal1, setModal1] = useState(false);
    const [modal2, setModal2] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [isOpen, setOpen] = useState(false);
    const [isLive, setIsLive] = useState(false);
    let fontColor = "black";
    let bgColor = "white";
    let origin = '';
    let pathname = '';
    let hostname = '';
    let key = 0;
    
    const menuItems = [
        {
          key: "0x1",
          value: "Ethereum",
          icon: <ETHLogo />,
          symbol: "eth",
        },
        {
          key: "0xa86a",
          value: "Avalanche",
          icon: <AvaxLogo />,
          symbol: "avax",
        },
        {
          key: "0x38",
          value: "Binance",
          icon: <BSCLogo />,
          symbol: "bnb",
        },
        {
          key: "0x89",
          value: "Polygon",
          icon: <PolygonLogo />,
          symbol: "matic",
        },
        {
          key: "0xfa",
          value: "Fantom",
          icon: <PolygonLogo />,
          symbol: "ftm",
        },
    ];

    useEffect(() => {
        const connectorId = window.localStorage.getItem("connectorId");
        hostname = window.location.hostname;
        pathname = window.location.pathname;
        setPath(window.location.pathname);
        origin = window.location.href;
        console.log("Origin", origin);
        console.log("Hostname", hostname);
        console.log("Pathname", pathname);

        if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) enableWeb3({ provider: connectorId });
        //call API every 5 seconds
        const interval = setInterval(() => {
                if (user) {
                    setUserState(user);
                    nativeFetch();
                    tokenFetch();
                    nftFetch();
                }
                if (pathname == "/live") {
                    setIsLive(true);
                }
            }
        , 6000);
        //clear the interval
        console.log(user, "USER");
        console.log(tokenData, "TOKEN DATA");
        // eslint-disable-next-line react-hooks/exhaustive-deps
        return () => clearInterval(interval);
    }, [isAuthenticated, isWeb3Enabled, user]);

    function toggleCollapse() {
        setOpen(!isOpen);
    }

    async function connect() {
        if (isAuthenticated) {
            await getCurrentChain();
            await nativeFetch();
            getCryptoPrice();
            setModal2(!modal2);
        } else {
            setModal1(!modal1);
        }
    }

    function disconnect() {
        setModal2(!modal2);
        logout();
    }

    async function getCryptoPrice() {
        let cryptoPrice = 0;
        setPrice(cryptoPrice);
        await axios
        .get(
            'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency='
            + chains + '&to_currency=USD&apikey=' + alphaVantageApi
        )
        .then(result => {
            // "5. Exchange Rate": "265965.63200000"
            if(result.data['Realtime Currency Exchange Rate'] != null) {
                const priceString = result.data['Realtime Currency Exchange Rate']['5. Exchange Rate'];
                cryptoPrice = Number(priceString)
                setPrice(cryptoPrice);
            }
            console.log(result);
        })
        .catch(error => {
            console.log(error);
        });
        return cryptoPrice;
    }

    async function walletConn() {
        setModal1(!modal1);
        await authenticate({signingMessage:"Screen Sign In"});
        enableWeb3();
        try{
            let addr = user.get('ethAddress');
            setAddress(addr);
            console.log("User Address: " + addr);
        } catch(e) { 
            console.error(e);
        }
    }
        
    async function walletConnect() {
        setModal1(!modal1);
        await authenticate({ provider: "walletconnect", signingMessage:"Lore Sign In"});
        enableWeb3({ provider: "walletconnect" });
        if (isAuthenticated && user ) {
            window.location.reload();
            setWalletUser(user);
        }
    }

    function getShortAddr(addr) {
        let start = addr.substring(0, 5);
        let end = addr.slice(-4);
        return start + "..." + end;
    }

    function getShortenedAddr(addr) {
        let start = addr.substring(0, 10);
        let end = addr.slice(-10);
        return start + "..." + end;
    }

    function copyAddr(){
        navigator.clipboard.writeText(user.get('ethAddress'));
        setCopied(true);
    }

    async function switchChains(newChain){
        setChain(newChain);
        getCryptoPrice();
        const selected = menuItems.find((item) => item.symbol === newChain);
        setChainName(selected.value);
        await switchNetwork(selected.key);
    }

    async function getCurrentChain() {
        const web3 = await Moralis.enableWeb3();
        // const chainId = web3.currentProvider.chainId;
        // console.log("Chain Id: " + chainId);
        // const selected = menuItems.find((item) => item.key === chainId);
        // console.log("Chain Symbol: " + selected.symbol);
        // setChain(selected.symbol);
    }

    return (
        <>
            <MDBNavbar transparent className="z-depth-0" color="white" expand="md" fixed="top" style={{ fontColor:'black' }}>
                <MDBNavbarBrand className='py-0 font-weight-bold' style={{ color: fontColor }}>
                    <Link href="/"><img src="./assets/image/logo.png" height="25px" style={{height:"25px"}}/></Link>
                </MDBNavbarBrand>
                <MDBNavbarToggler onClick={() => { toggleCollapse() }}/>
                <MDBCollapse id="navbarCollapse3" isOpen={isOpen} navbar>
                    <MDBNavbarNav left>
                        <MDBNavItem active>
                            <a><MDBNavbarBrand><Link href="/"><strong style={{ color: "#000000" }}>Home</strong></Link></MDBNavbarBrand></a>
                        </MDBNavItem>
                        {/* <MDBNavItem>
                            <a><MDBNavbarBrand><Link href="/create"><strong style={{ color: "#680de4" }}>Create</strong></Link></MDBNavbarBrand></a>
                        </MDBNavItem>
                        <MDBNavItem>
                            <a>
                                <MDBNavbarBrand>
                                    <Link href="/live">
                                        <strong style={{ color: "#680de4" }}>
                                            { 
                                                isLive
                                                    ?   <div key={key}>Live <b style={{ color: "red", fontSize:"1em"}}>&bull;</b></div>
                                                    :   <div key={key}>Live</div>
                                            }
                                        </strong>
                                    </Link>
                                </MDBNavbarBrand>
                            </a>
                        </MDBNavItem> */}
                    </MDBNavbarNav>

                    {/* <MDBCard> */}
                    <MDBNavbarNav right>
                        <MDBNavItem>
                            <MDBNavbarBrand>
                                <strong  style={{ color: '#000000' }}>
                                    <MDBTooltip
                                        placement='bottom'
                                        domElement
                                        style={{ display: 'block' }}
                                    >
                                    <a onClick={() => { connect() }}> 
                                        {
                                            isAuthenticated && user 
                                            ? <div><b style={{color:"#89df52"}}>&#9679;</b>{getShortAddr(user.get('ethAddress'))}</div>
                                            : <b className="">connect wallet</b>
                                        }
                                    </a>
                                    <span> 
                                        { isAuthenticated && user ?  user.get('ethAddress') : "connect wallet" }
                                    </span>
                                    </MDBTooltip>
                                </strong>
                            </MDBNavbarBrand>
                        </MDBNavItem>
                    </MDBNavbarNav>
                    {/* </MDBCard> */}
                </MDBCollapse>
            </MDBNavbar>

            <MDBContainer>
                <MDBModal isOpen={modal1} toggle={() => { setModal1(!modal1) }} side position="top-right">
                    <MDBModalBody toggle={() => {setModal1(!modal1)}}  className="form">
                        <MDBContainer className="form">
                            <MDBRow>
                                <MDBCol md="12">
                                    <p className="h5 text-center mb-4 text"> 
                                        Connect Wallet
                                    </p>
                                </MDBCol>

                                <button style={{ width: "100%" }} type="button" className="btn btn-dark" onClick={() => { walletConn() }}><img src="./assets/image/metamask.png" height="30" alt="metamask logo"/> Metamask</button>
                                <button style={{ width: "100%" }} type="button" className="btn btn-dark" onClick={() => { walletConnect() }} hover><img src="./assets/image/wallet-connect.svg" height="25" alt="walletconnect logo"/> Wallet Connect</button>
                                <br/>
                            </MDBRow>
                        </MDBContainer>
                    </MDBModalBody>
                </MDBModal>

                <MDBModal isOpen={modal2} toggle={() => { setModal2(!modal2) }} side position="top-right">
                    <MDBModalBody toggle={() => { setModal2(!modal2) }}  className="form">
                        <MDBContainer className="form">
                            <h5 className="font-weight-bold text-center mt-4 mb-3">
                                &nbsp;
                                { isAuthenticated && user 
                                    ?  <div>
                                            <b style={{ color: "#89df52" }}>&#9679;</b> {getShortenedAddr(user.get('ethAddress'))} &nbsp;
                                            { copied ?  <MDBIcon onClick={() => { copyAddr() }} icon="check" style={{color:"green"}} /> : <MDBIcon onClick={() => { copyAddr() }} far icon="copy" /> }    
                                        </div> 
                                    : "connect wallet" } &nbsp;
                                
                            </h5>

                            <MDBListGroup style={{ width: "99%"}}>
                                <MDBListGroupItem className="text-center" style={{ border:"none" }}>
                                    <MDBRow>
                                        <MDBCol md="3">
                                            <div style={{float:"right"}}>
                                                <Avatar style={{float:"right"}}
                                                    src="./assets/image/matic.png"
                                                    color={Avatar.getRandomColor('sitebase', [])}
                                                    size={25} 
                                                    className="mx-auto mb-md-0 mb-4 z-depth-0 img-fluid"
                                                    round={true}
                                                />
                                            </div>
                                        </MDBCol>
                                        <MDBCol md="8">
                                            <h5><b><NativeBalance /></b></h5>
                                        </MDBCol>
                                    </MDBRow>
                                </MDBListGroupItem>
                            </MDBListGroup>
                        
                            <div>
                                <a onClick={() => { disconnect()}} className="btn btn-black rounded" style={{width:"100%", color: '#680de4'}}>Disconnect</a>
                            </div>
                            <br/>
                        </MDBContainer>
                    </MDBModalBody>
                </MDBModal>
            </MDBContainer>
        </>
    );
}