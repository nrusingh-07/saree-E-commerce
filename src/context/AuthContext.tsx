'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
  UserCredential,
} from 'firebase/auth'
import { auth } from '../config/Firebase'
import axios from 'axios'
import { Userdata } from '../types/user'
import { useUtilContext } from './UtilContext'

interface UserAuthContextProps {
  user: FirebaseUser | null
  userData: Userdata | null
  signUp: (firstName: string, lastName: string) => Promise<void>
  logInEmail: (email: string, password: string) => Promise<void>
  setUserDataFromToken: () => Promise<void>
  logOut: () => Promise<void>
  googleSignIn: () => Promise<UserCredential>
}

export const UserAuthContext = createContext<UserAuthContextProps>(null!)

interface UserAuthContextProviderProps {
  children: React.ReactNode
}

export const UserAuthContextProvider: React.FC<
  UserAuthContextProviderProps
> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [userData, setUserData] = useState<Userdata | null>(null)
  const { setLoader } = useUtilContext()

  const logInEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
    return
  }

  const logOut = async () => {
    await signOut(auth)
  }

  const googleSignIn = async () => {
    const googleAuthProvider = new GoogleAuthProvider()
    return await signInWithPopup(auth, googleAuthProvider)
  }

  const setUserDataFromToken = async () => {
    setLoader(true)
    try {
      const token = await auth.currentUser?.getIdToken()
      if (!token) {
        setLoader(false)
        return
      }
      const userRes = await axios.get(`/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setUserData(userRes.data.user)
    } catch (e) {
      console.log(e)
    } finally {
      setLoader(false)
    }
  }

  const signUp = async (firstName: string, lastName: string) => {
    const token = await auth.currentUser?.getIdToken()
    const userRes = await axios.post(
      `/api/auth/signup`,
      {
        firstName,
        lastName,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    setUserData(userRes.data.user)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoader(true)
      try {
        const token = await currentUser?.getIdToken()
        if (!token) return
        const userRes = await axios.get(`/api/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setUserData(userRes.data.user)
        setUser(currentUser)
      } catch (e) {
        console.log(e)
        setUser(null)
      } finally {
        setLoader(false)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <UserAuthContext.Provider
      value={{
        user,
        userData,
        signUp,
        logInEmail,
        setUserDataFromToken,
        logOut,
        googleSignIn,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  )
}

export const useUserAuth = () => {
  const context = useContext(UserAuthContext)
  if (context === undefined) {
    throw new Error('useUserAuth must be used within a UserAuthContext')
  }
  return context
}
