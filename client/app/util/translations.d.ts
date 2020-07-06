interface Translation {
   [key: string]: string | number;
}

interface Translatable<T> {
   addTranslations(culture: string, translations: Partial<T>): T & Translatable<T>;
}

export function createTranslationDictionary<T>(name: string, translations: T): T & Translatable<T>;

export function addTranslations(name: string, culture: string, translations: any): T & Translatable<T>;
