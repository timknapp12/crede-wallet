import auth from '@react-native-firebase/auth'
import { useNavigation } from '@react-navigation/native'
import Constants from 'expo-constants'
import * as WebBrowser from 'expo-web-browser'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Directions, Gesture, GestureDetector } from 'react-native-gesture-handler'

import { useGetRecoveryShareInfo } from 'api'

import {
  // ProfileIcon,
  AppearanceIcon,
  Button,
  ChangeKeyIcon,
  ClosePanelIcon,
  Column,
  ExportIcon,
  H2,
  H5,
  H5Error,
  H6,
  PrimaryText,
  PrimaryTextSmall,
  PrivacyIcon,
  Row,
  ScrollView,
  TermsIcon,
} from 'components'

import { useAppContext } from 'contexts/AppContext'
import { useHomeContext } from 'contexts/HomeContext'

import { size } from 'styles/constants'

import i18n from 'translations/config'

import fbLogEvent from 'utils/firebase/logging'
import parseEmailAddress from 'utils/parseEmailAddress'

import { Container, InsideContainer, NavButton } from '../homeScreen.styles'
import ManageBiometricButton from './ManageBiometricButton'

const { t } = i18n
const { s8 } = size
const version = Constants.expoConfig.extra.version

const SideNav = ({ opacity, ...props }) => {
  const {
    navigateAndLog,
    setToken,
    setMnemonic,
    setIsRecoveringWallet,
    firebaseId,
    fbUser,
    logEvent,
  } = useAppContext()
  const { fadeOutSideNav } = useHomeContext()

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const recoveryOptionsQuery = useGetRecoveryShareInfo({ firebaseId })
  const recoveryOptionsArray = recoveryOptionsQuery?.data?.recoveryShares

  const navigate = screen => navigateAndLog(screen, `nav_to_${screen}`)

  const navigation = useNavigation()
  const navToExportSeed = () => navigation.push('EnterRecoveryShareScreen')

  const goToChooseRecoveryMethodScreen = async () => {
    await logEvent('set_up_recovery_later')
    navigation.push('CreateSharesStack', {
      screen: 'ReEnterPinScreen',
    })
  }

  const signOut = async () => {
    setIsLoading(true)
    await setToken('')
    await setMnemonic('')
    await setIsRecoveringWallet(false)
    try {
      auth()
        .signOut()
        .then(() => {
          navigateAndLog('WelcomeScreen', 'auth_sign_out_from_side_nav')
        })
    } catch (error) {
      setError(`${t('Error logging out')}: ${error?.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const flingGesture = Gesture.Fling()
    .runOnJS(true)
    .direction(Directions.RIGHT)
    .onStart(() => fadeOutSideNav())

  const privacyUrl = 'https://www.credewallet.com/privacy-policy'
  const openPrivacyPolicy = async () => await WebBrowser.openBrowserAsync(privacyUrl)

  return (
    <GestureDetector gesture={flingGesture}>
      <Container {...props}>
        <InsideContainer style={{ opacity }}>
          <ScrollView contentContainerStyle={styles.contentContainerStyle}>
            <Column $justify='center' $gap='0px'>
              <Row style={styles.titleRow} $justify='space-between'>
                <H2 style={styles.title}>{t('Account Settings')}</H2>
                <TouchableOpacity onPress={fadeOutSideNav}>
                  <ClosePanelIcon />
                </TouchableOpacity>
              </Row>
              {!!recoveryOptionsArray && recoveryOptionsArray?.length == 0 && (
                <Column
                  $align='flex-start'
                  $gap={s8}
                  style={{ marginTop: 32, marginBottom: 8 }}
                >
                  <H5>{t('Setting up recovery is recommended')}</H5>
                  <PrimaryTextSmall>
                    {t(
                      'Without recovery you can permanently lose your assets if you lose this device.'
                    )}
                  </PrimaryTextSmall>
                  <Button
                    secondary
                    textStyles={{ fontSize: 14 }}
                    style={{ padding: 8 }}
                    onPress={goToChooseRecoveryMethodScreen}
                  >
                    {t('Set Up Recovery')}
                  </Button>
                </Column>
              )}
              <Column
                $align='flex-start'
                $justify='space-between'
                $gap={'0px'}
                style={styles.column}
              >
                <PrimaryText style={styles.sectionHeader}>{t('General')}</PrimaryText>
                {/* <NavButton
              onPress={() => {
                navigate(`ProfileScreen`);
                fadeOutSideNav();
              }}
            >
              <ProfileIcon />
              <PrimaryText>{t('Profile')}</PrimaryText>
            </NavButton> */}
                <NavButton
                  onPress={() => {
                    navigate(`AppearanceScreen`)
                    fadeOutSideNav()
                  }}
                >
                  <AppearanceIcon />
                  <PrimaryText>{t('Appearance')}</PrimaryText>
                </NavButton>
                <PrimaryText style={styles.sectionHeader}>{t('Security')}</PrimaryText>
                <NavButton
                  onPress={() => {
                    navToExportSeed()
                    fadeOutSideNav()
                  }}
                >
                  <ExportIcon />
                  <PrimaryText>{t('Export Private Key')}</PrimaryText>
                </NavButton>
                <ManageBiometricButton fadeOutSideNav={fadeOutSideNav} />
                <NavButton
                  onPress={() => {
                    navigation.push('RecoveryStack', { screen: 'ResetPinOptionsScreen' })
                    fbLogEvent('nav_to_reset_pin_screen')
                    fadeOutSideNav()
                  }}
                >
                  <ChangeKeyIcon />
                  <PrimaryText>{t('Change Recovery Pin')}</PrimaryText>
                </NavButton>
                <PrimaryText style={styles.sectionHeader}>{t('Legal')}</PrimaryText>
                <NavButton
                  onPress={() => {
                    navigate(`TermsScreen`)
                    fadeOutSideNav()
                  }}
                >
                  <TermsIcon />
                  <PrimaryText>{t('Terms and Services')}</PrimaryText>
                </NavButton>
                <NavButton onPress={openPrivacyPolicy}>
                  <PrivacyIcon />
                  <PrimaryText>{t('Privacy Policy')}</PrimaryText>
                </NavButton>
              </Column>
            </Column>
            <Column $gap={s8}>
              {error ? <H5Error>{error}</H5Error> : null}
              <Button isLoading={isLoading} onPress={signOut}>
                {t('Log Out')}
              </Button>
              <H6>{parseEmailAddress(fbUser.email)}</H6>
              <H5>{`${t('Version')}: ${version}`}</H5>
            </Column>
          </ScrollView>
        </InsideContainer>
      </Container>
    </GestureDetector>
  )
}

SideNav.propTypes = {
  opacity: PropTypes.object.isRequired,
}

export default SideNav

const styles = StyleSheet.create({
  contentContainerStyle: { justifyContent: 'space-between', flexGrow: 1 },
  titleRow: { flexWrap: 'wrap' },
  title: { flex: 2 },
  sectionHeader: {
    fontWeight: 600,
    marginBottom: 16,
    marginTop: 24,
  },
})
