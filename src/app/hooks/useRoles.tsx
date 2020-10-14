import * as React from 'react'
import { ThauError } from 'thau-js'
import { useThau } from 'thau-react'

const THAU_HOST = process.env.REACT_APP_THAU_HOST || ''

export type User = any
export type Role = {
  createdAt: string
  creator?: User
  description: string
  id: number
  name: string
  updatedAt: string
  usersCount: number
}
export const useRoles = () => {
  const { client } = useThau()
  const [loading, setLoading] = React.useState(true)
  const [roles, setRoles] = React.useState<Role[]>([])
  const [error, setError] = React.useState<any>()

  React.useEffect(() => {
    client
      ?.authFetch(`${THAU_HOST}/api/v1/roles`)
      .then((response) => response.json())
      .then((body) => {
        setRoles(body)
        setLoading(false)
      })
      .catch((err: any) => {
        setError(err)
        setLoading(false)
      })
  }, [client])

  return { loading, error, roles }
}

export const useUsersCountPerRole = (role: Role) => {
  return { loading: false, count: role.usersCount }
}

export const useRole = (roleId: number) => {
  const { client } = useThau()
  const [loading, setLoading] = React.useState(true)
  const [role, setRole] = React.useState<Role>()
  const [error, setError] = React.useState<ThauError>()

  React.useEffect(() => {
    client
      ?.authFetch(`${THAU_HOST}/api/v1/roles/${roleId}`)
      .then((response) => response.json())
      .then((body) => {
        setLoading(false)
        setRole(body)
      })
      .catch((err: ThauError) => {
        setLoading(false)
        setError(err)
      })
  }, [client, roleId])

  return { loading, error, role }
}

export const useAddRoleToUser = (roleId: number) => {
  const { client } = useThau()
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<ThauError>()
  const [callsCounter, setCallsCounter] = React.useState(0)

  const addRoleToUser = (email: string) => {
    setLoading(true)
    setError(undefined)
    client
      ?.authFetch(`${THAU_HOST}/api/v1/roles/${roleId}/users`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      .then(() => {
        setLoading(false)
        setCallsCounter((c) => c + 1)
      })
      .catch((err: ThauError) => {
        setLoading(false)
        setError(err)
      })
  }
  return { loading, error, callsCounter, addRoleToUser }
}
