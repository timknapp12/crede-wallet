import PropTypes from 'prop-types'
import * as React from 'react'
import { Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'

import {
  Button,
  Column,
  CredeLogo,
  Gap,
  H3,
  HomeViewGraphicIcon,
  PrimaryText,
  ProfileCircleIcon,
  Row,
  SecondaryColorPrimaryText,
  SkeletonLoader,
} from 'components'

import { useAppContext } from 'contexts/AppContext'
import { useHomeContext } from 'contexts/HomeContext'

import { size } from 'styles/constants'

import i18n from 'translations/config'

import formatCurrency from 'utils/formatCurrency'

import NetworkSection from './NetworkSection'
import NetworkSelect from './NetworkSelect'

const { s4, s12, s32 } = size
const { t } = i18n

const hideCurrencyCode = true

const HomeView = ({ closeNetworkDrawer, closeMenus, currencyTotal, refreshing }) => {
  const { currentLanguage, theme, currentCurrency } = useAppContext()
  const { selectedNetwork, fadeInSideNav, addedNetworks, onToggleShowHideTokensDrawer } =
    useHomeContext()
  const [currentFont, setCurrentFont] = React.useState(64)

  const filteredNetworks =
    selectedNetwork.name === 'All Networks'
      ? addedNetworks?.filter(network => network.id !== 'all networks')
      : addedNetworks?.filter(network => selectedNetwork.name === network.name)

  const neworksWithSortedTokens = filteredNetworks?.map(network => {
    const sortedTokens = network?.tokens
      ?.map(token => token)
      ?.sort((a, b) => a.symbol.localeCompare(b.symbol))
    return {
      ...network,
      tokens: sortedTokens,
    }
  })

  if (!neworksWithSortedTokens) {
    return (
      <Column>
        <Gap height='24px' />
        <SkeletonLoader isLoading width='100%' height={70} />
        <SkeletonLoader isLoading width='100%' height={70} />
        <SkeletonLoader isLoading width='100%' height={200} />
        <SkeletonLoader isLoading width='100%' height={200} />
        <SkeletonLoader isLoading width='100%' height={70} />
      </Column>
    )
  }

  return (
    <Column $justify='flex-start'>
      <Row $gap={s12} $justify='space-between' style={{ zIndex: 2 }}>
        <View style={{ padding: 3 }}>
          <CredeLogo width={33} height={33} />
        </View>
        <NetworkSelect selectedNetwork={selectedNetwork} />
        <TouchableOpacity
          onPress={() => {
            fadeInSideNav()
            closeNetworkDrawer()
          }}
        >
          <ProfileCircleIcon />
        </TouchableOpacity>
      </Row>
      <Column>
        <Column $gap={s4}>
          <SkeletonLoader isLoading={refreshing} height={72} width='85%'>
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={{ fontSize: currentFont, fontWeight: 700, color: theme.textDefault }}
              // make font smaller if it outgrows the width of the screen
              onTextLayout={e => {
                const { lines } = e.nativeEvent
                if (lines.length > 1) {
                  setCurrentFont(currentFont - 1)
                }
              }}
            >
              {formatCurrency(
                currencyTotal || 0,
                currentCurrency,
                currentLanguage,
                hideCurrencyCode
              )}
            </Text>
          </SkeletonLoader>
          <SecondaryColorPrimaryText>{t('Balance')}</SecondaryColorPrimaryText>
        </Column>
        <TouchableWithoutFeedback onPress={closeMenus}>
          <Column $gap={s32}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <H3>{t('Tokens')}</H3>
              <Button style={{ width: 'auto' }} onPress={onToggleShowHideTokensDrawer}>
                {t('Edit')}
              </Button>
            </View>
            {neworksWithSortedTokens?.map(network => (
              <NetworkSection
                key={network?.chainId}
                closeMenus={closeMenus}
                network={network}
                isIncreased={true}
                percentage={'2.1'}
              />
            ))}
            <View style={{ rowGap: 16, alignItems: 'center' }}>
              <HomeViewGraphicIcon />
              <View style={{ width: '100%', paddingLeft: 40, paddingRight: 40 }}>
                <PrimaryText style={{ textAlign: 'center' }}>
                  {t('Buy tokens at an exchange or receive them from another wallet.')}
                </PrimaryText>
              </View>
            </View>
          </Column>
        </TouchableWithoutFeedback>
      </Column>
    </Column>
  )
}

HomeView.propTypes = {
  closeNetworkDrawer: PropTypes.func.isRequired,
  closeMenus: PropTypes.func.isRequired,
  isSelectOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  currencyTotal: PropTypes.number,
  refreshing: PropTypes.bool,
}

export default HomeView
