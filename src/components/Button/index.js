import PropTypes from 'prop-types'

import { LoadingSpinner } from 'components/svgs'

import { useAppContext } from 'contexts/AppContext'

import { Row } from '../containers'
import { BorderlessButtonText, PrimaryButtonText, SecondaryButtonText } from '../texts'
import { StyledTouchableOpacity } from './button.styles'

const SizedText = ({
  size,
  primary,
  secondary,
  danger,
  borderless,
  children,
  disabled,
  textStyles,
}) => (
  <>
    {primary || danger || secondary ? (
      <PrimaryButtonText $size={size} $disabled={disabled} style={textStyles}>
        {children}
      </PrimaryButtonText>
    ) : borderless ? (
      <BorderlessButtonText $size={size}>{children}</BorderlessButtonText>
    ) : (
      <SecondaryButtonText $size={size} $disabled={disabled}>
        {children}
      </SecondaryButtonText>
    )}
  </>
)

SizedText.propTypes = {
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  primary: PropTypes.bool.isRequired,
  danger: PropTypes.bool,
  borderless: PropTypes.bool,
  disabled: PropTypes.bool,
  secondary: PropTypes.bool,
  textStyles: PropTypes.object,
}

export const Button = ({
  children,
  primary,
  secondary,
  danger,
  borderless,
  size,
  onPress,
  icon,
  endIcon,
  disabled,
  isLoading,
  textStyles,
  ...props
}) => {
  const { theme } = useAppContext()
  return (
    <StyledTouchableOpacity
      onPress={disabled || isLoading ? () => {} : onPress}
      activeOpacity={disabled || isLoading ? 1 : 0.2}
      $primary={primary}
      $secondary={secondary}
      $danger={danger}
      $borderless={borderless}
      $disabled={disabled || isLoading}
      {...props}
    >
      <Row $width='auto' style={{ position: 'relative' }}>
        {isLoading ? (
          <LoadingSpinner
            style={{ height: size === 'small' ? 14 : size === 'large' ? 20 : 18 }}
            color={danger ? theme.backgroundDefault : theme.textWeak}
          />
        ) : (
          <>
            {icon || null}
            {!!children && (
              <SizedText
                primary={primary}
                secondary={secondary}
                danger={danger}
                borderless={borderless}
                size={size}
                disabled={disabled}
                textStyles={textStyles}
              >
                {children}
              </SizedText>
            )}
            {endIcon || null}
          </>
        )}
      </Row>
    </StyledTouchableOpacity>
  )
}

Button.propTypes = {
  children: PropTypes.node,
  onPress: PropTypes.func,
  primary: PropTypes.bool,
  secondary: PropTypes.bool,
  borderless: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  icon: PropTypes.node,
  endIcon: PropTypes.node,
  disabled: PropTypes.bool,
  danger: PropTypes.bool,
  isLoading: PropTypes.bool,
  textStyles: PropTypes.object,
}

Button.defaultProps = {
  primary: false,
  secondary: false,
  danger: false,
  borderless: false,
  size: 'medium',
  onClick: () => {},
  disabled: false,
}
