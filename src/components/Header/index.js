import PropTypes from 'prop-types'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import { Row } from '../containers'
import { BackIcon } from '../svgs'
import { H3 } from '../texts'

export const Header = ({ icon, name, navigateFunction }) => {
  return (
    <Row $justify='space-between' style={styles.row}>
      <TouchableOpacity onPress={navigateFunction}>
        <BackIcon />
      </TouchableOpacity>
      <Row $width='auto'>
        {icon && icon}
        <H3>{name}</H3>
      </Row>
      <View />
    </Row>
  )
}

Header.propTypes = {
  icon: PropTypes.node,
  name: PropTypes.string.isRequired,
  navigateFunction: PropTypes.func.isRequired,
}

const styles = StyleSheet.create({
  row: {
    paddingBottom: 10,
  },
})
