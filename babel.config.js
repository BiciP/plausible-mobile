module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      require.resolve("expo-router/babel"),
      'react-native-reanimated/plugin',
      'jotai/babel/plugin-react-refresh',
      [
        "formatjs",
        {
          "idInterpolationPattern": "[sha512:contenthash:base64:6]",
          "ast": true
        }
      ]
    ],
  };
};