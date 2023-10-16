'use client'

import Avatar from '@/app/components/Avatar'
import AvatarGroup from '@/app/components/AvatarGroup'
import useOtherUser from '@/app/hooks/useOtherUser'
import { FullConversationType } from '@/app/types'
import clsx from 'clsx'
import { format } from 'date-fns'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FC, useCallback, useMemo } from 'react'

interface ConversationBoxProps {
  data: FullConversationType
  selected?: boolean
}

const ConversationBox: FC<ConversationBoxProps> = ({ data, selected }) => {
  const otherUser = useOtherUser(data)
  const session = useSession()
  const router = useRouter()

  const handleClick = useCallback(() => {
    router.push(`/conversations/${data.id}`)
  }, [data.id, router])

  const lastMessage = useMemo(() => {
    const messages = data.messages || []

    return messages[messages.length - 1]
  }, [data.messages])

  const userEmail = useMemo(() => {
    return session.data?.user?.email
  }, [session.data?.user?.email])

  const hashSeen = useMemo(() => {
    if (!lastMessage) {
      return false
    }

    const seenArr = lastMessage.seen || []

    if (!userEmail) {
      return false
    }

    return seenArr.filter((user) => user.email === userEmail).length !== 0
  }, [lastMessage, userEmail])

  const lastMessageTest = useMemo(() => {
    if (lastMessage?.image) {
      return 'Sent an image'
    }
    if (lastMessage?.body) {
      return lastMessage.body
    }

    return 'Start a conversation'
  }, [lastMessage])

  return (
    <div
      onClick={handleClick}
      className={clsx(
        'p-3 w-full relative flex items-center space-x-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer',
        selected ? 'bg-neutral-100' : 'bg-100'
      )}
    >
      {data?.isGroup ? (
        <AvatarGroup users={data.users} />
      ) : (
        <Avatar user={otherUser} />
      )}
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="flex justify-between items-center mb-1">
            <p className="text-md font-medium text-gray-900">
              {data.name || otherUser.name}
            </p>
            {lastMessage?.createdAt && (
              <p
                className="
               text-xs
               text-gray-400
               font-light
              "
              >
                {format(new Date(lastMessage.createdAt), 'p')}
              </p>
            )}
          </div>
          <p
            className={clsx(
              'truncate text-sm',
              hashSeen ? 'text-gray-500' : 'text-black font-medium'
            )}
          >
            {lastMessageTest}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ConversationBox
