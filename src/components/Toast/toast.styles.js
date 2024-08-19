import styled from 'styled-components/native'

export const StyledToast = styled.View`
  flex-direction: row;
  width: 100%;
  background-color: ${({ theme, $variant }) =>
    $variant === 'success'
      ? theme.success
      : $variant === 'error'
        ? theme.danger
        : theme.warningWeak};
  border-radius: ${({ theme }) => theme.s8};
  padding: ${({ theme }) => theme.s8};
  padding-top: ${({ theme }) => theme.s12};
  padding-bottom: ${({ theme }) => theme.s12};
  gap: ${({ theme }) => theme.s8};
  align-items: center;
  justify-content: space-between;
`

export const ToastText = styled.Text`
  font-weight: 700;
`
