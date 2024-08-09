'use client'

import { createContext, useContext, useState } from 'react'

interface UtilContextProps {
  loader: boolean
  setLoader: (value: boolean) => void
}

export const UtilContext = createContext<UtilContextProps>(null!)

interface UtilContextProviderProps {
  children: React.ReactNode
}

export const UtilContextProvider: React.FC<UtilContextProviderProps> = ({
  children,
}) => {
  const [loader, setLoader] = useState<boolean>(false)

  const setLoaderFn = (value: boolean) => {
    setLoader(value)
  }
  return (
    <UtilContext.Provider
      value={{
        loader,
        setLoader: setLoaderFn,
      }}
    >
      {children}
    </UtilContext.Provider>
  )
}

export const useUtilContext = () => {
  return useContext(UtilContext)
}
