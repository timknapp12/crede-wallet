import { AppleButton as AppleTouchable } from '@invertase/react-native-apple-authentication'
import PropTypes from 'prop-types'

import { LoadingSpinner } from 'components/svgs'

import { LoadingAppleButton } from './appleButton.styles'

export const AppleButton = ({ onPress, isLoading, ...props }) => {
  if (isLoading) {
    return (
      <LoadingAppleButton>
        <LoadingSpinner style={{ height: 18, flex: 1 }} color='#000000' />
      </LoadingAppleButton>
    )
  }
  return (
    <AppleTouchable
      {...props}
      buttonStyle={AppleTouchable.Style.WHITE}
      buttonType={AppleTouchable.Type.CONTINUE}
      style={{
        width: '100%',
        height: 46,
      }}
      onPress={onPress}
    />
  )
}

AppleButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
}
