module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@screens': './src/screens',
            '@hooks': './src/hooks',
            '@utils': './src/utils',
            '@api': './src/api',
            '@theme': './src/theme',
            '@navigation': './src/navigation',
            '@assets': './assets'
          }
        }
      ]
    ]
  };
};
