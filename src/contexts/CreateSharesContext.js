import PropTypes from 'prop-types'
import * as React from 'react'
import { createContext, useContext } from 'react'

const CreateSharesContext = createContext({})

export const useCreateSharesContext = () => useContext(CreateSharesContext)

const CreateSharesContextProvider = ({ children }) => {
  const [selectedSecurityQuestions, setSelectedSecurityQuestions] = React.useState([])
  const [securityAnswers, setSelectedAnswers] = React.useState([])
  const [tempStoredShares, setTempStoredShares] = React.useState([])
  const [importedMnemonic, setImportedMnemonic] = React.useState('')

  const addSecurityQuestion = question => {
    setSelectedSecurityQuestions([...selectedSecurityQuestions, question])
  }

  const addSecurityAnswer = answer => {
    const updatedAnswers = [...securityAnswers, answer]
    setSelectedAnswers(updatedAnswers)
    return updatedAnswers
  }

  const removeLastSecurityQuestionAndAnswer = () => {
    setSelectedSecurityQuestions(selectedSecurityQuestions?.slice(0, -1))
    setSelectedAnswers(securityAnswers?.slice(0, -1))
  }

  const removeAllSecurityAnswers = () => {
    setSelectedAnswers([])
  }

  return (
    <CreateSharesContext.Provider
      value={{
        securityAnswers,
        selectedSecurityQuestions,
        setSelectedSecurityQuestions,
        addSecurityQuestion,
        removeLastSecurityQuestionAndAnswer,
        addSecurityAnswer,
        tempStoredShares,
        setTempStoredShares,
        removeAllSecurityAnswers,
        importedMnemonic,
        setImportedMnemonic,
      }}
    >
      {children}
    </CreateSharesContext.Provider>
  )
}

CreateSharesContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default CreateSharesContextProvider
