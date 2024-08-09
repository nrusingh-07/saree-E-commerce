'use client'
import PrimaryButton from '@/components/Buttons/PrimaryButton'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import { auth } from '@/config/Firebase'
import { useUserAuth } from '@/context/AuthContext'
import { useUtilContext } from '@/context/UtilContext'
import { TextField } from '@mui/material'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import {
  EmailAuthProvider,
  RecaptchaVerifier,
  linkWithCredential,
  signInWithPhoneNumber,
  updateProfile,
} from 'firebase/auth'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
// import { FcGoogle } from 'react-icons/fc'

const Page = () => {
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [verificationCode, setVerificationCode] = useState<string>('')
  const [confirmationResult, setConfirmationResult] = useState<any>(null)
  const [isCodeSent, setIsCodeSent] = useState<boolean>(false)
  const { setLoader } = useUtilContext()
  const AuthCtx = useUserAuth()
  const router = useRouter()

  const onCaptchVerify = () => {
    if (!(window as any).recaptchaVerifier) {
      ;(window as any).recaptchaVerifier = new RecaptchaVerifier(
        auth,
        'recaptcha-container',
        {
          size: 'invisible',
          callback: (response: any) => {
            signUp(null)
          },
          'expired-callback': () => {},
        },
      )
    }
  }

  const validate = () => {
    return (
      firstName.length > 0 &&
      lastName.length > 0 &&
      email.length > 0 &&
      email.includes('@') &&
      phoneNumber.length === 10 &&
      password.length >= 6
    )
  }

  const signUp = async (e: any | null) => {
    e?.preventDefault()
    if (!validate()) return
    setLoader(true)
    try {
      onCaptchVerify()

      const appVerifier = (window as any).recaptchaVerifier
      // await AuthCtx.signUp(firstName, lastName, email, phoneNumber, password)
      const confirmation = await signInWithPhoneNumber(
        auth,
        '+91' + phoneNumber,
        appVerifier,
      )
      setConfirmationResult(confirmation)
      setIsCodeSent(true)
    } catch (e) {
      console.log(e)
    } finally {
      setLoader(false)
    }
  }

  const signUpVerify = async (e: any) => {
    e.preventDefault()
    if (verificationCode.length < 6) return
    setLoader(true)
    try {
      await confirmationResult.confirm(parseInt(verificationCode))
      let user = auth.currentUser
      const credential = EmailAuthProvider.credential(email, password)
      await linkWithCredential(user!, credential)
      user = auth.currentUser
      updateProfile(user!, {
        displayName: firstName + ' ' + lastName,
      })
      await AuthCtx.signUp(firstName, lastName)
      router.push('/')
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
        <h3 className="text-4xl">Sign Up</h3>
        {/* <span className="rounded-full border-[0.02rem] p-1">
          <FcGoogle className="h-7 w-7" />
        </span>
        <span>OR</span> */}
        <form className="flex w-[90vw] max-w-[22rem] flex-col gap-3">
          <div className="flex flex-col ">
            <TextField
              name="firstname"
              type="text"
              label="First Name"
              error={firstName.length === 0}
              className="rounded-md border-[0.02rem] border-gray-400 p-1 py-2 focus:border-primary focus:text-primary focus:outline-none active:border-primary"
              value={firstName}
              disabled={isCodeSent}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="flex flex-col ">
            <TextField
              name="lastname"
              type="text"
              label="Last Name"
              error={lastName.length === 0}
              className="rounded-md border-[0.02rem] border-gray-400 p-1 py-2 focus:border-primary focus:text-primary focus:outline-none  active:border-primary"
              value={lastName}
              disabled={isCodeSent}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="flex flex-col ">
            <TextField
              name="email"
              type="email"
              label="Email"
              error={!email.includes('@')}
              className="rounded-md border-[0.02rem] border-gray-400 p-1 py-2 focus:border-primary focus:text-primary focus:outline-none active:border-primary"
              value={email}
              disabled={isCodeSent}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative flex flex-col">
            <TextField
              name="phoneNumber"
              type="number"
              label="Phone Number"
              error={phoneNumber.length !== 10}
              className="rounded-md border-[0.02rem] border-gray-400 p-1 py-2 pl-8 focus:border-primary focus:text-primary focus:outline-none active:border-primary"
              value={phoneNumber}
              disabled={isCodeSent}
              onChange={(e) => {
                if (e.target.value.length <= 10) setPhoneNumber(e.target.value)
              }}
            />
            {/* <PhoneInput
              placeholder="Enter phone number"
              // value={phoneNumber}
              onChange={(e) => {
                console.log(e)
              }}
              defaultCountry="IN"
              className="absolute left-0 top-0 z-10 h-20 w-0 bg-transparent focus:outline-none active:border-primary"
            /> */}
          </div>
          <div className="flex flex-col ">
            <TextField
              name="password"
              type="password"
              label="Password"
              error={password.length < 6}
              className="rounded-md border-[0.02rem] border-gray-400 p-1 py-2 focus:border-primary focus:text-primary focus:outline-none active:border-primary"
              value={password}
              disabled={isCodeSent}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {isCodeSent && (
            <div className="flex flex-col ">
              <TextField
                name="code"
                type="text"
                label="Code"
                className="rounded-md border-[0.02rem] border-gray-400 p-1 py-2 focus:border-primary focus:text-primary focus:outline-none active:border-primary"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
            </div>
          )}
          <PrimaryButton
            content={isCodeSent ? 'Verify Code' : 'Send Code'}
            func={isCodeSent ? signUpVerify : signUp}
          />
        </form>
        <Link href={'/login'}>
          <p className="text-sm text-primary">Have an Account? Sign in</p>
        </Link>
      </div>
      <Footer />
    </div>
  )
}

export default Page
