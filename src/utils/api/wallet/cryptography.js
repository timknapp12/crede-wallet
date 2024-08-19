import { Common, Hardfork } from '@ethereumjs/common'
import { FeeMarketEIP1559Transaction, LegacyTransaction } from '@ethereumjs/tx'
import { Buffer } from 'buffer'
import { ethers } from 'ethers'

import { combineShares, splitSecret } from './keys/shamir'
import { generateMnemonic } from './mnemonic'

const NUMBER_OF_SHARES = 3
const THRESHOLD = 2

export const createWallet = async importedMnemonic => {
  // generate mnemonic
  const mnemonic = importedMnemonic
    ? importedMnemonic.toLowerCase()
    : await generateMnemonic()
  // create eth wallet and get private/public keys
  const ethKeys = getEthKeys(mnemonic)
  // split the mnemonic into 3 shares
  const rawShares = await splitSecret(mnemonic, NUMBER_OF_SHARES, THRESHOLD)
  return [rawShares, ethKeys, mnemonic]
}

export const getRawSharesFromExistingMnemonic = async existingMnemonic => {
  const rawShares = await splitSecret(existingMnemonic, NUMBER_OF_SHARES, THRESHOLD)
  return rawShares
}

export const reconstructMnemonic = async shares => {
  try {
    const uint8Shares = shares.map(share => new Uint8Array(share))

    const reconstructedSecretBuffer = await combineShares(uint8Shares)
    const mnemonic = Buffer.from(reconstructedSecretBuffer).toString('utf-8')
    const ethPrivateKey = getEthPrivateKey(mnemonic)
    return { mnemonic, ethPrivateKey }
  } catch (error) {
    throw new Error(`Error combining shares: ${error.message}`)
  }
}

export const getEthKeys = mnemonic => {
  try {
    const wallet = ethers.Wallet.fromMnemonic(mnemonic)
    const ethPrivateKey = wallet.privateKey
    const ethPublicKey = wallet.address

    return { ethPrivateKey, ethPublicKey }
  } catch (error) {
    throw new Error(`Error in getEthKeys: ${error.message}`)
  }
}

export const isValidMnemonic = mnemonic => {
  try {
    ethers.Wallet.fromMnemonic(mnemonic.toLowerCase())
    return true
  } catch (error) {
    return false
  }
}

const getEthPrivateKey = mnemonic => {
  try {
    const wallet = ethers.Wallet.fromMnemonic(mnemonic)
    const ethPrivateKey = wallet.privateKey
    return ethPrivateKey
  } catch (error) {
    throw new Error(`Error in getEthPubKey: ${error.message}`)
  }
}

// this might be the way to do an HD Wallet
// function myCreateRandom() {
//   const randomBytes = ... // Use expo's method to create 16 bytes of random data
//   const mnemonic = ethers.utils.HDNode.entropyToMnemonic(randomBytes);
//   return Wallet.fromMnemonic(mnemonic);
// }
// source: https://github.com/ethers-io/ethers.js/issues/612

// TODO - create a private/public key for BTC
// Segwit style wallet has lower fees
// might have to use rn-nodeify
// might be able to use crypto-es the way that you would with crypto-js
// might have to do something to handle browser stuff with library `bitcoinjs-lib`
// https://wyckx.medium.com/running-crypto-in-expo-app-2a59c51f2141 how to handle not in the browser

// preview transaction
export const previewEthTransaction = (toAddress, valueInEther) => {
  // TODO - pass chain Id
  // TODO - pass sender's address
  const valueInWei = ethers.utils.parseEther(valueInEther.toString())
  const previewData = {
    to: toAddress,
    value: valueInWei,
  }

  return previewData
}

export const signEthTransaction = async (rawTransaction, privateKey) => {
  let signedTransaction = ''
  // remove '0x' only if its at the beginning of a private key
  const formattedPK = privateKey.replace(/^(0x)/, '')

  try {
    if (rawTransaction.transaction.type == '0x2') {
      // // NEW SIGNING METHOD -> Sepolia, ETH, GOerli
      const typedTransaction = FeeMarketEIP1559Transaction.fromTxData(
        {
          to: rawTransaction.transaction.to,
          value: rawTransaction.transaction.value,
          gasLimit: rawTransaction.transaction.gas,
          maxFeePerGas: rawTransaction.transaction.maxFeePerGas,
          maxPriorityFeePerGas: rawTransaction.transaction.maxPriorityFeePerGas,
          nonce: rawTransaction.transaction.nonce,
          chainId: rawTransaction.transaction.chainId,
          data: rawTransaction.transaction.input,
          type: '0x02',
        },
        { chainId: rawTransaction.chainId }
      )

      const signedTx = typedTransaction.sign(Buffer.from(formattedPK, 'hex'))
      const serializedTx = signedTx.serialize()
      signedTransaction = ethers.utils.hexlify(serializedTx)
    } else {
      //// OLD SIGNING METHOD -> Rewards chains
      const common = Common.custom({
        chainId: rawTransaction.chainId,
        hardfork: Hardfork.Istanbul,
      }) //this is needed to know how to sign the transaction

      const typedTransaction = new LegacyTransaction(
        {
          to: rawTransaction.transaction.to,
          value: rawTransaction.transaction.value,
          gasLimit: rawTransaction.transaction.gas,
          gasPrice: rawTransaction.transaction.gasPrice,
          nonce: rawTransaction.transaction.nonce,
          chainId: rawTransaction.chainId,
          data: '',
          type: rawTransaction.transaction.type,
        },
        { common }
      )

      const signedTx = typedTransaction.sign(Buffer.from(formattedPK, 'hex'))
      const serializedTx = signedTx.serialize()
      signedTransaction = ethers.utils.hexlify(serializedTx)
    }
  } catch (e) {
    throw new Error(e)
  }
  return signedTransaction
}

export const xorStrings = (str1, str2, str3) => {
  str1 = str1.toLowerCase().trim()
  str2 = str2.toLowerCase().trim()
  str3 = str3.toLowerCase().trim()

  // convert strings to DataHexStrings
  const str1Bytes = ethers.utils.formatBytes32String(str1)
  const str2Bytes = ethers.utils.formatBytes32String(str2)
  const str3Bytes = ethers.utils.formatBytes32String(str3)

  // hash the DataHexStrings
  const str1Hash = ethers.utils.sha256(str1Bytes)
  const str2Hash = ethers.utils.sha256(str2Bytes)
  const str3Hash = ethers.utils.sha256(str3Bytes)

  let result = ''
  for (let i = 0; i < Math.min(str1Hash.length, str2Hash.length, str3Hash.length); i++) {
    const charCode1 = str1Hash.charCodeAt(i)
    const charCode2 = str2Hash.charCodeAt(i)
    const charCode3 = str3Hash.charCodeAt(i)
    const xorResult = charCode1 ^ charCode2 ^ charCode3
    result += String.fromCharCode(xorResult)
  }

  return result
}
