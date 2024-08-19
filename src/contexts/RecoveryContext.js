import PropTypes from 'prop-types'
import * as React from 'react'
import { createContext, useContext } from 'react'

const RecoveryContext = createContext({})

export const useRecoveryContext = () => useContext(RecoveryContext)

const RecoveryContextProvider = ({ children }) => {
  const [securityQuestionsObj, setSecurityQuestionsObj] = React.useState({})
  const [pdfKitObj, setPdfKitObj] = React.useState({})
  const [step, setStep] = React.useState(1)
  const [securityAnswers, setSecurityAnswers] = React.useState([])
  const [nerdShareObj, setNerdShareObj] = React.useState({})
  const [recoveryOption, setRecoveryOption] = React.useState('')
  const [recoveryFailedMessage, setRecoveryFailedMessage] = React.useState('')
  const [isResetPinFlow, setIsResetPinFlow] = React.useState(false)
  const [tempStoredShares, setTempStoredShares] = React.useState([])
  const [oldPin, setOldPin] = React.useState('')

  const setSecurityAnswer = (text, index) => {
    let updatedArray = [...securityAnswers]
    updatedArray[index] = text
    setSecurityAnswers(updatedArray)
  }

  return (
    <RecoveryContext.Provider
      value={{
        securityQuestionsObj,
        setSecurityQuestionsObj,
        pdfKitObj,
        setPdfKitObj,
        step,
        setStep,
        securityAnswers,
        setSecurityAnswer,
        setNerdShareObj,
        nerdShareObj,
        recoveryOption,
        setRecoveryOption,
        setSecurityAnswers,
        recoveryFailedMessage,
        setRecoveryFailedMessage,
        isResetPinFlow,
        setIsResetPinFlow,
        tempStoredShares,
        setTempStoredShares,
        oldPin,
        setOldPin,
      }}
    >
      {children}
    </RecoveryContext.Provider>
  )
}

RecoveryContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default RecoveryContextProvider
