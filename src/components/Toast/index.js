import PropTypes from 'prop-types'
import { StyleSheet, TouchableOpacity } from 'react-native'

import { useAppContext } from 'contexts/AppContext'

import { Row } from '../containers'
import { CloseIcon, SmallErrorIcon, SmallWarningIcon, SuccessSmallIcon } from '../svgs'
import { StyledToast, ToastText } from './toast.styles'

// variant types: 'error', 'caution', 'success'

export const Toast = ({
  onClose,
  children,
  showToast,
  variant = 'success',
  ...props
}) => {
  const { theme } = useAppContext()
  const icon =
    variant === 'success' ? (
      <SuccessSmallIcon />
    ) : variant === 'error' ? (
      <SmallErrorIcon color={theme.errorMain} />
    ) : variant === 'caution' ? (
      <SmallWarningIcon color={theme.warningDefault} />
    ) : null

  return showToast ? (
    <StyledToast $variant={variant} {...props}>
      <Row style={styles.toastContainer}>
        {icon && icon}
        <ToastText>{children}</ToastText>
      </Row>
      <>
        {onClose ? (
          <TouchableOpacity onPress={onClose}>
            <CloseIcon color='#414346' />
          </TouchableOpacity>
        ) : null}
      </>
    </StyledToast>
  ) : (
    <></>
  )
}

Toast.propTypes = {
  onClose: PropTypes.func,
  children: PropTypes.node.isRequired,
  showToast: PropTypes.bool.isRequired,
  variant: PropTypes.string,
}

const styles = StyleSheet.create({
  toastContainer: {
    flex: 0.9,
    justifyContent: 'flex-start',
  },
})
