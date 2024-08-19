import Fuse from 'fuse.js'
import PropTypes from 'prop-types'
import * as React from 'react'

import { Column, Gap, H3, Input, ScreenContainer, SearchIcon } from 'components'

import { useAppContext } from 'contexts/AppContext'
import { useHomeContext } from 'contexts/HomeContext'
import { useSendContext } from 'contexts/SendContext'

import { size } from 'styles/constants'

import i18n from 'translations/config'

import TokenSection from './TokenSection'

const { t } = i18n
const { s24 } = size
const SelectAssetScreen = () => {
  const { theme, navigateAndLog } = useAppContext()
  const [searchTerm, setSearchTerm] = React.useState('')
  const { addedNetworks } = useHomeContext()
  const { setSelectedAsset, setSelectedNetwork } = useSendContext()

  const fuseOptions = {
    threshold: 0.1,
    keys: ['name', 'tokens.name'],
  }
  const fuse = new Fuse(addedNetworks, fuseOptions)
  const searchedNetworksList = fuse.search(searchTerm)
  const searchedNetworkList = searchTerm
    ? searchedNetworksList?.map(item => item?.item)
    : addedNetworks

  const onSelectToken = (network, token) => {
    setSelectedNetwork(network)
    setSelectedAsset(token)
    navigateAndLog('EnterWalletScreen', `send_to_${token?.name}_token`)
  }

  return (
    <ScreenContainer paddingTop='8px' paddingBottom='0px'>
      <Input
        placeholder={t('Search your tokens...')}
        placeholderTextColor={theme.textDisabled}
        icon={<SearchIcon />}
        value={searchTerm}
        onChangeText={text => setSearchTerm(text)}
        style={{ backgroundColor: theme.neutralSurface }}
      />
      <Gap $height={s24} />
      <Column>
        {searchedNetworkList?.map(network => (
          <NetworkRow
            network={network}
            key={network.id}
            onPress={onSelectToken}
            fuseOptions={fuseOptions}
            searchTerm={searchTerm}
          />
        ))}
      </Column>
      <Gap $height={s24} />
    </ScreenContainer>
  )
}

export default SelectAssetScreen

const NetworkRow = ({ network, onPress, searchTerm, fuseOptions }) => {
  const { name, tokens } = network

  const fuse = new Fuse(tokens, fuseOptions)
  const searchedTokensResults = fuse.search(searchTerm)
  const searchedTokensList = searchTerm
    ? searchedTokensResults?.map(item => item?.item)
    : tokens

  const sortedTokens = searchedTokensList
    ?.map(token => token)
    ?.sort((a, b) => a.symbol.localeCompare(b.symbol))

  return (
    <Column $align='flex-start'>
      <H3>{name}</H3>
      {sortedTokens?.length > 0 &&
        sortedTokens?.map(token => (
          <TokenSection
            key={token.name}
            network={network}
            token={token}
            onPress={onPress}
          />
        ))}
    </Column>
  )
}

NetworkRow.propTypes = {
  network: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
  fuseOptions: PropTypes.object.isRequired,
  searchTerm: PropTypes.string.isRequired,
}
