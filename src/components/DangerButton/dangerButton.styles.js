import styled, { css } from 'styled-components/native'

const getVariantStyles = ({ $primary = false, $disabled, theme }) =>
  $primary
    ? css`
        background-color: ${$disabled ? theme.backgroundMedium : theme.danger};
        border-width: 0px;
      `
    : css`
        background-color: transparent;
        border-color: ${$disabled ? theme.textDisabled : theme.danger};
        border-width: 1px;
      `

export const StyledTouchableOpacity = styled.TouchableOpacity`
  border-width: 1px;
  border-radius: ${({ theme }) => theme.s8};
  padding: ${({ theme }) => `${theme.s12} ${theme.s8}`};
  align-items: center;
  justify-content: center;
  ${props => getVariantStyles(props)}
  width: 100%;
`
