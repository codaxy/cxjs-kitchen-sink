module.exports = {
   cacheDirectory: true,
   cacheIdentifier: 'v1',
   presets: [
      [
         'cx-env',
         {
            targets: {
               chrome: 70,
            },
            corejs: 3,
            modules: false,
            loose: true,
            useBuiltIns: 'usage',
            cx: {
               imports: {
                  useSrc: true,
               },
            },
         },
      ],
   ],
   plugins: [],
};
