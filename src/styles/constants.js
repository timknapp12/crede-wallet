import colors from './colors'

// FONT TYPE
const primaryFont = '"Nunito Sans", "Helvetica Neue", Helvetica, Arial, sans-serif'
const secondaryFont =
  '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace'
const code = "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace"

// TEXT WEIGHT
const regular = '400'
const bold = '700'
const black = '900'

//  PIXEL VALUES
const s4 = '4px'
const s8 = '8px'
const s10 = '10px'
const s12 = '12px'
const s14 = '14px'
const s16 = '16px'
const s18 = '18px'
const s20 = '20px'
const s22 = '22px'
const s24 = '24px'
const s28 = '28px'
const s32 = '32px'
const s36 = '36px'
const s40 = '40px'
const s48 = '48px'
const s64 = '64px'
const s72 = '72px'
const s96 = '96px'
const s120 = '120px'
const s140 = '140px'
const s200 = '200px'
const s240 = '240px'

export const size = {
  s4,
  s8,
  s10,
  s12,
  s14,
  s16,
  s18,
  s20,
  s22,
  s24,
  s28,
  s32,
  s36,
  s40,
  s48,
  s64,
  s72,
  s96,
  s120,
  s140,
  s200,
  s240,
}

const typography = {
  type: {
    primaryFont,
    secondaryFont,
    code,
  },
  weight: {
    regular,
    bold,
    black,
  },
  ...size,
}

export const checkmarkLight =
  'https://firebasestorage.googleapis.com/v0/b/staging-wallet-recovery.appspot.com/o/networks%2Fcheck.svg?alt=media&token=b60d4302-ea66-41b8-ab8c-4800aebd69f9'
export const checkmarkDark =
  'https://firebasestorage.googleapis.com/v0/b/staging-wallet-recovery.appspot.com/o/networks%2Fcheck-dark.svg?alt=media&token=36ea2ff7-3f60-499f-a142-ecc3358b6f84'

const constants = {
  ...typography,
  ...colors,
}

export default constants
