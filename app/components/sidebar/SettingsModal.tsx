'use client'

import { User } from '@prisma/client'
import axios from 'axios'
import { CldUploadButton } from 'next-cloudinary'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'
import { FieldValues, SubmitErrorHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Button from '../Button'
import Modal from '../Modal'
import Input from '../inputs/Input'

interface SettingsModalProps {
  isOpen?: boolean
  onClose: () => void
  currentUser: User
}

const SettingsModal: FC<SettingsModalProps> = ({
  isOpen,
  currentUser,
  onClose,
}) => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: currentUser?.name,
      image: currentUser?.image,
    },
  })

  const image = watch('image')

  const handleUpload = (res: any) => {
    console.log(res?.info?.secure_url)
    setValue('image', res?.info?.secure_url, {
      shouldValidate: true,
    })
  }

  const onSubmit: SubmitErrorHandler<FieldValues> = (data) => {
    setLoading(true)

    axios
      .post('/api/settings', data)
      .then(() => {
        router.refresh()
        toast.success('修改成功!')
        onClose()
      })
      .catch(() => toast.error('出错啦!'))
      .finally(() => setLoading(false))
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-10">
          <div className="border-gray-300 ">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              个人资料
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">编辑信息</p>
            <div className="mt-8 flex flex-col gap-y-8">
              <Input
                disabled={loading}
                label="Name"
                id="name"
                errors={errors}
                required
                register={register}
              />
              <div>
                <label className="block text-sm font-semibold leading-6 text-gray-900">
                  Photo
                </label>
                <div className=" mt-2 flex items-center gap-x-3">
                  <div className="relative w-12 h-12 ">
                    <Image
                      className="rounded-full object-cover"
                      fill
                      src={
                        image || currentUser?.image || '/images/placeholder.jpg'
                      }
                      alt="Avatar"
                    />
                  </div>
                  <CldUploadButton
                    options={{ maxFiles: 1 }}
                    onUpload={handleUpload}
                    uploadPreset="pwyyspxa"
                  >
                    <Button disabled={loading} secondary type="button">
                      Change
                    </Button>
                  </CldUploadButton>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-x-6">
            <Button disabled={loading} secondary onClick={onClose}>
              取消
            </Button>
            <Button disabled={loading} type="submit" onClick={onClose}>
              保存
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}

export default SettingsModal
