import PropTypes from 'prop-types'

import { ChipText, StyledChip } from './chip.styles'

export const Chip = ({ name, isSelected, variant, ...props }) => {
  return (
    <StyledChip $isSelected={isSelected} $variant={variant} {...props}>
      <ChipText $variant={variant}>{name}</ChipText>
    </StyledChip>
  )
}

Chip.propTypes = {
  variant: PropTypes.string,
  name: PropTypes.string.isRequired,
  isSelected: PropTypes.bool,
}
