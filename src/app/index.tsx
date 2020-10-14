import * as React from 'react'
import { CssBaseline, GeistProvider, Page } from '@geist-ui/react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { ThauProvider } from 'thau-react'
import Header from 'app/components/Header'
import ProtectedRoute from 'app/components/ProtectedRoute'
import Login from 'app/pages/Login'
import Dashboard from 'app/pages/Dashboard'
import Roles from 'app/pages/Roles'
import AddUserToRole from 'app/pages/Roles/AddUserToRole'

export default () => (
  <ThauProvider thauUrl="http://localhost:9000/api/v1">
    <GeistProvider>
      <CssBaseline />
      <Router>
        <Page render="effect-seo" dotBackdrop size="large">
          <Header />
          <Page.Content>
            <Switch>
              <Route path="/login" render={Login} />
              <ProtectedRoute
                path="/roles/:roleId/addUser"
                component={AddUserToRole}
              />
              <ProtectedRoute path="/roles" component={Roles} />
              <ProtectedRoute path="/" component={Dashboard} />
            </Switch>
          </Page.Content>
        </Page>
      </Router>
    </GeistProvider>
  </ThauProvider>
)
