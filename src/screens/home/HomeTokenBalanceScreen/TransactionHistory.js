import { useNavigation } from '@react-navigation/native'
import { TouchableOpacity, View } from 'react-native'

import { useGetTxHistory } from 'api'

import {
  Chip,
  PrimaryText,
  ReceiveArrowIcon,
  SendArrowIcon,
  SkeletonLoader,
  TokenCard,
} from 'components'

import { useAppContext } from 'contexts/AppContext'
import { useHomeContext } from 'contexts/HomeContext'

import { formatNumber } from 'utils/formatCurrency'
import { formatDate, formatPublicAddress } from 'utils/formatters'

export default function TransactionHistory() {
  const navigation = useNavigation()
  const { selectedNetworkDetails, selectedTokenFromHome } = useHomeContext()
  const { ethPublicKey, theme, currentLanguage } = useAppContext()
  const txHistoryQuery = useGetTxHistory({
    chainId: selectedNetworkDetails?.chainId,
    publicAddress: ethPublicKey,
    tokenAddress: selectedTokenFromHome?.contractAddress,
  })
  const transactions = txHistoryQuery?.data?.transactions
  const nativeToken = selectedNetworkDetails?.tokens?.find(
    token => token?.contractAddress === 'Native'
  )
  const txHistoryBaseUrl = txHistoryQuery?.data?.txHistoryUrl

  const navigateToTransactionDetails = ({ transaction }) => {
    navigation.navigate('TransactionDetailsScreen', {
      transaction,
      networkNativeSymbol: nativeToken?.symbol,
      txHistoryBaseUrl: txHistoryBaseUrl,
    })
  }

  return (
    <SkeletonLoader
      isLoading={txHistoryQuery?.isLoading || txHistoryQuery?.isFetching}
      height={75}
      width='100%'
      flex={1}
    >
      <View
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          rowGap: 32,
        }}
      >
        {transactions?.map(transaction => {
          const isCredit = transaction?.direction === 'SENT'
          const isFailed = transaction?.status === 'failed'
          return (
            <TouchableOpacity
              key={transaction?.transactionHash}
              onPress={() => navigateToTransactionDetails({ transaction })}
            >
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                >
                  {isFailed && <Chip name='Failed' variant='error' />}
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <TokenCard
                      uri={selectedTokenFromHome?.svg}
                      overlayIcon={isCredit ? <SendArrowIcon /> : <ReceiveArrowIcon />}
                    />
                    <View style={{ display: 'flex', flexDirection: 'column' }}>
                      <PrimaryText style={{ fontWeight: 700 }}>
                        {formatPublicAddress(
                          isCredit ? transaction?.to : transaction?.from
                        )}
                      </PrimaryText>
                      <PrimaryText>{formatDate(transaction?.date)}</PrimaryText>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                  }}
                >
                  <PrimaryText
                    style={{
                      color: isCredit ? theme.danger : theme.success,
                    }}
                  >{`${transaction?.token} ${isCredit ? '-' : ''}${formatNumber(
                    transaction?.value,
                    currentLanguage
                  )}`}</PrimaryText>
                </View>
              </View>
            </TouchableOpacity>
          )
        })}
      </View>
    </SkeletonLoader>
  )
}
