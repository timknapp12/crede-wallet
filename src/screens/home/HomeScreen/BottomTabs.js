import PropTypes from 'prop-types'

import { Button, Column, QRCodeIcon, Row, SendIcon } from 'components'

// hooks
import { useAppContext } from 'contexts/AppContext'

import { size } from 'styles/constants'

import i18n from 'translations/config'

import { TabContainer } from './homeScreen.styles'

const { s24 } = size
const { t } = i18n

const BottomTabs = ({ closeMenus = () => {}, ...props }) => {
  const { navigateAndLog, networks } = useAppContext()

  const onReceive = () => {
    navigateAndLog('ReceiveTokenSelectNetworkScreen', 'btn_receive_tokens')
  }
  const disabled = !networks

  return (
    <TabContainer {...props}>
      <Column $gap='0px'>
        <Row $justify='space-between'>
          <Button
            onPress={() => {
              onReceive()
              closeMenus()
            }}
            style={{ width: '45%' }}
            icon={<QRCodeIcon height={s24} />}
            disabled={disabled}
          >
            {t('Receive')}
          </Button>
          <Button
            onPress={() => {
              closeMenus()
              navigateAndLog('SelectAssetScreen', 'nav_to_select_asset_screen')
            }}
            style={{ width: '45%' }}
            primary
            icon={<SendIcon />}
            disabled={disabled}
          >
            {t('Send')}
          </Button>
        </Row>
      </Column>
    </TabContainer>
  )
}

BottomTabs.propTypes = {
  closeMenus: PropTypes.func,
  hideBottomRow: PropTypes.bool,
}

export default BottomTabs
