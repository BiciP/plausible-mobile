import atomWithSecureStorage from './secureAtom'

export const instanceAtom = atomWithSecureStorage('app.instance', 'https://plausible.io')