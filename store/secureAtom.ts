import { atom } from 'jotai';
import * as SecureStore from 'expo-secure-store';

const atomWithSecureStorage = (key: string, initialValue: any) => {
  const baseAtom = atom(initialValue)
  baseAtom.onMount = (setValue) => {
    ; (async () => {
      const item = await SecureStore.getItemAsync(key)
      if (item == null) return
      setValue(JSON.parse(item))
    })()
  }

  const derivedAtom = atom(
    (get) => {
      return get(baseAtom)
    },
    (get, set, update) => {
      let nextValue =
        typeof update === 'function' ? update(get(baseAtom)) : update
      set(baseAtom, nextValue)
      SecureStore.setItemAsync(key, JSON.stringify(nextValue))
    }
  )

  return derivedAtom
}

export default atomWithSecureStorage