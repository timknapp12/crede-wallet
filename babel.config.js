// eslint-disable-next-line no-undef
module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        '@babel/plugin-transform-private-methods',
        {
          loose: true,
        },
      ],
      [
        'module-resolver',
        {
          alias: {
            assets: './assets',
            api: './src/api',
            components: './src/components',
            contexts: './src/contexts',
            navigation: './src/navigation',
            screens: './src/screens',
            styles: './src/styles',
            translations: './src/translations',
            utils: './src/utils',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  }
}
