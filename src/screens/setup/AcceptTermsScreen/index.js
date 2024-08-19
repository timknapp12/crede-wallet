import * as React from 'react'
import { StyleSheet } from 'react-native'

import { useEmailAcceptTerms, useGetTerms, useSendTerms } from 'api'

import {
  Button,
  Column,
  CredeLogo,
  Gap,
  H2,
  H4,
  H5Error,
  P,
  ScreenContainer,
  SkeletonLoader,
} from 'components'

import { useAppContext } from 'contexts/AppContext'

import { size } from 'styles/constants'

import i18n from 'translations/config'

const { s4, s24 } = size

const { t } = i18n

const AcceptTermsScreen = () => {
  const { navigateAndLog, ethPublicKey } = useAppContext()

  const [termsCopy, setTermsCopy] = React.useState([])
  const [versionId, setVersionId] = React.useState(0)
  const [termsLoading, setTermsLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [termsAccepting, setTermsAccepting] = React.useState(false)

  const { mutateAsync: getTerms } = useGetTerms()
  const { mutateAsync: acceptTerms } = useSendTerms()
  const { mutateAsync: sendEmailAcceptTerms } = useEmailAcceptTerms()

  const getTermsCopy = async () => {
    try {
      const termsData = await getTerms()
      const copyArray = JSON.parse(termsData?.termsAndConditions)
      setTermsCopy(copyArray)
      setVersionId(termsData?.versionId)
    } catch (error) {
      setError(error.message)
    } finally {
      setTermsLoading(false)
    }
  }

  React.useEffect(() => {
    getTermsCopy()
  }, [])

  const goToAccountCreatedScreen = async () =>
    navigateAndLog('AccountCreatedScreen', 'terms_accepted')

  const goToHomeStack = () => navigateAndLog('HomeStack', 'on_launch_nav_to_home')

  const goToNextScreen = async () => {
    setTermsAccepting(true)
    try {
      await acceptTerms({ versionId })
      try {
        await sendEmailAcceptTerms({ versionId })
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to send email:', error)
      }
      ethPublicKey ? goToHomeStack() : goToAccountCreatedScreen()
    } catch (error) {
      setError(error.message)
    } finally {
      setTermsAccepting(false)
    }
  }

  return (
    <ScreenContainer>
      <CredeLogo />
      <Gap $height={s24} />
      <Column $align='flex-start'>
        <H2 style={styles.title}>{t('Terms and Services')}</H2>
      </Column>
      <Gap $height={s24} />
      <Column $align='flex-start'>
        {termsLoading
          ? [1, 2, 3, 4].map(item => (
              <SkeletonLoader isLoading width='100%' height={120} key={item} />
            ))
          : termsCopy.map(item => (
              <Column $gap={s4} $align='flex-start' key={item.id}>
                <H4>{item.title}</H4>
                <P>{item.p}</P>
              </Column>
            ))}
        {error && <H5Error>There was an error loading the terms and conditions.</H5Error>}
        <Button
          disabled={termsLoading}
          isLoading={termsAccepting}
          primary
          onPress={goToNextScreen}
        >
          {t('I agree')}
        </Button>
      </Column>
    </ScreenContainer>
  )
}

export default AcceptTermsScreen

const styles = StyleSheet.create({
  title: {
    textAlign: 'left',
  },
})
