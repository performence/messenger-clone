'use client'

import Button from '@/app/components/Button'
import Modal from '@/app/components/Modal'
import Input from '@/app/components/inputs/Input'
import Select from '@/app/components/inputs/Select'
import { User } from '@prisma/client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'
import { FieldValues, SubmitErrorHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

interface GroupChatModalProps {
  isOpen?: boolean
  onClose: () => void
  users: User[]
}

const GroupChatModal: FC<GroupChatModalProps> = ({
  isOpen,
  onClose,
  users,
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
      name: '',
      members: [],
    },
  })

  const members = watch('members')

  const onSubmit: SubmitErrorHandler<FieldValues> = (data) => {
    setLoading(true)

    axios
      .post('/api/conversations', {
        ...data,
        isGroup: true,
      })
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
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              创建群聊
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              创建群聊人数不少于2人
            </p>
            <div className="mt-10 flex flex-col gap-y-8">
              <Input
                register={register}
                label="Name"
                id="name"
                disabled={loading}
                required
                errors={errors}
              />
              <Select
                label="Members"
                options={users.map((user) => ({
                  value: user.id,
                  label: user.name,
                }))}
                onChange={(value) =>
                  setValue('members', value, {
                    shouldValidate: true,
                  })
                }
                value={members}
                disabled={loading}
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Button disabled={loading} onClick={onClose} type="button" secondary>
            取消
          </Button>
          <Button disabled={loading} type="submit">
            保存
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default GroupChatModal
