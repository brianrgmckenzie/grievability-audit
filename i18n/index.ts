import type { Lang, Translations } from './types';
import { en } from './en';
import { fr } from './fr';
import { es } from './es';
import { de } from './de';

export const translations: Record<Lang, Translations> = { en, fr, es, de };
export type { Lang, Translations, DimT, BandT } from './types';
