import rawMessages from './messages.json';

export type Translation = typeof rawMessages.pt;
export type TranslationKey = keyof Translation;
export type Locale = keyof typeof rawMessages;

export const messages = rawMessages;
