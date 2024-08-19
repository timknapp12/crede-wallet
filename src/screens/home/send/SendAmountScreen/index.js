import { useNavigation } from '@react-navigation/native'
import { BigNumber, ethers } from 'ethers'
import * as React from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import { useCreateRawTransaction, useGetBalance } from 'api'

import {
  Button,
  DoubleArrowIcon,
  H5Error,
  KeyboardViewContainer,
  PrimaryText,
  Row,
  SecondaryText,
} from 'components'

import { useAppContext } from 'contexts/AppContext'
import { useSendContext } from 'contexts/SendContext'

import i18n from 'translations/config'

import formatCurrency, { formatNumber } from 'utils/formatCurrency'

const { t } = i18n

const largeFont = 36

const SendAmountScreen = () => {
  const { theme, ethPublicKey, currentLanguage, currentCurrency } = useAppContext()
  const {
    selectedAsset,
    setAmount,
    amount,
    tokenAmount,
    setTokenAmount,
    walletAddress,
    selectedNetwork,
    setRawTransaction,
    isErc20,
  } = useSendContext()

  const tokenBalanceQuery = useGetBalance({
    publicAddress: ethPublicKey,
    chainId: selectedNetwork.chainId,
    contractAddress: selectedAsset.contractAddress,
  })
  const tokenBalanceInWei =
    tokenBalanceQuery?.data?.balance?.toString() || BigNumber.from('0000000000000000000')
  const userTokenBalance = ethers.utils.formatUnits(
    tokenBalanceInWei,
    selectedAsset?.decimals
  )
  const userDollarBalance = tokenBalanceQuery?.data?.usdAmount || 0
  const selectedTokenPrice = tokenBalanceQuery?.data?.price?.tokenUSDPrice || 0

  const hideDollarAmount = !selectedTokenPrice

  const { mutateAsync: createRawTransaction } = useCreateRawTransaction()

  const [toggled, setToggled] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  const dollarFontSize = useSharedValue(largeFont)
  const tokenFontSize = useSharedValue(hideDollarAmount ? largeFont : 16)
  const dollarColor = useSharedValue(theme.textDefault)
  const tokenColor = useSharedValue(hideDollarAmount ? theme.textDefault : theme.textWeak)

  const dollarInputRef = React.useRef()
  const tokenInputRef = React.useRef()

  React.useEffect(() => {
    if (!hideDollarAmount) {
      // adjust token amount when dollar value is changed
      if (selectedTokenPrice && !toggled) {
        setTokenAmount((amount / selectedTokenPrice).toFixed(6))
      }
      // adjust dollar amount when token value is changed
      if (selectedTokenPrice && toggled) {
        // round dollar amount to 2 decimals
        setAmount((tokenAmount * selectedTokenPrice).toFixed(2))
      }
    }
  }, [amount, tokenAmount])

  React.useEffect(() => {
    if (!hideDollarAmount) {
      if (dollarInputRef?.current?.isFocused()) {
        tokenInputRef.current.focus()
      } else if (tokenInputRef?.current?.isFocused()) {
        dollarInputRef.current.focus()
      }
    }
  }, [toggled])

  const handleSwitchInputType = () => {
    const toggledValue = !toggled

    dollarFontSize.value = withTiming(toggledValue ? 16 : largeFont)
    tokenFontSize.value = withTiming(toggledValue ? largeFont : 16)

    dollarColor.value = withTiming(toggledValue ? theme.textWeak : theme.textDefault)
    tokenColor.value = withTiming(toggledValue ? theme.textDefault : theme.textWeak)

    setToggled(toggledValue)
  }

  const dollarAnimatedStyles = useAnimatedStyle(() => ({
    fontSize: dollarFontSize.value,
    color: dollarColor.value,
  }))

  const tokenAnimatedStyles = useAnimatedStyle(() => ({
    fontSize: tokenFontSize.value,
    color: tokenColor.value,
  }))

  const navigation = useNavigation()
  async function handleConfirmAmount() {
    setIsLoading(true)
    try {
      const rawTransaction = await createRawTransaction({
        chainId: selectedNetwork.chainId,
        sender: ethPublicKey,
        value: ethers.utils.parseUnits(tokenAmount, selectedAsset?.decimals).toString(),
        toAddress: walletAddress,
        contractAddress: isErc20 ? selectedAsset?.contractAddress : null,
      })
      setRawTransaction(rawTransaction)
      navigation.navigate('PreviewSendScreen')
    } catch (e) {
      setError(t('An error occurred'))
    } finally {
      setIsLoading(false)
    }
  }

  const numToken = Number(tokenAmount)
  const disabled = !tokenAmount || numToken > userTokenBalance || numToken === 0
  const showFundsError = numToken > userTokenBalance

  return (
    <KeyboardViewContainer>
      <View style={{ flex: 1 }}>
        <View style={styles.inner}>
          <View></View>
          <View>
            <View style={styles.viewRowContainer}>
              {!hideDollarAmount && <View style={{ flex: 1 }}></View>}
              <View
                style={[
                  styles.viewOuterContainer,
                  toggled && { flexDirection: 'column-reverse' },
                  !hideDollarAmount && {
                    marginRight: 42,
                    marginLeft: amount?.length > 6 ? 0 : 42,
                  },
                ]}
              >
                {!hideDollarAmount && (
                  <Animated.View style={styles.viewInnerContainer}>
                    <Row $gap='0px' $width='97%'>
                      <Animated.Text
                        style={{ ...dollarAnimatedStyles, fontWeight: 'bold' }}
                      >
                        $
                      </Animated.Text>
                      <TextInput
                        onChangeText={amountValue => {
                          setAmount(amountValue)
                          setError('')
                        }}
                        autoComplete='off'
                        returnKeyType='go'
                        keyboardType='decimal-pad'
                        autoFocus
                        style={{
                          width: 'auto',
                          minWidth: 20,
                          color: toggled ? theme.textWeak : theme.textDefault,
                        }}
                        placeholder='0'
                        placeholderTextColor={theme.textWeak}
                        editable={!toggled}
                        fontSize={!toggled ? largeFont : 16}
                        ref={dollarInputRef}
                        value={amount?.toString()}
                        maxLength={10}
                      />
                    </Row>
                  </Animated.View>
                )}
                <Animated.View style={[styles.viewInnerContainer, { gap: 4 }]}>
                  <TextInput
                    onChangeText={amountValue => {
                      setTokenAmount(amountValue)
                      setError('')
                    }}
                    autoComplete='off'
                    returnKeyType='go'
                    keyboardType='decimal-pad'
                    style={{
                      width: 'auto',
                      color:
                        hideDollarAmount || toggled ? theme.textDefault : theme.textWeak,
                      minWidth: 20,
                    }}
                    autoFocus={hideDollarAmount}
                    placeholder='0'
                    placeholderTextColor={theme.textWeak}
                    editable={hideDollarAmount || toggled}
                    fontSize={hideDollarAmount || toggled ? largeFont : 16}
                    ref={tokenInputRef}
                    value={tokenAmount?.toString()}
                    maxLength={10}
                  />
                  <Animated.Text style={{ ...tokenAnimatedStyles, fontWeight: 'bold' }}>
                    {` ${selectedAsset?.symbol}`}
                  </Animated.Text>
                </Animated.View>
              </View>
              {!hideDollarAmount && (
                <View style={styles.buttonViewContainer}>
                  <Button
                    style={{
                      alignSelf: 'flex-end',
                      width: 36,
                    }}
                    icon={<DoubleArrowIcon />}
                    onPress={handleSwitchInputType}
                  />
                </View>
              )}
            </View>
            {showFundsError ? (
              <H5Error
                style={[
                  styles.errorText,
                  !hideDollarAmount && { marginRight: amount?.length > 6 ? 42 : 0 },
                ]}
              >
                {t('Insufficient funds')}
              </H5Error>
            ) : null}
          </View>
          <View style={styles.outerBottomContainer}>
            <View style={styles.insideFooterContainer}>
              <SecondaryText>
                {t('Your')} {selectedAsset?.symbol} {t('Balance')}
              </SecondaryText>
              <View style={styles.outsideFooterContainer}>
                {!hideDollarAmount && (
                  <PrimaryText style={{ fontWeight: 700 }}>
                    {formatCurrency(userDollarBalance, currentCurrency, currentLanguage)}
                  </PrimaryText>
                )}
                <View style={{ ...styles.viewInnerContainer, gap: 6 }}>
                  <SecondaryText>
                    {formatNumber(userTokenBalance, currentLanguage)}
                  </SecondaryText>
                  <SecondaryText>{selectedAsset?.symbol}</SecondaryText>
                </View>
              </View>
            </View>
            {error ? <H5Error style={styles.errorText}>{error}</H5Error> : null}
          </View>
        </View>
        <View
          style={{
            ...styles.buttonContainer,
            backgroundColor: theme.backgroundDefault,
          }}
        >
          <Button
            onPress={handleConfirmAmount}
            primary
            disabled={disabled}
            isLoading={isLoading}
          >
            {t('Preview Transaction')}
          </Button>
        </View>
      </View>
    </KeyboardViewContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textInput: {
    height: 40,
    borderColor: '#000000',
    borderBottomWidth: 1,
    marginBottom: 36,
  },
  viewOuterContainer: {
    alignItems: 'center',
    gap: 8,
  },
  viewInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  outerBottomContainer: {
    width: '100%',
    gap: 24,
  },
  insideFooterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    flexWrap: 'wrap',
  },
  outsideFooterContainer: {
    gap: 4,
    alignItems: 'flex-end',
  },
  buttonContainer: {
    padding: 24,
    paddingTop: 16,
  },
  buttonViewContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  viewRowContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 6,
  },
})

export default SendAmountScreen
