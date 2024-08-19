import styled, { css } from 'styled-components/native'

const getVariantStyles = ({
  $primary = false,
  $danger = false,
  $borderless = false,
  $secondary = false,
  theme,
}) =>
  $primary
    ? css`
        background-color: ${theme.brandDefault};
        border-color: ${theme.brandDefault};
        color: ${theme.brandDefault};
      `
    : $borderless
      ? css`
          background-color: transparent;
          border-color: transparent;
          color: ${theme.textDefault};
        `
      : $danger
        ? css`
            background-color: ${theme.danger};
            border-color: ${theme.danger};
          `
        : $secondary
          ? css`
              background-color: ${theme.brandSecondary};
              border-color: ${theme.brandSecondary};
              color: ${theme.brandSecondary};
            `
          : css`
              background-color: transparent;
              border-color: ${theme.brandDefault};
            `

export const StyledTouchableOpacity = styled.TouchableOpacity`
  border-width: 1px;
  border-radius: 16px 4px 16px 4px;
  padding: ${({ theme }) => `${theme.s12} ${theme.s8}`};
  opacity: ${({ $disabled }) => ($disabled ? '0.5' : '1')};
  align-items: center;
  justify-content: center;
  ${props => getVariantStyles(props)}
  width: 100%;
  ${props => ({ ...props?.style })}
`
