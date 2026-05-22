import { useState, useCallback } from 'react'
import { loadFromLS, saveToLS } from '../utils'

export function useLocalStorage<T>(key: string, init: T): [T, (val: T) => void] {
  const [value, setValue] = useState<T>(() => loadFromLS<T>(key, init))

  const save = useCallback(
    (val: T) => {
      setValue(val)
      saveToLS(key, val)
    },
    [key]
  )

  return [value, save]
}
