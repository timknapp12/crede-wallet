const { getDefaultConfig } = require('expo/metro-config')

// eslint-disable-next-line no-undef
module.exports = (() => {
  // eslint-disable-next-line no-undef
  const config = getDefaultConfig(__dirname)

  const { transformer, resolver } = config

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  }
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...resolver.sourceExts, 'svg'],
  }

  return config
})()
