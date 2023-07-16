import AsyncStorage from '@react-native-async-storage/async-storage'
import { atom } from 'jotai'

const atomWithAsyncStorage = (key: string, initialValue: any) => {
  const baseAtom = atom(initialValue)
  baseAtom.onMount = (setValue) => {
    ; (async () => {
      const item = await AsyncStorage.getItem(key)
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
      AsyncStorage.setItem(key, JSON.stringify(nextValue))
    }
  )

  return derivedAtom
}

export default atomWithAsyncStorage