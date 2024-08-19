import PropTypes from 'prop-types'

import { useAppContext } from 'contexts/AppContext'

import { Row } from '../containers'
import { LoadingSpinner } from '../svgs'
import { DangerButtonText } from '../texts'
import { StyledTouchableOpacity } from './dangerButton.styles'

export const DangerButton = ({
  children,
  primary,
  size,
  onPress,
  icon,
  disabled,
  isLoading,
  ...props
}) => {
  const { theme } = useAppContext()

  return (
    <StyledTouchableOpacity
      onPress={disabled || isLoading ? () => {} : onPress}
      $primary={primary}
      $disabled={disabled}
      {...props}
    >
      <Row $width='auto'>
        {isLoading ? (
          <LoadingSpinner
            style={{ height: size === 'small' ? 14 : size === 'large' ? 20 : 18 }}
            color={theme.backgroundDefault}
          />
        ) : (
          <>
            {icon ? icon : null}
            <DangerButtonText $primary={primary} size={size} disabled={disabled}>
              {children}
            </DangerButtonText>
          </>
        )}
      </Row>
    </StyledTouchableOpacity>
  )
}

DangerButton.propTypes = {
  children: PropTypes.node.isRequired,
  onPress: PropTypes.func,
  primary: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  icon: PropTypes.node,
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
}

DangerButton.defaultProps = {
  primary: false,
  borderless: false,
  size: 'medium',
  onClick: () => {},
  disabled: false,
}
