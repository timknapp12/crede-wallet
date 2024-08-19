import PropTypes from 'prop-types'
import { ActivityIndicator } from 'react-native'
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons'

import CredeSvg from 'assets/icons/Crede.svg'
import EditSvg from 'assets/icons/Edit.svg'
import FaceIDSvg from 'assets/icons/FaceID.svg'
import FingerprintIDSvg from 'assets/icons/FingerprintID.svg'
import HomeViewGraphicDarkSvg from 'assets/icons/HomeViewGraphicDark.svg'
import NetworksTabSvg from 'assets/icons/NetworksTabIcon.svg'
import AddSvg from 'assets/icons/add.svg'
import AppearanceSvg from 'assets/icons/appearance.svg'
import BackSvg from 'assets/icons/back.svg'
import BellSvg from 'assets/icons/bell.svg'
import ChangeKeySvg from 'assets/icons/change-key.svg'
import CheckCircleSvg from 'assets/icons/checkCircle.svg'
import CheckmarkSvg from 'assets/icons/checkmark.svg'
import CheckmarkLargeSvg from 'assets/icons/checkmarkLarge.svg'
import ChevronDownSvg from 'assets/icons/chevron-down.svg'
import ChevronUpSvg from 'assets/icons/chevron-up.svg'
import ClosePanelSvg from 'assets/icons/close-panel.svg'
import CloseSvg from 'assets/icons/close.svg'
import CopySvg from 'assets/icons/copy.svg'
import DarkModeSvg from 'assets/icons/darkMode.svg'
import DecreaseSvg from 'assets/icons/decrease.svg'
import DeviceSvg from 'assets/icons/device.svg'
import DoubleArrowSvg from 'assets/icons/doubleArrow.svg'
import DownloadSvg from 'assets/icons/download.svg'
import EmailSvg from 'assets/icons/email.svg'
import ExportSvg from 'assets/icons/export.svg'
import ExternalLinkSvg from 'assets/icons/externalLink.svg'
import EyeSvg from 'assets/icons/eye.svg'
import FailureSvg from 'assets/icons/failure.svg'
import HamburgerSvg from 'assets/icons/hamburger.svg'
import HiddenSvg from 'assets/icons/hidden.svg'
import HistorySvg from 'assets/icons/history.svg'
import HomeSvg from 'assets/icons/home.svg'
import ImportWalletSvg from 'assets/icons/import-wallet.svg'
import IncreaseSvg from 'assets/icons/increase.svg'
import InfoSvg from 'assets/icons/info.svg'
import KeySvg from 'assets/icons/key.svg'
import LightModeSvg from 'assets/icons/lightMode.svg'
import NetworksSvg from 'assets/icons/networks.svg'
import OpenSvg from 'assets/icons/open.svg'
import PasteSvg from 'assets/icons/paste.svg'
import PinSvg from 'assets/icons/pin.svg'
import PrivacySvg from 'assets/icons/privacy.svg'
import ProfileSvg from 'assets/icons/profile.svg'
import ProfileCircleSvg from 'assets/icons/profileCircle.svg'
import QRCodeSvg from 'assets/icons/qr-code.svg'
import ReceiveArrowSvg from 'assets/icons/receiveArrow.svg'
import RecoveryPDFSvg from 'assets/icons/recovery-pdf.svg'
import SecurityQuestionsSvg from 'assets/icons/recovery-security-questions.svg'
import RecoverySeedPhraseSvg from 'assets/icons/recovery-seed-phrase.svg'
import RecoveryKeySvg from 'assets/icons/recoveryKey.svg'
import RefreshSvg from 'assets/icons/refresh.svg'
import SearchSvg from 'assets/icons/search.svg'
import SendSvg from 'assets/icons/send.svg'
import SendArrowSvg from 'assets/icons/sendArrow.svg'
import SmallErrorSvg from 'assets/icons/smallErrorSvg.svg'
import SmallWarningSvg from 'assets/icons/smallWarningSvg.svg'
import SuccessSvg from 'assets/icons/success.svg'
import SuccessSmallSvg from 'assets/icons/successSmall.svg'
import TermsSvg from 'assets/icons/terms.svg'
import TokensSvg from 'assets/icons/tokens.svg'
import VisibilityOffSvg from 'assets/icons/visibilityOff.svg'
import WalletSvg from 'assets/icons/wallet.svg'

import { useAppContext } from 'contexts/AppContext'

export const CredeLogo = ({ width = 40, height = 40, ...props }) => {
  const { theme } = useAppContext()
  return <CredeSvg color={theme.brandDefault} width={width} height={height} {...props} />
}

CredeLogo.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
}

export const KeyIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <KeySvg color={theme.brandDefault} {...props} />
}

export const HomeViewGraphicIcon = () => {
  return <HomeViewGraphicDarkSvg />
}

export const EmailIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <EmailSvg color={theme.brandDefault} {...props} />
}

export const InfoIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <InfoSvg color={theme.textDefault} {...props} />
}

export const CheckmarkIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <CheckmarkSvg color={theme.textDefault} {...props} />
}

export const CheckmarkLargeIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <CheckmarkLargeSvg color={theme.textDefault} {...props} />
}

export const WalletIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <WalletSvg color={theme.brandDefault} {...props} />
}

export const SuccessIcon = ({ ...props }) => {
  return <SuccessSvg {...props} />
}

