import * as React from 'react'
import styled from 'styled-components'
import { Spinner } from '@geist-ui/react'

const CenteredSpinnerWrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100px;
  height: 100px;
  margin: auto;
`

export default () => (
  <CenteredSpinnerWrapper>
    <Spinner size="large" />
  </CenteredSpinnerWrapper>
)
