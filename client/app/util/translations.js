import { Culture } from 'cx/ui';
const translationData = {};

export function addTranslations(name, culture, translations) {
   let dict = translationData[name];
   if (!dict) dict = translationData[name] = {};
   dict[culture.toLowerCase()] = { ...translations };
   return getTranslationsProxy(name, translations);
}

export function printTranslationData() {
   let result = {};
   Object.keys(translationData).forEach((key) => {
      console.log(translationData[key]['en']);
      result[key] = translationData[key]['en'];
   });
   return result;
}

export function createTranslationDictionary(name, translations) {
   addTranslations(name, 'en', translations);

   return getTranslationsProxy(name, translations);
}

function getTranslationsProxy(name, defaultTranslations) {
   let proxy = {};

   Object.keys(defaultTranslations).forEach((key) => {
      Object.defineProperty(proxy, key, {
         get: function () {
            let dict = translationData[name];
            let cultureData = dict[Culture.culture];
            if (cultureData && cultureData[key]) return cultureData[key];
            return defaultTranslations[key];
         },
      });
   });

   proxy.addTranslations = function (culture, translations) {
      return addTranslations(name, culture, translations);
   };

   return proxy;
}
