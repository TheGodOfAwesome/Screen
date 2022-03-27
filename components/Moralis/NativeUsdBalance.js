// import axios from 'axios';
import { useMoralis, useNativeBalance } from "react-moralis";

function NativeUsdBalance(props) {
    const { coin } = props;
    // const alphaVantageApi = process.env.NEXT_PUBLIC_ALPHAVANTAGE_API_KEY;
    const { data: balance } = useNativeBalance(props);
    const { account, isAuthenticated } = useMoralis();
    let price = 0.00;

    // async function getCryptoPrice() {
    //     axios
    //     .get(
    //         'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency='
    //         + coin + '&to_currency=USD&apikey=' + alphaVantageApi
    //     )
    //     .then(result => {
    //         // "5. Exchange Rate": "265965.63200000"
    //         if(result.data['Realtime Currency Exchange Rate'] != null) {
    //             const priceString = result.data['Realtime Currency Exchange Rate']['5. Exchange Rate'];
    //             price = Number(priceString)
    //             console.log(price);
    //         }
    //         console.log(result);
    //     })
    //     .catch(error => {
    //         console.log(error);
    //     });
    //     return price;
    // }
  
    // getCryptoPrice();
    // if (!account || !isAuthenticated || price == 0) return null;
    if (!account || !isAuthenticated) return null;
    return balance.formatted;
    // return price;
}

export default NativeUsdBalance;