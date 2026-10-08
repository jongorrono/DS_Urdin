import React from 'react'
import '../styles/tokens-primitives-v1.1.css'
import '../styles/tokens-v1.1.css'  
import '../styles/system-style.css'
import '../styles/badge.css'
import '../styles/card-sideproject.css'
import BadgeDemo from '../components/Badge/BadgeDemo.jsx'
import CardSideprojectDemo from '../patterns/Card/CardSideprojectDemo.jsx'

const DesignSystem = () => (
  <div className="design-system">
    <header>
      <h1>URDIN DESIGN SYSTEM</h1>
      <p>A comprehensive collection of reusable UI components</p>
    </header>
    
    <main>
      <section className="component-section">
        <BadgeDemo />
      </section>
      
      <section className="component-section">
        <CardSideprojectDemo />
      </section>
    </main>
  </div>
)
export default DesignSystem
