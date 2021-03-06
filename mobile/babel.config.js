module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module:react-native-dotenv', {
        'moduleName' : '@env',
        'path' : '.env',
        'safe' : true,
        'allowUndefined' : false
      }],
      [
          'module-resolver',
          {
              extensions: [
                  '.js',
                  '.jsx',
                  '.ts',
                  '.tsx',
                  '.android.js',
                  '.android.tsx',
                  '.ios.js',
                  '.ios.tsx'
              ],
              root: ['./src']
          }
      ]
  ]
  };
};
