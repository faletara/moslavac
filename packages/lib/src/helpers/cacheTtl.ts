/**
 * Rok keša od 1 dan (sekunde) za sadržaj koji se praktički ne mijenja ili koji
 * osvježava CMS webhook. Jedan izvor za `revalidate` u pozivima fetchera.
 *
 * Segmentni `export const revalidate` ostaje literal `86400`: Next ga čita
 * statički i ne prihvaća uvezenu konstantu ni izraz.
 */
export const ONE_DAY_TTL = 86_400;
