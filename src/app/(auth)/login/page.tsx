'use client'
import PrimaryButton from '@/components/Buttons/PrimaryButton'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import { auth } from '@/config/Firebase'
import { useUserAuth } from '@/context/AuthContext'
import { useUtilContext } from '@/context/UtilContext'
import { TextField } from '@mui/material'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { use, useEffect, useState } from 'react'

const Page = () => {
  const [userName, setUserName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [verificationCode, setVerificationCode] = useState<string>('')
  const [isCodeSent, setIsCodeSent] = useState<boolean>(false)
  const [confirmationResult, setConfirmationResult] = useState<any>(null)
  const { setLoader } = useUtilContext()
  const { logInEmail, user, userData } = useUserAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      // if (userData?.isAdmin) {
      //   router.replace('/dashboard/sales')
      //   return
      // }
      // router.push('/')
    }
  }, [user])

  const isEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(userName)
  }

  const isPhoneNumber = () => {
    const phoneRegex = /^\d{10}$/
    return phoneRegex.test(userName)
  }

  const loginEmailHandler = async (e: any | null) => {
    e?.preventDefault()
    setLoader(true)
    try {
      if (isEmail()) {
        await logInEmail(userName, password)
        router.push('/')
      } else {
        throw new Error('Invalid Email or Phone Number')
      }
    } catch (e) {
      console.log(e)
    } finally {
      setLoader(false)
    }
  }

  const onCaptchVerify = () => {
    if (!(window as any).recaptchaVerifier) {
      ;(window as any).recaptchaVerifier = new RecaptchaVerifier(
        auth,
        'recaptcha-container',
        {
          size: 'invisible',
          callback: (response: any) => {
            sendVerificationCode(null)
          },
          'expired-callback': () => {},
        },
      )
    }
  }

  const sendVerificationCode = async (e: any | null) => {
    e?.preventDefault()
    try {
      onCaptchVerify()

      const appVerifier = (window as any).recaptchaVerifier
      const confirmation = await signInWithPhoneNumber(
        auth,
        '+91' + userName,
        appVerifier,
      )
      setConfirmationResult(confirmation)
      setIsCodeSent(true)
    } catch (e) {
      console.log(e)
    } finally {
    }
  }

  const loginPhoneNumberHandler = async (e: any | null) => {
    e?.preventDefault()
    setLoader(true)
    try {
      if (isPhoneNumber()) {
        await confirmationResult.confirm(verificationCode)
        router.push('/')
      } else {
        throw new Error('Invalid Email or Phone Number')
      }
    } catch (e) {
      console.log(e)
    } finally {
      setLoader(false)
    }
  }

  return (
    <div>
      <Navbar />
      <div className="mt-5 flex flex-col items-center gap-3">
        <div id="recaptcha-container"></div>
        <h3 className="text-4xl">Login</h3>
        {/* <span className="rounded-full border-[0.02rem] p-1">
          <FcGoogle className="h-7 w-7" />
        </span>
        <span>OR</span> */}
        <form className="flex w-[90vw] max-w-[22rem] flex-col gap-3">
          <div className="relative flex flex-col">
            <TextField
              name="email"
              type="email"
              label={
                isEmail()
                  ? 'Email'
                  : isPhoneNumber()
                    ? 'Phone Number'
                    : 'Email / Phone Number'
              }
              disabled={isPhoneNumber() && isCodeSent}
              className="rounded-md border-[0.02rem] border-gray-400 p-1 py-2 focus:border-primary focus:text-primary focus:outline-none active:border-primary"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            {isPhoneNumber() && (
              <p
                className="absolute bottom-4 right-2 cursor-pointer text-sm text-primary"
                onClick={sendVerificationCode}
              >
                Send Code
              </p>
            )}
          </div>
          {isPhoneNumber() ? (
            <div className="flex flex-col ">
              <TextField
                name="code"
                type="text"
                label="Code"
                disabled={!isCodeSent}
                className="rounded-md border-[0.02rem] border-gray-400 p-1 py-2 focus:border-primary focus:text-primary focus:outline-none active:border-primary"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
            </div>
          ) : (
            <div className="flex flex-col ">
              <TextField
                name="password"
                type="text"
                label="Password"
                className="rounded-md border-[0.02rem] border-gray-400 p-1 py-2 focus:border-primary focus:text-primary focus:outline-none active:border-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          <PrimaryButton
            content={'Login'}
            func={isEmail() ? loginEmailHandler : loginPhoneNumberHandler}
          />
        </form>
        <Link href={'/signup'}>
          <p className="text-sm text-primary">
            New Customer? Create an account
          </p>
        </Link>
        <Link href={'/forgot-password'}>
          <p className="text-sm text-primary">Forgot Password?</p>
        </Link>
      </div>
      <Footer />
    </div>
  )
}

export default Page
