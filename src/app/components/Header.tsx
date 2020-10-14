import * as React from 'react'
import { Page, Image, Text, Row, Spacer, Link, Tabs } from '@geist-ui/react'
import Logo from 'img/logo-image.png'
import { useSession } from 'thau-react'
import { useHistory, useLocation } from 'react-router-dom'

export default () => {
  const history = useHistory()
  const location = useLocation()
  const pathSplitted = location.pathname.split('/')

  const [openTab, setOpenTab] = React.useState(pathSplitted[1])
  const { session } = useSession()

  React.useEffect(() => {
    if (pathSplitted.length === 1) {
      switch (openTab) {
        case 'roles': {
          return history.push('/roles')
        }
        case 'users': {
          return history.push('/users')
        }
        default: {
        }
      }
    }
  }, [history, pathSplitted])

  const rolesArePermitted =
    session &&
    session.hasOneRoleOf('THAU_ADMIN', 'THAU_ROLES_WRITE', 'THAU_ROLES_READ')

  const usersArePermitted =
    session && session.hasOneRoleOf('THAU_ADMIN', 'THAU_USERS_READ')

  const navigateToTab = (tab: string) => {
    setOpenTab(tab)
    switch (tab) {
      case 'roles': {
        if (rolesArePermitted) {
          return history.push('/roles')
        }
      }
      case 'users': {
        if (usersArePermitted) {
          return history.push('/users')
        }
      }
    }
  }
  return (
    <Page.Header>
      <Spacer />
      <Link href="/">
        <Row align="bottom">
          <Image src={Logo} width={48} height={48} />
          <Spacer />
          <Text h3>Thau Admin</Text>
        </Row>
      </Link>
      {session && (
        <Tabs value={openTab} onChange={navigateToTab}>
          <Tabs.Item
            label="Roles"
            value="roles"
            disabled={!rolesArePermitted}
          />
          <Tabs.Item
            label="Users"
            value="users"
            disabled={!usersArePermitted}
          />
        </Tabs>
      )}
    </Page.Header>
  )
}
