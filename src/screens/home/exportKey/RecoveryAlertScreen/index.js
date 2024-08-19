import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { StyleSheet } from 'react-native'

import { useEmailExportKey } from 'api'

import { Column, DangerButton, H4, PrimaryText, ScreenContainer } from 'components'

import i18n from 'translations/config'

import alertStrings from './ExportAlertCopy'

const { t } = i18n

const RecoveryAlertScreen = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { mutateAsync: sendEmailExportKey } = useEmailExportKey()

  const navigation = useNavigation()
  const onCancel = () => navigation.push('HomeScreen')

  const onContinue = async () => {
    setIsLoading(true)
    try {
      await sendEmailExportKey()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('error', error)
    } finally {
      navigation.push('DisplayKeyScreen')
      setIsLoading(false)
    }
  }

  return (
    <ScreenContainer paddingTop='0px'>
      <Column $height='100%' $justify='space-between'>
        <Column style={styles.textBody}>
          {alertStrings.map(item => (
            <Column $align='flex-start' $gap={'0px'} key={item.id}>
              <H4>{t(item.title)}</H4>
              <PrimaryText>{t(item.body)}</PrimaryText>
            </Column>
          ))}
        </Column>
        <Column>
          <DangerButton onPress={onCancel}>{t('Cancel')}</DangerButton>
          <DangerButton isLoading={isLoading} primary onPress={onContinue}>
            {t('Export Private Key')}
          </DangerButton>
        </Column>
      </Column>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  textBody: {
    marginTop: 12,
  },
})

export default RecoveryAlertScreen
