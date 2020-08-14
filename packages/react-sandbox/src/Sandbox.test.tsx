import React from 'react'
import ReactDOM from 'react-dom'
import Sandbox from './Sandbox'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<Sandbox />, div)
  ReactDOM.unmountComponentAtNode(div)
})
