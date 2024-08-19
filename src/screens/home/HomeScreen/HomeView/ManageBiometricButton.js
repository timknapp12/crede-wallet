import { useNavigation } from '@react-navigation/native'
import * as LocalAuthentication from 'expo-local-authentication'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { Platform } from 'react-native'
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons'
import styled from 'styled-components/native'

import { PrimaryText } from 'components'

import i18n from 'translations/config'

import useBiometric from 'utils/biometrics/useBiometric'

import { getBiometricTypeMap } from '../../../createShares/BiometricScreen/biometricTypeMap'
import { NavButton } from '../homeScreen.styles'

const { t } = i18n

const StyledIcon = styled(Ionicons)`
  color: ${props => props.theme.textDefault};
  margin-right: 4px;
`

const ManageBiometricButton = ({ fadeOutSideNav }) => {
  const { biometricTypeList } = useBiometric(() => {})
  const bioType = getBiometricTypeMap(Platform, biometricTypeList)

  const [showBioButton, setShowBioButton] = useState(false)

  const checkBiometrics = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync()
    const enroll = await LocalAuthentication.isEnrolledAsync()
    const show = compatible && enroll
    setShowBioButton(show)
  }

  useEffect(() => {
    checkBiometrics()
  }, [])

  const navigation = useNavigation()

  const goToManageBiometricScreen = () => {
    fadeOutSideNav()
    navigation.navigate('ManageBiometricScreen', {
      title: bioType?.method,
      url: bioType?.url,
      materialIconName: bioType?.materialIconName,
      method: bioType?.method,
      learn: bioType?.learn,
    })
  }

  if (!showBioButton) {
    return null
  }

  return (
    <NavButton onPress={goToManageBiometricScreen}>
      <StyledIcon name={bioType?.materialIconName} size={20} />
      <PrimaryText>{t(bioType?.sideNavButtonTitle)}</PrimaryText>
    </NavButton>
  )
}

export default ManageBiometricButton

ManageBiometricButton.propTypes = {
  fadeOutSideNav: PropTypes.func.isRequired,
}
