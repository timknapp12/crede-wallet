import styled from 'styled-components/native'

const TextWithColor = styled.Text`
  color: ${({ theme }) => theme.textDefault};
`

const bold = {
  fontWeight: 700,
}

export const GiantText = styled(TextWithColor)`
  font-size: ${({ theme }) => theme.s64};
  font-weight: 700;
`

export const AppTitle = styled(TextWithColor)`
  font-family: 'Poppins';
  font-size: ${({ theme }) => theme.s40};
  font-weight: 700;
  letter-spacing: -1.5px;
  text-align: center;
`

export const ScreenTitle = styled(TextWithColor)`
  ${bold};
  font-family: 'Poppins';
  font-size: ${({ theme }) => theme.s32};
  letter-spacing: -0.5px;
`

export const H2 = styled(TextWithColor)`
  ${bold};
  font-family: 'Poppins';
  font-size: ${({ theme }) => theme.s24};
`

export const H3 = styled(TextWithColor)`
  ${bold};
  font-size: ${({ theme }) => theme.s18};
`

export const H4 = styled(TextWithColor)`
  ${bold};
  font-size: ${({ theme }) => theme.s16};
`

export const H5 = styled(TextWithColor)`
  ${bold};
  font-size: ${({ theme }) => theme.s14};
`

export const H6 = styled(TextWithColor)`
  font-size: ${({ theme }) => theme.s10};
`

export const PrimaryText = styled(TextWithColor)`
  font-family: 'Lato';
  font-size: ${({ theme }) => theme.s16};
  letter-spacing: 0.15px;
`

export const PrimaryTextSmall = styled(PrimaryText)`
  font-size: ${({ theme }) => theme.s12};
  letter-spacing: 0.4px;
`

export const SecondaryColorPrimaryText = styled.Text`
  font-family: 'Lato';
  font-size: ${({ theme }) => theme.s16};
  letter-spacing: 0.15px;
  color: ${({ theme }) => theme.brandSecondary};
`

export const SecondaryText = styled(PrimaryText)`
  color: ${({ theme }) => theme.textWeak};
`

export const SecondaryTextSmall = styled(SecondaryText)`
  font-size: ${({ theme }) => theme.s12};
  letter-spacing: 0.4px;
`

export const DisabledText = styled(PrimaryText)`
  color: ${({ theme }) => theme.textDisabled};
`

export const P = styled(TextWithColor)`
  font-family: 'Lato';
  font-size: ${({ theme }) => theme.s16};
`

export const H5Error = styled(H5)`
  color: ${({ theme }) => theme.errorMain};
`

export const H4Error = styled(H4)`
  color: ${({ theme }) => theme.errorMain};
`

const ButtonTextWithColor = styled.Text`
  color: ${({ theme }) => theme.backgroundDefault};
  font-weight: 600;
  line-height: ${({ theme }) => theme.s18};
`

export const PrimaryButtonText = styled(ButtonTextWithColor)`
  font-size: ${({ $size, theme }) =>
    $size === 'small' ? theme.s12 : $size === 'large' ? theme.s18 : theme.s16};
`

export const SecondaryButtonText = styled(TextWithColor)`
  font-size: ${({ $size, theme }) =>
    $size === 'small' ? theme.s12 : $size === 'large' ? theme.s18 : theme.s16};
  color: ${({ theme }) => theme.brandDefault};
  font-weight: 600;
`

export const DangerButtonText = styled(SecondaryButtonText)`
  color: ${({ $primary, theme }) => ($primary ? theme.backgroundDefault : theme.danger)};
`

export const BorderlessButtonText = styled(PrimaryButtonText)`
  color: ${({ theme }) => theme.brandSecondary};
`

export const Link = styled.Text`
  font-family: 'SF Pro Text';
  font-size: ${({ theme }) => theme.s12};
  font-weight: 600;
  color: ${({ theme }) => theme.brandDefault};
  text-decoration: underline;
  text-decoration-color: ${({ theme }) => theme.brandDefault};
`

// h1 - 32px
// h2 - 24px
// h3 - 18px
// h4 - 16px
// h5 - 14px
// h6 - 10px
