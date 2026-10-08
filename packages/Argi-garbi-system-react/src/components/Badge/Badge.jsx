import React from 'react'
import '../../styles/tokens-v1.1.css'
import '../../styles/badge.css'
import '../../styles/system-style.css'

// Reusable Badge component
const Badge = ({ variant = "neutral", size = "m", children }) => {
  return (
    <div className={`badge badge-${size} badge-${variant}`}>
      {children}
    </div>
  )
}

export default Badge