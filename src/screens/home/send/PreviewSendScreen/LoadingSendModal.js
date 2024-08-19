import PropTypes from 'prop-types'
import { Modal, StyleSheet } from 'react-native'

import { Column, H3, LoadingSpinner, ScreenContainer } from 'components'

import i18n from 'translations/config'

const { t } = i18n

const LoadingSendModal = ({ isOpen }) => {
  return (
    <Modal visible={isOpen} onRequestClose={() => {}} transparent={true}>
      <ScreenContainer paddingTop='0px'>
        <Column style={styles.columnContainer}>
          <H3>{`${t('Sending')}...`}</H3>
          <LoadingSpinner size='large' />
        </Column>
      </ScreenContainer>
    </Modal>
  )
}

LoadingSendModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
}

const styles = StyleSheet.create({
  columnContainer: {
    flex: 1,
  },
})

export default LoadingSendModal
