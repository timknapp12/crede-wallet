import auth from '@react-native-firebase/auth'
import { passwordStrength } from 'check-password-strength'
import { useRef, useState } from 'react'
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import zxcvbn from 'zxcvbn'

import {
  BackIcon,
  Button,
  CheckmarkIcon,
  Column,
  CredeLogo,
  H5Error,
  Input,
  KeyboardViewContainer,
  PrimaryTextSmall,
  Row,
  ScreenTitle,
  ScrollView,
  SecondaryTextSmall,
  Toast,
} from 'components'

import { useAppContext } from 'contexts/AppContext'

import { size } from 'styles/constants'

import i18n from 'translations/config'

import getTranslatedWarning from './passwordWarnings'

const { s8, s32 } = size
const { t } = i18n

const SignUpScreen = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    logEvent,
    navigateAndLog,
    currentLanguage,
    theme,
  } = useAppContext()
  const [authError, setAuthError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const goToNextScreen = () => {
    setPassword('')
    navigateAndLog('ConfirmationEmailSentScreen', 'nav_to_confirmation_screen')
  }
  const onSuccessfulSignUp = () => {
    logEvent('auth_sign_up_with_email_success')
    return setPassword('')
  }

  const passwordRef = useRef(null)

  const onNext = () => {
    passwordRef.current.focus()
  }

  // password validation
  const [isLength10, setIsLength10] = useState(false)
  const [hasLowercase, setHasLowercase] = useState(false)
  const [hasUppercase, setHasUppercase] = useState(false)
  const [hasNum, setHasNum] = useState(false)
  const [hasSymbol, setHasSymbol] = useState(false)
  const [passwordStrengthLabel, setPasswordStrengthLabel] = useState('Too weak')
  const [passwordWarning, setPasswordWarning] = useState('')
  const lowercase = /.*[a-z].*/
  const uppercase = /.*[A-Z].*/
  const num = /.*\d.*/
  const symb = /.*[^a-zA-Z0-9].*/

  const checkPassword = value => {
    setIsLength10(value.length > 9)
    setHasLowercase(lowercase.test(value))
    setHasUppercase(uppercase.test(value))
    setHasNum(num.test(value))
    setHasSymbol(symb.test(value))
    setPasswordStrengthLabel(passwordStrength(value).value)
  }

  const getPasswordWarning = password => {
    const weakPassword = zxcvbn(password)
    const warning = weakPassword?.feedback?.warning
    const tWarning = getTranslatedWarning(warning)
    setPasswordWarning(tWarning)
  }

  const verifyEmail = async () => {
    setIsLoading(true)
    try {
      auth().languageCode = currentLanguage
      await auth().currentUser.sendEmailVerification()
      logEvent('auth_send_verification_success')
      setIsLoading(false)
      goToNextScreen()
    } catch (error) {
      setIsLoading(false)
      setAuthError(error.message)
      logEvent('auth_send_verification_failure')
    }
  }

  const signIn = () => {
    setIsLoading(true)
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        const user = userCredential.user
        if (user?.emailVerified) {
          setIsLoading(false)
          return onSuccessfulSignUp()
        } else {
          return verifyEmail()
        }
      })
      .catch(error => {
        if (error.code === 'auth/invalid-email') {
          setIsLoading(false)
          logEvent('auth_sign_up_with_email_failure')
          return setAuthError(t('That email address is invalid!'))
        }
        setIsLoading(false)
        setAuthError(error.message)
      })
  }

  // SIGN UP
  const signUp = () => {
    if (isButtonDisabled) return
    setIsLoading(true)
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        const user = userCredential.user
        if (user?.emailVerified) {
          setIsLoading(false)
          return onSuccessfulSignUp()
        } else {
          setIsLoading(false)
          return verifyEmail()
        }
      })
      .catch(error => {
        if (error?.code === 'auth/email-already-in-use') {
          return signIn()
        }
        if (error?.code === 'auth/invalid-email') {
          setIsLoading(false)
          return setAuthError(t('That email address is invalid!'))
        }
        setIsLoading(false)
        logEvent('auth_sign_up_with_email_failure')
        setAuthError(error.message)
      })
  }

  const handleGoBack = () => {
    navigateAndLog('CreateAccountScreen', 'nav_to_create_account_screen')
  }

  const isButtonDisabled =
    !email ||
    !password ||
    !isLength10 ||
    !hasLowercase ||
    !hasUppercase ||
    !hasNum ||
    !hasSymbol ||
    passwordWarning?.length > 0

  const passwordStrengthString = `${t('Password strength')}: ${t(passwordStrengthLabel)}`

  const toastMessage = passwordWarning ? passwordWarning : passwordStrengthString

  return (
    <KeyboardViewContainer
      style={{ width: '100%', paddingTop: Platform.OS === 'ios' ? 48 : 72 }}
    >
      <Column $gap={s32} $justify='space-between' style={styles.container}>
        <ScrollView>
          <Column $justify='flex-start' style={styles.innerContainer}>
            <View
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <TouchableOpacity onPress={handleGoBack}>
                <BackIcon />
              </TouchableOpacity>
              <CredeLogo />
              {/* add invisible icon same width as back icon to make logo sit in center */}
              <BackIcon color='transparent' />
            </View>
            <Column $align='flex-start'>
              <ScreenTitle>{t('Sign up with email and password')}</ScreenTitle>
            </Column>
            <Column $gap='0px' $align='flex-start'>
              <Input
                label={t('Email')}
                value={email}
                onChangeText={text => {
                  setEmail(text)
                  setAuthError('')
                  checkPassword(password)
                }}
                autoCapitalize='none'
                keyboardType='email-address'
                autoComplete='email'
                autoFocus
                returnKeyType='next'
                onSubmitEditing={onNext}
              />
              <SecondaryTextSmall style={styles.emailHint}>
                {t(`We'll email you a confirmation`)}
              </SecondaryTextSmall>
            </Column>
            <Column $gap={s8}>
              <Input
                label={t('Password')}
                value={password}
                onChangeText={text => {
                  setPassword(text)
                  setAuthError('')
                  checkPassword(text)
                  getPasswordWarning(text)
                }}
                ref={passwordRef}
                textContentType='password'
                autoComplete='new-password'
                returnKeyType='go'
                onSubmitEditing={signUp}
              />
              <Toast showToast variant={isButtonDisabled ? 'error' : 'success'}>
                {toastMessage}
              </Toast>
              {authError ? <H5Error style={styles.error}>{authError}</H5Error> : null}
              <Row $justify='flex-start'>
                <CheckmarkIcon style={{ opacity: isLength10 ? 1 : 0 }} />
                <PrimaryTextSmall>
                  {t('Must contain at least 10 characters')}
                </PrimaryTextSmall>
              </Row>
              <Row $justify='flex-start'>
                <CheckmarkIcon
                  style={{
                    opacity: password.length === 0 || !hasLowercase ? 0 : 1,
                  }}
                />
                <PrimaryTextSmall>
                  {t(`Must include at least one lowercase letter`)}
                </PrimaryTextSmall>
              </Row>
              <Row $justify='flex-start'>
                <CheckmarkIcon
                  style={{
                    opacity: password.length === 0 || !hasUppercase ? 0 : 1,
                  }}
                />
                <PrimaryTextSmall>
                  {t(`Must include at least one uppercase letter`)}
                </PrimaryTextSmall>
              </Row>
              <Row $justify='flex-start'>
                <CheckmarkIcon style={{ opacity: hasNum ? 1 : 0 }} />
                <PrimaryTextSmall>{t('Must have at least one number')}</PrimaryTextSmall>
              </Row>
              <Row $justify='flex-start'>
                <CheckmarkIcon style={{ opacity: hasSymbol ? 1 : 0 }} />
                <PrimaryTextSmall>{t('Must have at least one symbol')}</PrimaryTextSmall>
              </Row>
            </Column>
          </Column>
        </ScrollView>
        <Column
          style={{
            paddingLeft: 24,
            paddingRight: 24,
            paddingTop: 16,
            backgroundColor: theme.backgroundDefault,
            paddingBottom: 24,
          }}
        >
          <Button
            primary
            onPress={signUp}
            disabled={isButtonDisabled}
            isLoading={isLoading}
          >
            {t('Continue')}
          </Button>
        </Column>
      </Column>
    </KeyboardViewContainer>
  )
}

export default SignUpScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    paddingLeft: 24,
    paddingRight: 24,
  },
  emailHint: {
    marginStart: 12,
  },
  error: {
    textAlign: 'center',
  },
})
