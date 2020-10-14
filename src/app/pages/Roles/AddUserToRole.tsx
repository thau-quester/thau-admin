import Loader from 'app/components/Loader'
import { useRole, useAddRoleToUser } from 'app/hooks/useRoles'
import * as React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Button, Code, Fieldset, Input, Text } from '@geist-ui/react'

export default () => {
  const history = useHistory()
  const { roleId } = useParams<{ roleId?: string }>()
  const { loading, error, role } = useRole(Number(roleId))
  const [email, setEmail] = React.useState('')
  const {
    loading: loadingSubmission,
    error: errorSubmission,
    callsCounter,
    addRoleToUser,
  } = useAddRoleToUser(Number(roleId))

  React.useEffect(() => {
    if (callsCounter === 1) {
      history.goBack()
    }
  })
  if (loading) {
    return <Loader />
  }

  if (error) {
    return <Text type="error">{JSON.stringify(error)}</Text>
  }

  return (
    <Fieldset>
      <Fieldset.Title>
        <Code>{role?.name}</Code>
      </Fieldset.Title>
      <Fieldset.Subtitle>{role?.description}</Fieldset.Subtitle>

      <Text>
        Please provide the email of the user you'd like to assign this role to:
      </Text>

      <Fieldset.Footer>
        <Input
          type="email"
          status={errorSubmission ? "error" : "secondary"}
          placeholder="Email"
          onChange={({ target: { value } }) => setEmail(value)}
        />
        {errorSubmission && <Text type={error}>{errorSubmission.message}</Text>}
        <Fieldset.Footer.Actions>
          <Button
            auto
            size="small"
            disabled={!email}
            loading={loadingSubmission}
            onClick={() => addRoleToUser(email)}
          >
            Add
          </Button>
        </Fieldset.Footer.Actions>
      </Fieldset.Footer>
    </Fieldset>
  )
}
