import {
  Table,
  Spinner,
  Text,
  Code,
  Input,
  ButtonGroup,
  Button,
  useMediaQuery,
  useModal,
  Modal,
} from '@geist-ui/react'
import Loader from 'app/components/Loader'
import { Role, useRoles, useUsersCountPerRole } from 'app/hooks/useRoles'
import * as React from 'react'
import MoreHorizontal from '@geist-ui/react-icons/moreHorizontal'
import UserPlus from '@geist-ui/react-icons/userPlus'
import Edit2 from '@geist-ui/react-icons/edit2'
import Trash2 from '@geist-ui/react-icons/trash2'
import { useSession } from 'thau-react'
import { useHistory } from 'react-router-dom'

const UsersCount = ({ role }: { role: Role }) => {
  const { loading, count } = useUsersCountPerRole(role)

  if (loading) {
    return <Spinner />
  }

  return <Text>{count}</Text>
}

const RoleActions = ({ role }: { role: Role }) => {
  const history = useHistory()
  const { session } = useSession()
  const isXS = useMediaQuery('xs')
  const { setVisible, bindings } = useModal()

  const canEditRole =
    session?.hasRole('THAU_ADMIN') ||
    (session?.hasOneRoleOf('THAU_ROLES_WRITE') &&
      session?.user.id === role.creator.id)
  const actionButtons = (
    <ButtonGroup
      style={{ width: '100%' }}
      vertical={isXS}
      size={isXS ? undefined : 'small'}
    >
      <Button
        disabled={!canEditRole}
        icon={<UserPlus />}
        onClick={() => history.push(`/roles/${role.id}/addUser`)}
      >
        Add user
      </Button>
      <Button disabled={!canEditRole} icon={<Edit2 />}>
        Edit
      </Button>
      <Button disabled={!canEditRole} icon={<Trash2 />}>
        Delete
      </Button>
    </ButtonGroup>
  )

  if (isXS) {
    return (
      <>
        <Button
          iconRight={<MoreHorizontal />}
          auto
          size="mini"
          onClick={() => setVisible(true)}
        />
        <Modal {...bindings}>
          <Modal.Title>
            <Code>{role.name}</Code>
          </Modal.Title>
          <Modal.Content>{actionButtons}</Modal.Content>
        </Modal>
      </>
    )
  }

  return actionButtons
}

type RenderableRole = Omit<Role, 'usersCount'> & {
  visualName: JSX.Element
  usersCount: JSX.Element
  actions: () => JSX.Element
}

const prepareForRender = (role: Role) =>
  ({
    ...role,
    visualName: <Code>{role.name}</Code>,
    usersCount: <UsersCount role={role} />,
    actions: () => <RoleActions role={role} />,
  } as RenderableRole)

const filterBySearch = (search: string) => (role: any) =>
  role.name.toUpperCase().indexOf(search.toUpperCase()) !== -1

export default () => {
  const { loading, error, roles } = useRoles()
  const [search, setSearch] = React.useState('')
  const [rolesToRender, setRolesToRender] = React.useState<RenderableRole[]>()

  const isXS = useMediaQuery('xs')

  React.useEffect(() => {
    if (roles) {
      setRolesToRender(
        roles.map(prepareForRender).filter(filterBySearch(search))
      )
    }
  }, [roles, search, setRolesToRender])

  if (loading) {
    return <Loader />
  }

  if (error) {
    return <Text type="error">{JSON.stringify(error)}</Text>
  }

  return (
    <>
      <Table data={rolesToRender}>
        <Table.Column prop="visualName" label="Name">
          <Input
            label={isXS ? undefined : 'Name'}
            placeholder="Search"
            value={search}
            onChange={({ target: { value } }) => setSearch(value)}
            clearable
          />
        </Table.Column>
        <Table.Column prop="description" label="Description" />
        <Table.Column prop="usersCount" label="Users" />
        <Table.Column prop="actions" label="" />
      </Table>
    </>
  )
}
