import PropTypes from 'prop-types'
import { createContext, useContext, useEffect, useState } from 'react'

const SendContext = createContext({})

export const useSendContext = () => useContext(SendContext)

const SendContextProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState('')
  const [selectedAsset, setSelectedAsset] = useState('')
  const [selectedNetwork, setSelectedNetwork] = useState('')
  const [amount, setAmount] = useState('')
  const [tokenAmount, setTokenAmount] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [rawTransaction, setRawTransaction] = useState({})
  const [scannerLink, setScannerLink] = useState('')
  const [isErc20, setIsErc20] = useState(false)
  const [isError, setIsError] = useState('')

  useEffect(() => {
    const isErc20boolean = selectedAsset?.contractAddress !== 'Native'
    setIsErc20(isErc20boolean)
  }, [selectedAsset])

  return (
    <SendContext.Provider
      value={{
        walletAddress,
        setWalletAddress,
        selectedAsset,
        setSelectedAsset,
        amount,
        setAmount,
        isSuccess,
        setIsSuccess,
        tokenAmount,
        setTokenAmount,
        selectedNetwork,
        setSelectedNetwork,
        rawTransaction,
        setRawTransaction,
        scannerLink,
        setScannerLink,
        isErc20,
        isError,
        setIsError,
      }}
    >
      {children}
    </SendContext.Provider>
  )
}

SendContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default SendContextProvider
