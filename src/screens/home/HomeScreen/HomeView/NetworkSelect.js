import PropTypes from 'prop-types'

import { Select } from 'components'

const NetworkSelect = ({ selectedNetwork, ...props }) => {
  return <Select selectedNetwork={selectedNetwork} {...props} />
}

NetworkSelect.propTypes = {
  selectedNetwork: PropTypes.object,
}

export default NetworkSelect
