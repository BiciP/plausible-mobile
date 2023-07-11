import AsyncStorage from '@react-native-async-storage/async-storage'
import { atom } from 'jotai'
import { DateTime } from 'luxon'

export const pagesAtom = atom<{ [key: string]: any }>({})

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
    (get) => get(baseAtom),
    (get, set, update) => {
      let cutoff = DateTime.now().set({ minute: 0, second: 0, millisecond: 0 }).toMillis()
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