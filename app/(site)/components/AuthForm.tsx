'use client'

import Button from '@/app/components/Button'
import Input from '@/app/components/inputs/Input'
import axios from 'axios'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FC, useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'

interface AuthFormProps {}

type Variant = 'LOGIN' | 'REGISTER'

const AuthForm: FC<AuthFormProps> = ({}) => {
  const session = useSession()
  const router = useRouter()
  const [variant, setVariant] = useState<Variant>('LOGIN')
  const [loading, setLoading] = useState(false)

  const toggleVariant = useCallback(() => {
    if (variant === 'LOGIN') {
      setVariant('REGISTER')
    } else {
      setVariant('LOGIN')
    }
  }, [variant])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setLoading(true)
    if (variant === 'REGISTER') {
      axios
        .post('/api/register', data)
        .then(() => signIn('credentials', data))
        .catch(() => toast.error('something went wrong!'))
        .finally(() => setLoading(false))
    }
    if (variant === 'LOGIN') {
      signIn('credentials', {
        ...data,
        redirect: false,
      })
        .then((callBack) => {
          if (callBack?.error) {
            toast.error('Invalid credentials')
          }
          if (callBack?.ok && !callBack?.error) {
            toast.success('Logged in!')
            router.push('/users')
          }
        })
        .finally(() => setLoading(false))
    }
  }

  // 国内用不了github或者google认证
  // const socialAction = (action: string) => {
  //   setLoading(true)
  //   signIn(action, {
  //     redirect: false,
  //   })
  //     .then((callBack) => {
  //       if (callBack?.error) {
  //         toast.error('Invalid credentials')
  //       }
  //       if (callBack?.ok && !callBack?.error) {
  //         toast.success('Logged in!')
  //       }
  //     })
  //     .finally(() => setLoading(false))
  // }

  useEffect(() => {
    if (session?.status === 'authenticated') {
      router.push('/users')
    }
  }, [router, session?.status])

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant === 'REGISTER' && (
            <Input label="Name" id="name" register={register} errors={errors} disabled={loading} />
          )}
          <Input label="Email address" id="email" register={register} errors={errors} disabled={loading} />
          <Input
            label="Password"
            type="password"
            id="password"
            register={register}
            errors={errors}
            disabled={loading}
          />
          <div>
            <Button disabled={loading} fullWidth type="submit">
              {variant === 'LOGIN' ? 'Sign in' : 'Register'}
            </Button>
          </div>
        </form>
        {/* <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <AuthSocialButton icon={BsGithub} onClick={() => socialAction('github')} />
            <AuthSocialButton icon={BsGoogle} onClick={() => socialAction('google')} />
          </div>
        </div> */}
        <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
          <div>{variant === 'LOGIN' ? 'New to Messenger?' : 'Already have an account'}</div>
          <div onClick={toggleVariant} className="underline cursor-pointer text-sky-500">
            {variant === 'LOGIN' ? 'Create an account' : 'Login'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthForm
