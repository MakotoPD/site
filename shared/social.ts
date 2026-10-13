export type SocialPicture = 'architecture' | 'systems' | 'form' | 'water'
export function socialPresentation(path: string): { eyebrow: string; picture: SocialPicture } {
  if (path.startsWith('/blog/')) return { eyebrow: 'Z warsztatu Makoto', picture: 'systems' }
  if (path.startsWith('/realizacje')) return { eyebrow: 'Wybrane realizacje', picture: 'form' }
  if (path.startsWith('/strony-internetowe/'))
    return { eyebrow: 'Strony dla lokalnych firm', picture: 'architecture' }
  if (path === '/uslugi/aplikacje-webowe')
    return { eyebrow: 'Dedykowane aplikacje', picture: 'systems' }
  if (['/uslugi/projektowanie-ui-ux', '/uslugi/sklepy-internetowe'].includes(path))
    return {
      eyebrow: path.endsWith('ui-ux') ? 'Design i identyfikacja' : 'Sklepy internetowe',
      picture: 'form',
    }
  if (['/uslugi/opieka-techniczna', '/wycena'].includes(path))
    return {
      eyebrow: path === '/wycena' ? 'Twój pomysł. Konkretny zakres.' : 'Opieka nad stroną',
      picture: 'water',
    }
  return { eyebrow: 'Design. Kod. Charakter.', picture: 'architecture' }
}
