import { FC } from 'react'
import getUsers from '../actions/getUsers'
import Sidebar from '../components/sidebar/Sidebar'
import UserList from './components/UserList'

interface layoutProps {
  children: React.ReactNode
}

const layout: FC<layoutProps> = async ({ children }) => {
  const users = await getUsers()

  return (
    <Sidebar>
      <div className="h-full">
        <UserList items={users!} />
        {children}
      </div>
    </Sidebar>
  )
}

export default layout
