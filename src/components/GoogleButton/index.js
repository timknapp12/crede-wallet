import PropTypes from 'prop-types'
import { View } from 'react-native'

import googleLogo from 'assets/icons/google_logo.png'

import { LoadingSpinner } from 'components/svgs'

import { useAppContext } from 'contexts/AppContext'

import i18n from 'translations/config'

import {
  Filler,
  GoogleImage,
  ImageContainer,
  StyledGoogleButton,
  StyledGoogleText,
  TextContainer,
} from './googleButton.styles'

const { t } = i18n

export const GoogleButton = ({ ...props }) => {
  const { theme } = useAppContext()
  return (
    <StyledGoogleButton {...props}>
      <ImageContainer>
        <GoogleImage source={googleLogo} />
      </ImageContainer>
      {props?.isLoading ? (
        <>
          <LoadingSpinner style={{ height: 18, flex: 1 }} color={theme.textDefault} />
          <View style={{ width: 46 }} />
        </>
      ) : (
        <TextContainer>
          <View />
          <StyledGoogleText>{t('Continue with Google')}</StyledGoogleText>
          <Filler />
        </TextContainer>
      )}
    </StyledGoogleButton>
  )
}

GoogleButton.propTypes = {
  isLoading: PropTypes.bool,
}
