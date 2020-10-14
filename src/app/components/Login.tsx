import * as React from 'react'
import {
  useModal,
  Tooltip,
  Modal,
  Row,
  ButtonGroup,
  Button,
  Grid,
  Input,
  Spacer,
  Text,
} from '@geist-ui/react'
import {
  useSession,
  useLoginWithFacebook,
  useLoginWithPassword,
  useLoginWithGoogle,
  useLoginWithGithub,
  useLoginWithTwitter,
  useLoginWithLinkedIn,
} from 'thau-react'
import { ThauError, Session, User } from 'thau-js'
import AlertCircle from '@geist-ui/react-icons/alertCircle'
import Lock from '@geist-ui/react-icons/lock'
import Eye from '@geist-ui/react-icons/eye'
import Facebook from '@geist-ui/react-icons/facebook'
import Github from '@geist-ui/react-icons/github'
import Twitter from '@geist-ui/react-icons/twitter'
import Linkedin from '@geist-ui/react-icons/linkedin'
import { Redirect } from 'react-router-dom'

export type PasswordLoginState = {
  email: string
  password: string
}
export type UserCreationState = User & {
  password: string
}

type ErrorTooltipProps = React.PropsWithChildren<{
  error?: ThauError
}>
const ErrorTooltip = ({ error, children }: ErrorTooltipProps) => {
  if (!error) {
    return <>{children}</>
  }

  return (
    <Tooltip
      visible={!error ? false : undefined}
      offset={0}
      text={`Thau API loading error: ${error.message} [${error.status}]`}
      placement="bottomEnd"
    >
      {children}
    </Tooltip>
  )
}

export type LoginState = {
  loading: boolean
  error?: ThauError
}

export type ProviderLoginFn = () => Promise<Session | undefined>
export type ProviderLoginVoid = () => void
export type LoginWithProvidersProps = {
  fbLogin: LoginState
  loginWithFacebook: ProviderLoginFn
  googleLogin: LoginState
  loginWithGoogle: ProviderLoginFn
  twitterLogin: LoginState
  loginWithTwitter: ProviderLoginVoid
  githubLogin: LoginState
  loginWithGithub: ProviderLoginVoid
  linkedinLogin: LoginState
  loginWithLinkedin: ProviderLoginVoid
}

const LoginWithProviders = ({
  fbLogin,
  loginWithFacebook,
  googleLogin,
  loginWithGoogle,
  twitterLogin,
  loginWithTwitter,
  githubLogin,
  loginWithGithub,
  linkedinLogin,
  loginWithLinkedin,
}: LoginWithProvidersProps) => (
  <>
    <Button
      loading={fbLogin.loading}
      onClick={loginWithFacebook}
      icon={<Facebook />}
      type="success"
    >
      Facebook
    </Button>
    <Spacer y={0.5} />
    <Button
      loading={googleLogin.loading}
      onClick={loginWithGoogle}
      icon={<Text>G</Text>}
      type="error"
    >
      Google
    </Button>
    <Spacer y={0.5} />
    <Button
      loading={twitterLogin.loading}
      onClick={loginWithTwitter}
      icon={<Twitter />}
      type="success"
    >
      Twitter
    </Button>
    <Spacer y={0.5} />
    <Button
      loading={githubLogin.loading}
      onClick={loginWithGithub}
      icon={<Github />}
      type="secondary"
    >
      GitHub
    </Button>
    <Spacer y={0.5} />
    <Button
      loading={linkedinLogin.loading}
      onClick={loginWithLinkedin}
      icon={<Linkedin />}
      type="success"
    >
      LinkedIn
    </Button>
  </>
)

export type PasswordLoginFormProps = {
  passwordLoginState: PasswordLoginState
  handlePasswordLoginChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  passwordLogin: LoginState
  loginWithPassword: (email: string, password: string) => void
}

