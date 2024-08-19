import * as WebBrowser from 'expo-web-browser'
import PropTypes from 'prop-types'
import * as React from 'react'
import { TouchableOpacity, View } from 'react-native'
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons'
import styled from 'styled-components/native'

import {
  Column,
  H2,
  H3,
  H5Error,
  Link,
  PrimaryText,
  Row,
  ScreenContainer,
  Switch,
} from 'components'

import { useAppContext } from 'contexts/AppContext'

import i18n from 'translations/config'

import useBiometric from 'utils/biometrics/useBiometric'

const { t } = i18n

const StyledIcon = styled(Ionicons)`
  color: ${props => props.theme.textDefault};
  margin-right: 4px;
`

const ManageBiometricScreen = ({ route }) => {
  const {
    areBiometricsEnabled,
    storeAreBiometricsEnabled,
    storeDisableBiometrics,
    firebaseId,
  } = useAppContext()

  const [currentFont, setCurrentFont] = React.useState(64)
  const { authWithBioErrMessage, authenticateWithBiometric } = useBiometric(
    () => storeAreBiometricsEnabled(firebaseId),
    t('Enable biometrics')
  )

  const enable = async () => {
    await authenticateWithBiometric()
  }

  const disable = async () => {
    await storeDisableBiometrics(firebaseId)
  }

  const onSwitch = areBiometricsEnabled ? disable : enable

  const openInWeb = async () => await WebBrowser.openBrowserAsync(route?.params?.url)

  return (
    <ScreenContainer>
      <Column $justify='space-between' $height='100%'>
        <Column $gap='16px'>
          <H2
            adjustsFontSizeToFit
            numberOfLines={1}
            style={{ fontSize: currentFont }}
            // make font smaller if it outgrows the width of the screen
            onTextLayout={e => {
              const { lines } = e.nativeEvent
              if (lines.length > 1) {
                setCurrentFont(currentFont - 1)
              }
            }}
          >
            {t('Enable Biometric Authorization')}
          </H2>
          <PrimaryText>
            {t(
              'Activating biometric authentication enhances the security of your wallet access.'
            )}
          </PrimaryText>
        </Column>
        {authWithBioErrMessage?.length > 0 ? (
          <H5Error>{authWithBioErrMessage}</H5Error>
        ) : null}
        <Column $align='flex-start'>
          <Row $justify='space-between'>
            <Row $width='auto'>
              <StyledIcon name={route?.params?.materialIconName} size={48} />
              <H3>{route?.params?.method}</H3>
            </Row>
            <Switch value={areBiometricsEnabled} onValueChange={onSwitch} />
          </Row>
          <TouchableOpacity onPress={openInWeb}>
            <Link style={{ fontSize: 16 }}>{route?.params?.learn}</Link>
          </TouchableOpacity>
        </Column>
        <View />
        <View />
      </Column>
    </ScreenContainer>
  )
}

export default ManageBiometricScreen

ManageBiometricScreen.propTypes = {
  route: PropTypes.object.isRequired,
}
