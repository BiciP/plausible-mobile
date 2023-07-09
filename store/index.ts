import AsyncStorage from '@react-native-async-storage/async-storage'
import { atom } from 'jotai'

export const pagesAtom = atom<{[key: string]: any}>({})

const atomWithAsyncStorage = (key: string, initialValue: any) => {
  const baseAtom = atom(initialValue)
  baseAtom.onMount = (setValue) => {
    ;(async () => {
      const item = await AsyncStorage.getItem(key)
      if (item == null) return
      setValue(JSON.parse(item))
    })()
  }

  const derivedAtom = atom(
    (get) => get(baseAtom),
    (get, set, update) => {
      let cutoff = Date.now() - 1000 * 60 * 60
      let nextValue =
        typeof update === 'function' ? update(get(baseAtom)) : update
      nextValue = nextValue.filter((time: number) => cutoff < time)
      set(baseAtom, nextValue)
      AsyncStorage.setItem(key, JSON.stringify(nextValue))
    }
  )

  return derivedAtom
}

export const requestsAtom = atomWithAsyncStorage('requests', [] as number[])