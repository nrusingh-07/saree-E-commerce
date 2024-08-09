'use client'
import { useUserAuth } from '@/context/AuthContext'
import React, { useEffect, useState } from 'react'

interface AppProps {
  children: React.ReactNode
}

const App: React.FC<AppProps> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true)
  const { setUserDataFromToken, user } = useUserAuth()

  useEffect(() => {
    const onLoad = async () => {
      await setUserDataFromToken()
      setLoading(false)
    }
    onLoad()
  }, [])
  return <>{loading ? <></> : <>{children}</>}</>
}

export default App