export const SuccessSmallIcon = ({ ...props }) => {
  return <SuccessSmallSvg {...props} />
}

export const SmallErrorIcon = ({ ...props }) => {
  return <SmallErrorSvg {...props} />
}

export const SmallWarningIcon = ({ ...props }) => {
  return <SmallWarningSvg {...props} />
}

export const FingerprintIDIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <FingerprintIDSvg color={theme.textDefault} {...props} />
}

export const FaceIDIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <FaceIDSvg color={theme.textDefault} {...props} />
}

export const EyeIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <EyeSvg color={theme.textDefault} {...props} />
}

export const CloseIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <CloseSvg color={theme.textDefault} {...props} />
}

export const QRCodeIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <QRCodeSvg color={theme.brandDefault} {...props} />
}

export const SendIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <SendSvg color={theme.backgroundDefault} {...props} />
}

export const HomeIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <HomeSvg color={theme.textDefault} {...props} />
}

export const HistoryIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <HistorySvg color={theme.textDefault} {...props} />
}

export const BellIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <BellSvg color={theme.textDefault} {...props} />
}

export const HamburgerIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <HamburgerSvg color={theme.textDefault} {...props} />
}

export const ChevronDownIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <ChevronDownSvg color={theme.textDefault} {...props} />
}

export const ChevronUpIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <ChevronUpSvg color={theme.textDefault} {...props} />
}

export const AddIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <AddSvg color={theme.brandDefault} {...props} />
}

export const IncreaseIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <IncreaseSvg color={theme.successStrong} {...props} />
}

export const DecreaseIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <DecreaseSvg color={theme.dangerStrong} {...props} />
}

export const ClosePanelIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <ClosePanelSvg color={theme.textDefault} {...props} />
}

export const ProfileIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <ProfileSvg color={theme.textDefault} {...props} />
}

export const ProfileCircleIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <ProfileCircleSvg color={theme.textDefault} {...props} />
}

export const AppearanceIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <AppearanceSvg color={theme.textDefault} {...props} />
}

export const NetworksIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <NetworksSvg color={theme.textDefault} {...props} />
}

export const TokensIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <TokensSvg color={theme.textDefault} {...props} />
}

export const ExportIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <ExportSvg color={theme.textDefault} {...props} />
}

export const ChangeKeyIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <ChangeKeySvg color={theme.textDefault} {...props} />
}

export const TermsIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <TermsSvg color={theme.textDefault} {...props} />
}

export const BackIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <BackSvg color={theme.textDefault} {...props} />
}

export const OpenIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <OpenSvg color={theme.brandDefault} {...props} />
}

export const RefreshIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <RefreshSvg color={theme.textDefault} {...props} />
}

export const SearchIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <SearchSvg color={theme.textDefault} {...props} />
}

export const EditIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <EditSvg color={theme.brandDefault} {...props} />
}

export const CheckCircleIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <CheckCircleSvg color={theme.textDefault} {...props} />
}

export const NetworksTabIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <NetworksTabSvg color={theme.textDefault} {...props} />
}

export const CopyIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <CopySvg color={theme.brandDefault} {...props} />
}

export const PasteIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <PasteSvg color={theme.brandDefault} {...props} />
}

export const HiddenIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <HiddenSvg color={theme.textDefault} {...props} />
}

export const PrivacyIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <PrivacySvg color={theme.textDefault} {...props} />
}

export const FailureIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <FailureSvg color={theme.dangerStrong} {...props} />
}

export const DoubleArrowIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <DoubleArrowSvg color={theme.textDefault} {...props} />
}

export const VisibilityOffIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <VisibilityOffSvg color={theme.textDefault} {...props} />
}

export const ExternalLinkIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <ExternalLinkSvg color={theme.brandDefault} {...props} />
}

export const DeviceIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <DeviceSvg color={theme.textDefault} {...props} />
}

export const LightModeIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <LightModeSvg color={theme.textDefault} {...props} />
}

export const DarkModeIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <DarkModeSvg color={theme.textDefault} {...props} />
}

export const RecoveryKeyIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <RecoveryKeySvg color={theme.textDefault} {...props} />
}

export const SecurityQuestionsIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <SecurityQuestionsSvg color={theme.textDefault} {...props} />
}

export const RecoverySeedPhraseIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <RecoverySeedPhraseSvg color={theme.textDefault} {...props} />
}

export const RecoveryPDFIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <RecoveryPDFSvg color={theme.textDefault} {...props} />
}

export const PinIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <PinSvg color={theme.textDefault} {...props} />
}

export const SendArrowIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <SendArrowSvg color={theme.textDefault} {...props} />
}

export const ReceiveArrowIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <ReceiveArrowSvg color={theme.textDefault} {...props} />
}

export const DownloadIcon = ({ ...props }) => {
  const { theme } = useAppContext()
  return <DownloadSvg color={theme.backgroundDefault} {...props} />
}

export const LoadingSpinner = ({ size = 'small', color, ...props }) => {
  const { theme } = useAppContext()
  return <ActivityIndicator size={size} color={color || theme.brandDefault} {...props} />
}

LoadingSpinner.propTypes = {
  size: PropTypes.string,
  color: PropTypes.string,
}

export const FingerprintIcon = () => {
  const { theme } = useAppContext()
  return <Ionicons name='fingerprint' size={60} color={theme.brandDefault} />
}

export const ImportWalletIcon = ({ ...props }) => {
  return <ImportWalletSvg {...props} />
}
