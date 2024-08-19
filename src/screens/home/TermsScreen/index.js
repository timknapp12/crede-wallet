import { useEffect, useState } from 'react'

import { useGetTerms } from 'api'

import { Column, Gap, H4, H5Error, P, ScreenContainer, SkeletonLoader } from 'components'

import { size } from 'styles/constants'

const { s4, s24 } = size

const TermsScreen = () => {
  const [termsCopy, setTermsCopy] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const { mutateAsync: getTerms } = useGetTerms()

  useEffect(() => {
    const setTerms = async () => {
      try {
        const termsData = await getTerms()
        const copyArray = JSON.parse(termsData?.termsAndConditions)
        setTermsCopy(copyArray)
      } catch (error) {
        setError('Error getting terms, please try again later')
      } finally {
        setIsLoading(false)
      }
    }

    setTerms()
  }, [])

  return (
    <ScreenContainer paddingTop={s24}>
      <Gap $height={s24} />
      <Column $align='flex-start'>
        {isLoading
          ? [1, 2, 3, 4].map(item => (
              <SkeletonLoader isLoading width='100%' height={100} key={item} />
            ))
          : termsCopy.map(item => (
              <Column $gap={s4} $align='flex-start' key={item.id}>
                <H4>{item.title}</H4>
                <P>{item.p}</P>
              </Column>
            ))}
        {error ? <H5Error>{error}</H5Error> : null}
      </Column>
    </ScreenContainer>
  )
}

export default TermsScreen
