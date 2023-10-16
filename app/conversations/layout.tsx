import React, { FC } from 'react'
import getConversations from '../actions/getConversations'
import getUsers from '../actions/getUsers'
import Sidebar from '../components/sidebar/Sidebar'
import ConversationList from './components/ConversationList'

interface layoutProps {
  children: React.ReactNode
}

const layout: FC<layoutProps> = async ({ children }) => {
  const conversations = await getConversations()
  const users = await getUsers()

  return (
    <Sidebar>
      <div className="h-full">
        <ConversationList users={users!} initialItems={conversations} />
        {children}
      </div>
    </Sidebar>
  )
}

export default layout
