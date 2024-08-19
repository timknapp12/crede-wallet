import * as Clipboard from 'expo-clipboard'
import { useState } from 'react'

import {
  Button,
  ChevronDownIcon,
  ChevronUpIcon,
  Column,
  CopyIcon,
  DisabledText,
  Gap,
  H4,
  PrimaryText,
  Row,
  ScreenContainer,
  Toast,
} from 'components'

import { useAppContext } from 'contexts/AppContext'

import { size } from 'styles/constants'

import i18n from 'translations/config'

import { AdvancedButton, MnemonicContainer, MnemonicInput } from './displayScreen.styles'

const { s4, s12, s24, s40 } = size
const { t } = i18n

const DisplayKeyScreen = () => {
  const { navigateAndLog, mnemonic, ethPrivateKey, logEvent } = useAppContext()

  const [showPhraseToast, setShowPhraseToast] = useState(false)
  const [phraseToastMessage, setPhraseToastMessage] = useState('')

  const [showKeyToast, setShowKeyToast] = useState(false)
  const [keyToastMessage, setKeyToastMessage] = useState('')

  const [showAdvanced, setShowAdvanced] = useState(false)

  const onCopyPhrase = async () => {
    await Clipboard.setStringAsync(mnemonic)
    setPhraseToastMessage(t(`Copied seed phrase to clipboard`))
    setShowPhraseToast(true)
    logEvent('seed_phrase_copied_to_clipboard')
  }

  const onCopyPrivateKey = async () => {
    await Clipboard.setStringAsync(ethPrivateKey)
    setKeyToastMessage(t(`Copied private key to clipboard`))
    setShowKeyToast(true)
    logEvent('eth_priv_key_copied_to_clipboard')
  }

  const goToHomeScreen = () =>
    navigateAndLog('HomeScreen', 'nav_to_home_from_export_key_screen')

  const splitPhrase = mnemonic.split(' ')

  return (
    <ScreenContainer paddingTop='0px'>
      <Gap $height={s24} />
      <Column $height='100%' $justify='space-between'>
        <Column $gap='0px' $align='flex-start'>
          <H4>{t('Seed Phrase')}</H4>
          <Gap $height={s4} />
          <PrimaryText>
            {t(
              'We recommend physically writing these values down and storing them in a safe location. '
            )}
          </PrimaryText>
          <H4>{t('Do not take a screenshot!')}</H4>
          <Gap $height={s12} />
          <Column $gap={s12}>
            <Row $justify='space-between'>
              <MnemonicInput value={splitPhrase[0]} />
              <MnemonicInput value={splitPhrase[1]} />
              <MnemonicInput value={splitPhrase[2]} />
            </Row>
            <Row $justify='space-between'>
              <MnemonicInput value={splitPhrase[3]} />
              <MnemonicInput value={splitPhrase[4]} />
              <MnemonicInput value={splitPhrase[5]} />
            </Row>
            <Row $justify='space-between'>
              <MnemonicInput value={splitPhrase[6]} />
              <MnemonicInput value={splitPhrase[7]} />
              <MnemonicInput value={splitPhrase[8]} />
            </Row>
            <Row $justify='space-between'>
              <MnemonicInput value={splitPhrase[9]} />
              <MnemonicInput value={splitPhrase[10]} />
              <MnemonicInput value={splitPhrase[11]} />
            </Row>
          </Column>
          <Gap $height={s24} />
          <Button onPress={onCopyPhrase} icon={<CopyIcon />}>
            {t('Copy')}
          </Button>
          {showPhraseToast && <Gap $height={s40} />}
          <Toast
            showToast={showPhraseToast}
            onClose={() => {
              setShowPhraseToast(false)
              setPhraseToastMessage('')
            }}
            variant='success'
          >
            {phraseToastMessage}
          </Toast>
          <Gap $height={s40} />

          <Column $gap='0px' $align='flex-start'>
            <AdvancedButton onPress={() => setShowAdvanced(prev => !prev)}>
              <H4>{t('Advanced')}</H4>
              {showAdvanced ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </AdvancedButton>
            {showAdvanced && (
              <>
                <Gap $height={s4} />
                <H4>{t('Private Key')}</H4>
                <Gap $height={s4} />
                <MnemonicContainer>
                  <DisabledText>{ethPrivateKey}</DisabledText>
                </MnemonicContainer>
                <Gap $height={s24} />
                <Button onPress={onCopyPrivateKey} icon={<CopyIcon />}>
                  {t('Copy')}
                </Button>
              </>
            )}
          </Column>
          {showKeyToast && <Gap $height={s40} />}
          <Toast
            showToast={showKeyToast}
            onClose={() => {
              setShowKeyToast(false)
              setKeyToastMessage('')
            }}
            variant='success'
          >
            {keyToastMessage}
          </Toast>
        </Column>
        <Column>
          <Button onPress={goToHomeScreen} primary>
            {t('Done')}
          </Button>
          <Gap $height={s4} />
        </Column>
      </Column>
    </ScreenContainer>
  )
}

export default DisplayKeyScreen
