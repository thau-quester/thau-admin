import * as React from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'
import { useSession } from 'thau-react'
import Loader from 'app/components/Loader'

const ProtectedRoute = (props: RouteProps) => {
  const { loading, error, session } = useSession()

  if (loading) {
    return <Loader />
  }

  if (error || !session) {
    return <Redirect to="/login" />
  }

  const RouteComponent = props.component
  // @ts-ignore
  return <RouteComponent {...props} />
}
export default (props: RouteProps) => (
  <Route path={props.path} render={() => <ProtectedRoute {...props} />} />
)
