import { useState } from "react";
import { useTokenPrice } from "react-moralis";

function TokenPrices(props) {
  const { data: formattedData } = useTokenPrice(props);
  const [isUSDMode, setIsUSDMode] = useState(true);

  return formattedData && (isUSDMode ? formattedData.formattedUsd : formattedData.formattedNative);
}

export default TokenPrices;