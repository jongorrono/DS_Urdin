import React from 'react'
import '../../styles/tokens-primitives-v1.1.css'
import '../../styles/tokens-v1.1.css'
import '../../styles/badge.css'
import '../../styles/system-style.css'
import Badge from './Badge.jsx'

// Badge Demo component showcasing all variants
const BadgeDemo = () => (
  <div className="system-container"> 
    <div className="system-container-base">
      <h2>Badge Component</h2>
      <div className="system-container-variants">
        <Badge variant="brand" size="m">Brand</Badge>
        <Badge variant="brand" size="l">Brand</Badge>
      </div>
      <div className="system-container-variants">
        <Badge variant="neutral" size="m">Neutral</Badge>
        <Badge variant="neutral" size="l">Neutral</Badge>
      </div>
      <div className="system-container-variants">
        <Badge variant="success" size="m">Success</Badge>
        <Badge variant="success" size="l">Success</Badge>
      </div>
      <div className="system-container-variants">
        <Badge variant="warning" size="m">Warning</Badge>
        <Badge variant="warning" size="l">Warning</Badge>
      </div>
      <div className="system-container-variants">
        <Badge variant="dark" size="m">Dark</Badge>
        <Badge variant="dark" size="l">Dark</Badge>
      </div>
    </div>
  </div>
)

export default BadgeDemo
