import { useFocusEffect } from '@react-navigation/native'
import * as Print from 'expo-print'
import * as Sharing from 'expo-sharing'
import * as React from 'react'
import { BackHandler, TouchableOpacity, View } from 'react-native'

import { useCreateRecoveryShares, useEmailWalletCreation } from 'api'

import {
  BackIcon,
  Button,
  Column,
  CredeLogo,
  DownloadIcon,
  H2,
  PrimaryText,
  ScreenContainer,
  Toast,
} from 'components'

import { useAppContext } from 'contexts/AppContext'
import { useCreateSharesContext } from 'contexts/CreateSharesContext'

import i18n from 'translations/config'

// TODO get importing html from template file to work
// import pdfHtmlTemplate from './recoveryPdfTemplate.html'

const { t } = i18n

const pdfHtmlTemplate = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
  </head>
  <body">
    <h1 style="font-size: 50px; font-family: Helvetica Neue; font-weight: bold;">
      Crede Recovery PDF
    </h1>
    <h4>This recovery guide is intended to help you restore your Crede Wallet on a new device. We strongly recommend storing this PDF on a device that is NOT connected to the internet (e.g. separate hard drive or USB drive). The hash below is NOT the private key to your wallet. It is a key that when paired with other authentication methods in our recovery process, restores your private key on your new device.</h4>
    <h4>Should you lose your device and need to regain access, follow the instructions below</h4>
    <ol>
      <li>Upon re-downloading the app, log in to your account with your credentials</li>
      <li>After successfully logging in to your account, it will recognize a new device and proceed with the wallet recovery option</li>
      <li>Select “Recovery PDF” and when prompted, copy and paste the recovery key below into the box provided. Ensure there are no accidental blank spaces at the end of the hash when pasting it</li>
      <li>After entering the correct recovery hash, the app will prompt you to set a new PIN to transact with. Upon finalizing a new PIN, your wallet has successfully been recovered</li>
    </ol>
    <h3 style="font-weight: bold;">Recovery Key</h3>
    <h3 style="overflow-wrap: break-word;">$shareString</h3>
  </body>
  <style>
    @page  {
      margin: 0;
      size: letter; /*or width then height 150mm 50mm*/
    }
  </style>
</html>
`

const RecoveryPdfDownloadScreen = () => {
  const { setDontBlurScreen, navigateAndLog, firebaseId, ethPublicKey } = useAppContext()
  const { tempStoredShares, setTempStoredShares } = useCreateSharesContext()
  const [isLoading, setIsLoading] = React.useState(false)
  const [isPdfDownloaded, setIsPdfDownloaded] = React.useState(false)
  const [isShowToast, setIsShowToast] = React.useState(false)
  const { mutateAsync: createRecoveryShares } = useCreateRecoveryShares(firebaseId)
  const { mutateAsync: sendEmailWalletCreation } = useEmailWalletCreation()

  // if user clicks back on android phone
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return false
      }

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress)

      return () => subscription.remove()
    }, [])
  )

  const handleGoBack = () => {
    navigateAndLog('ChooseRecoveryMethodScreen', 'nav_back_to_choose_recovery_method')
  }

  async function downloadRecoveryKit() {
    setIsLoading(true)
    setDontBlurScreen(false)
    try {
      await createRecoveryShares({
        externalId: firebaseId,
        nerdShare: JSON.stringify(tempStoredShares?.[2]),
        isPdfKit: true,
      })

      const html = pdfHtmlTemplate.replace(
        '$shareString',
        JSON.stringify(tempStoredShares?.[1])
      )

      // create pdf
      const { uri } = await Print.printToFileAsync({ html })
      // give option to share
      Sharing.shareAsync(uri)
      setIsPdfDownloaded(true)
      setIsShowToast(true)
      setTempStoredShares([])
      try {
        await sendEmailWalletCreation({ publicAddress: ethPublicKey })
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to send email:', error)
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
    } finally {
      setIsLoading(false)
      setDontBlurScreen(true)
    }
  }

  const onContinue = () => {
    navigateAndLog('RecoverySuccessScreen', 'recovery_pdf_success')
    setDontBlurScreen(false)
  }

  return (
    <ScreenContainer
      footerChildren={
        <Button primary onPress={onContinue} disabled={isLoading || !isPdfDownloaded}>
          {t('Continue')}
        </Button>
      }
      transparentFooterBackground
    >
      <Column $justify='space-between' $height='100%'>
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
        <Column $align='flex-start' $justify='flex-start' style={{ flex: 1, rowGap: 16 }}>
          <H2>{t('Save Recovery PDF')}</H2>
          <PrimaryText>
            {t('Save your Recovery PDF in a secure location other than this device.')}
          </PrimaryText>
          <Button
            primary
            onPress={downloadRecoveryKit}
            isLoading={isLoading}
            style={{ marginTop: 32 }}
            icon={<DownloadIcon />}
          >
            {t('Export Recovery PDF')}
          </Button>
          <Column $justify='flex-end' style={{ flex: 1 }}>
            <Toast
              showToast={isShowToast}
              onClose={() => setIsShowToast(false)}
              variant='success'
            >
              {t(`Recovery PDF exported. Follow the instructions within the document.`)}
            </Toast>
          </Column>
        </Column>
      </Column>
    </ScreenContainer>
  )
}

export default RecoveryPdfDownloadScreen
