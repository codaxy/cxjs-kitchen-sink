module.exports = function getBabelConfig({ modules }) {
   return {
      presets: [
         [
            'cx-env',
            {
               targets: {
                  chrome: 70,
               },
               corejs: 3,
               modules: modules,
               loose: true,
               useBuiltIns: 'usage',
               cx: {
                  imports: {
                     useSrc: !modules,
                  },
               },
            },
         ],
      ],
      plugins: [],
   };
};
