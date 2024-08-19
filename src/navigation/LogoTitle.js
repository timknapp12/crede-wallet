import PropTypes from 'prop-types'

import { H3, Row, Svg } from 'components'

const LogoTitle = ({ route }) => {
  return (
    <Row $width='auto'>
      {route?.params?.icon ? (
        <Svg height={24} width={24} uri={route?.params?.icon} />
      ) : null}
      <H3>{route?.params?.title}</H3>
    </Row>
  )
}

LogoTitle.propTypes = {
  route: PropTypes.object.isRequired,
}

export default LogoTitle
