import * as Clipboard from 'expo-clipboard'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import {
  Keyboard,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

import {
  BackIcon,
  Button,
  Column,
  CredeLogo,
  Gap,
  H2,
  H5Error,
  Input,
  KeyboardViewContainer,
  PasteIcon,
  PrimaryTextSmall,
  Row,
} from 'components'

import { useAppContext } from 'contexts/AppContext'
import { useCreateSharesContext } from 'contexts/CreateSharesContext'

import i18n from 'translations/config'

import { isValidMnemonic } from 'utils/api/wallet/cryptography'

const { t } = i18n

const ImportSeedPhraseScreen = ({ navigation }) => {
  const { logEvent, theme, navigateAndLog } = useAppContext()
  const { importedMnemonic, setImportedMnemonic } = useCreateSharesContext()

  const [isDisabled, setIsDisabled] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const seedArray = importedMnemonic?.trim()?.split(' ')
    const isTwelve = seedArray?.length === 12
    setIsDisabled(!isTwelve)
  }, [importedMnemonic])

  const handleGoBack = () => {
    setImportedMnemonic('')
    navigation.goBack()
  }

  const fetchCopiedText = async () => {
    const text = await Clipboard.getStringAsync()
    logEvent('paste_seed_phrase_from_clipboard')
    setImportedMnemonic(text)
  }

  const goToNextScreen = () => {
    navigateAndLog('ImportWalletSuccessScreen', 'imported_12_word_seed_phrase')
  }

  const onSubmit = async () => {
    await setIsLoading(true)
    try {
      const isValid = await isValidMnemonic(importedMnemonic)
      if (isValid) {
        return goToNextScreen()
      } else {
        return setError(t('This seed phrase is invalid'))
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardViewContainer>
        <Column style={{ flex: 1 }}>
          <Column $padding='24px' style={styles.inner}>
            <Column $justify='space-between' $height='100%'>
              <Column>
                <Row $justify='space-between'>
                  <TouchableOpacity onPress={handleGoBack}>
                    <BackIcon />
                  </TouchableOpacity>
                  <CredeLogo />
                  <BackIcon color='transparent' />
                </Row>
                <Column $align='flex-start' $gap='0px'>
                  <H2>{t('Enter 12 Word Seed Phrase')}</H2>
                  <Gap $height='24px' />
                  <Input
                    value={importedMnemonic}
                    onChangeText={text => {
                      setImportedMnemonic(text)
                      setError('')
                    }}
                    autoFocus
                    multiline
                    numberOfLines={Platform.OS === 'ios' ? null : 2}
                    minHeight={Platform.OS === 'ios' ? 40 : null}
                    textAlignVertical='top'
                    height='80px'
                    align='flex-start'
                  />
                  <PrimaryTextSmall>
                    {t('Separate each word with a space')}
                  </PrimaryTextSmall>
                </Column>
                <View style={styles.pasteButton}>
                  <Button icon={<PasteIcon />} onPress={fetchCopiedText}>
                    {t('Paste From Clipboard')}
                  </Button>
                </View>
                {error ? <H5Error>{error}</H5Error> : null}
              </Column>
            </Column>
          </Column>
          <View
            style={{
              ...styles.buttonContainer,
              backgroundColor: theme.backgroundDefault,
            }}
          >
            <Button
              disabled={isDisabled}
              isLoading={isLoading}
              primary
              onPress={() => {
                setIsLoading(true)
                onSubmit()
              }}
            >
              {t('Submit')}
            </Button>
          </View>
        </Column>
      </KeyboardViewContainer>
    </TouchableWithoutFeedback>
  )
}

ImportSeedPhraseScreen.propTypes = {
  navigation: PropTypes.object,
}

const styles = StyleSheet.create({
  inner: {
    paddingTop: 48,
    flex: 1,
  },
  pasteButton: {
    width: '100%',
  },
  buttonContainer: {
    padding: 24,
    paddingTop: 16,
    width: '100%',
  },
})

export default ImportSeedPhraseScreen
