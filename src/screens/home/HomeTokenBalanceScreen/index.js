import { useQueryClient } from '@tanstack/react-query'
import { BigNumber, ethers } from 'ethers'
import * as WebBrowser from 'expo-web-browser'
import { useCallback } from 'react'
import { StyleSheet } from 'react-native'

import { useGetBalance } from 'api'

import {
  BorderlessButtonText,
  Column,
  DecreaseIcon,
  Gap,
  H3,
  H5, // H6,
  IncreaseIcon,
  Line,
  OpenIcon, // RefreshIcon,
  Row,
  ScreenContainer,
  ScreenTitle,
  SkeletonLoader,
} from 'components'

import { useAppContext } from 'contexts/AppContext'
import { useHomeContext } from 'contexts/HomeContext'

import { size } from 'styles/constants'

import i18n from 'translations/config'

import formatCurrency from 'utils/formatCurrency'

import {
  PercRow,
  PrimaryTextPerc, // UnderlineButton,
  UnderlineButtonPrimary,
} from '../HomeScreen/homeScreen.styles'
//@ts-ignore
import TransactionHistory from './TransactionHistory'

const { t } = i18n
const { s4, s8, s16, s24 } = size

// TODO - get real data for updateLapsedTime
// TODO - functionality for refresh
const HomeTokenBalanceScreen = () => {
  const queryClient = useQueryClient()
  const { selectedTokenFromHome, selectedNetworkDetails } = useHomeContext()
  const { symbol, projectUrl } = selectedTokenFromHome
  const { ethPublicKey, logEvent, theme, currentLanguage, currentCurrency } =
    useAppContext()
  const tokenBalanceQuery = useGetBalance({
    publicAddress: ethPublicKey,
    chainId: selectedNetworkDetails.chainId,
    contractAddress: selectedTokenFromHome.contractAddress,
  })

  const isTokenPriceAvailable = !!tokenBalanceQuery?.data?.price?.tokenUSDPrice
  const marketPrice = tokenBalanceQuery?.data?.price?.tokenUSDPrice

  const tokenBalanceInWei =
    tokenBalanceQuery?.data?.balance?.toString() || BigNumber.from('0000000000000000000')
  const tokenBalance = ethers.utils.formatUnits(
    tokenBalanceInWei,
    selectedTokenFromHome?.decimals
  )

  const currencyBalance = tokenBalanceQuery?.data?.usdAmount || 0

  // const updateLapsedTime = 2
  const percentage = tokenBalanceQuery?.data?.price?.percentChange24h
  const isIncreased = percentage > 0

  // const updateString = t('{time}m ago').replace('{time}', updateLapsedTime)
  const openProjectInWeb = async () => await WebBrowser.openBrowserAsync(projectUrl)

  const openExpInWeb = async () => {
    await WebBrowser.openBrowserAsync(
      `${selectedNetworkDetails?.explorerUrl}address/${ethPublicKey}`
    )
    logEvent(`open_link_to_${selectedNetworkDetails?.name}_explorer`)
  }

  const onRefresh = useCallback(async () => {
    queryClient.invalidateQueries({
      queryKey: [
        'txHistory',
        selectedNetworkDetails?.chainId,
        ethPublicKey,
        selectedTokenFromHome?.contractAddress,
      ],
    })
    queryClient.invalidateQueries({
      queryKey: [
        'getBalance',
        ethPublicKey,
        selectedNetworkDetails?.chainId,
        selectedTokenFromHome?.contractAddress,
      ],
    })
  }, [])

  return (
    <ScreenContainer paddingTop='8px' onRefresh={onRefresh} enableRefresh>
      <Column $align='flex-start'>
        <Column $align='flex-start'>
          <H3>{t('Balance')}</H3>
          <SkeletonLoader
            isLoading={tokenBalanceQuery?.isLoading || tokenBalanceQuery?.isFetching}
            height={70}
            width='100%'
            flex={1}
          >
            <Column $gap={s4}>
              <ScreenTitle
                style={styles.priceText}
              >{`${tokenBalance} ${symbol}`}</ScreenTitle>
              <H3>{formatCurrency(currencyBalance, currentCurrency, currentLanguage)}</H3>
            </Column>
          </SkeletonLoader>
          <Gap height={s16} />
          <Line />
          <Column>
            {isTokenPriceAvailable && (
              <>
                <Column $gap={s24}>
                  <Row $justify='space-between'>
                    <H3>{t('Price')}</H3>
                    <Row $width='auto'>
                      {/* <H6>{updateString}</H6>
                      <UnderlineButton>
                        <RefreshIcon height={16} width={16} />
                        <H5 style={styles.bold}>{t('Refresh')}</H5>
                      </UnderlineButton> */}
                    </Row>
                  </Row>
                  <Column $gap={s8}>
                    <Row $justify='space-between' $gap={s16}>
                      <H5 style={styles.flex}>{t('Market Price')}</H5>
                      <Row $width='auto' $justify='flex-end' style={styles.flex}>
                        <H5>{t('24 Hour Change')}</H5>
                      </Row>
                    </Row>
                    <Row $justify='space-between' $gap={s16}>
                      <SkeletonLoader
                        isLoading={
                          tokenBalanceQuery?.isLoading || tokenBalanceQuery?.isFetching
                        }
                        height={30}
                        width={150}
                        flex={1}
                      >
                        <H3 style={styles.flex}>
                          {marketPrice &&
                            formatCurrency(marketPrice, currentCurrency, currentLanguage)}
                        </H3>
                      </SkeletonLoader>
                      <Row $width='auto' $justify='flex-end' style={styles.flex}>
                        <PercRow $isIncreased={isIncreased}>
                          {isIncreased ? <IncreaseIcon /> : <DecreaseIcon />}
                          <PrimaryTextPerc $isIncreased={isIncreased}>
                            {percentage?.toFixed(2)}%
                          </PrimaryTextPerc>
                        </PercRow>
                      </Row>
                    </Row>
                  </Column>
                </Column>
                <Gap height={s16} />
                <Line />
              </>
            )}
            <Gap height={s16} />
            <Column $align='flex-start' $gap={s24}>
              <H3>{t('Resources')}</H3>
              <Column $align='flex-start' $gap={s8}>
                <UnderlineButtonPrimary onPress={openProjectInWeb}>
                  <BorderlessButtonText>{t('Open Project Website')}</BorderlessButtonText>
                  <OpenIcon color={theme.brandSecondary} />
                </UnderlineButtonPrimary>
                <UnderlineButtonPrimary onPress={openExpInWeb}>
                  <BorderlessButtonText>
                    {t('See Transactions in Explorer')}
                  </BorderlessButtonText>
                  <OpenIcon color={theme.brandSecondary} />
                </UnderlineButtonPrimary>
              </Column>
            </Column>
            <Gap height={s16} />
            <Line />
            <Gap height={s16} />
            <Column $align='flex-start' $gap={s24} style={{ flex: 1 }}>
              <H3>{t('Transactions')}</H3>
              <TransactionHistory />
            </Column>
          </Column>
        </Column>
      </Column>
    </ScreenContainer>
  )
}

export default HomeTokenBalanceScreen

const styles = StyleSheet.create({
  priceText: {
    textAlign: 'center',
  },
  bold: {
    fontWeight: 600,
  },
  flex: {
    flex: 1,
  },
})