const PasswordLoginForm = ({
  passwordLoginState,
  handlePasswordLoginChange,
  passwordLogin,
  loginWithPassword,
}: PasswordLoginFormProps) => (
  <>
    <Input
      onChange={handlePasswordLoginChange}
      icon={<Eye />}
      placeholder="Email"
      required
      type="email"
      name="email"
    />
    <Spacer y={0.5} />
    <Input
      onChange={handlePasswordLoginChange}
      icon={<Lock />}
      placeholder="Password"
      required
      type="password"
      name="password"
    />
    <Spacer y={0.5} />
    <Button
      size="medium"
      type="success"
      ghost
      loading={passwordLogin.loading}
      disabled={!passwordLoginState.email || !passwordLoginState.password}
      onClick={() =>
        loginWithPassword(passwordLoginState.email, passwordLoginState.password)
      }
    >
      Sign in
    </Button>
  </>
)

export default () => {
  const { loading, error, session } = useSession()
  const [fbLogin, loginWithFacebook] = useLoginWithFacebook()
  const [googleLogin, loginWithGoogle] = useLoginWithGoogle()
  const [githubLogin, loginWithGithub] = useLoginWithGithub()
  const [twitterLogin, loginWithTwitter] = useLoginWithTwitter()
  const [linkedinLogin, loginWithLinkedin] = useLoginWithLinkedIn()

  const [passwordLogin, loginWithPassword] = useLoginWithPassword()
  const [passwordLoginState, setPasswordLoginState] = React.useState<
    PasswordLoginState
  >({
    email: '',
    password: '',
  })

  const {
    visible: isSignInModalVisible,
    setVisible: setSignInModalVisible,
    bindings: signInModalBindigs,
  } = useModal()

  const handlePasswordLoginChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordLoginState(
      (state) => ({ ...state, [name]: value } as PasswordLoginState)
    )
  }

  const signInError =
    fbLogin.error ||
    googleLogin.error ||
    passwordLogin.error ||
    githubLogin.error ||
    twitterLogin.error ||
    linkedinLogin.error

  React.useEffect(() => {
    if (!loading && !signInError && session && isSignInModalVisible) {
      setSignInModalVisible(false)
    }
  }, [
    loading,
    signInError,
    session,
    isSignInModalVisible,
    setSignInModalVisible,
  ])

  if (session) {
    return <Redirect to="/" />
  }
  return (
    <>
      <Modal {...signInModalBindigs} width="35rem">
        <Modal.Title>Sign in</Modal.Title>
        <Modal.Subtitle>Using Thau API</Modal.Subtitle>
        <Modal.Content>
          <Grid.Container justify="space-between" alignItems="stretch">
            <Grid>
              <PasswordLoginForm
                passwordLogin={passwordLogin}
                loginWithPassword={loginWithPassword}
                passwordLoginState={passwordLoginState}
                handlePasswordLoginChange={handlePasswordLoginChange}
              />
              {signInError ? (
                <Text type="error">
                  Error: {signInError.message} [{signInError.status}]
                </Text>
              ) : (
                <Spacer y={2.7} />
              )}
            </Grid>
            <Grid>
              <LoginWithProviders
                fbLogin={fbLogin}
                googleLogin={googleLogin}
                githubLogin={githubLogin}
                twitterLogin={twitterLogin}
                linkedinLogin={linkedinLogin}
                loginWithFacebook={loginWithFacebook}
                loginWithGoogle={loginWithGoogle}
                loginWithGithub={loginWithGithub}
                loginWithTwitter={loginWithTwitter}
                loginWithLinkedin={loginWithLinkedin}
              />
            </Grid>
          </Grid.Container>
        </Modal.Content>
      </Modal>

      <Row align="middle" justify="end">
        {!session && (
          <ErrorTooltip error={error}>
            <ButtonGroup size="large">
              <Button
                onClick={() => setSignInModalVisible(true)}
                loading={loading}
                disabled={!!error}
                iconRight={error ? <AlertCircle color="red" /> : undefined}
              >
                Sign in
              </Button>
            </ButtonGroup>
          </ErrorTooltip>
        )}
      </Row>
    </>
  )
}
