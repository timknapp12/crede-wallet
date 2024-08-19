import Constants from 'expo-constants'
import { StyleSheet } from 'react-native'

import {
  Button,
  Column,
  CredeLogo,
  H5,
  PrimaryText,
  ScreenContainer,
  ScreenTitle,
} from 'components'

import { useAppContext } from 'contexts/AppContext'

// styles
import { size } from 'styles/constants'

// hooks
import i18n from 'translations/config'

const { s16 } = size
const { t } = i18n

const version = Constants.expoConfig.extra.version

const WelcomeScreen = () => {
  const { navigateAndLog } = useAppContext()

  const goToSignInToCredeScreen = () => {
    navigateAndLog('SignInToCredeScreen', 'nav_to_sign_in_screen')
  }

  const goToCreateAccountScreen = () => {
    navigateAndLog('CreateAccountScreen', 'nav_to_create_account_screen')
  }

  const normalText = t(
    'Crede is non-custodial wallet for digital assets. Setting up Crede takes '
  )
  const boldText = t(`less than 3 minutes.`)

  return (
    <ScreenContainer>
      <Column $justify='space-between' $height='100%'>
        <CredeLogo />
        <Column>
          <ScreenTitle>{t('Welcome to Crede!')}</ScreenTitle>
          <Column $width='80%' $gap='0px'>
            <PrimaryText style={styles.normalText}>{normalText}</PrimaryText>
            <PrimaryText style={styles.boldText}>{boldText}</PrimaryText>
          </Column>
        </Column>
        <Column $gap={s16}>
          <Button onPress={goToSignInToCredeScreen}>{t('Sign in')}</Button>
          <Button primary onPress={goToCreateAccountScreen}>
            {t('Set up Crede Wallet')}
          </Button>
          <H5>{`${t('Version')}: ${version}`}</H5>
        </Column>
      </Column>
    </ScreenContainer>
  )
}

export default WelcomeScreen

const styles = StyleSheet.create({
  normalText: {
    textAlign: 'center',
  },
  boldText: {
    textAlign: 'center',
    fontWeight: 700,
  },
})
