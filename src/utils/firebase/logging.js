import analytics from '@react-native-firebase/analytics'
import crashlytics from '@react-native-firebase/crashlytics'

const logEvent = async eventName => {
  await analytics().logEvent(eventName)
  crashlytics().log(eventName)
}

export default logEvent
