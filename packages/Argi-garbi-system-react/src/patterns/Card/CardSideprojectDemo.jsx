import React from 'react'
import '../../styles/tokens-primitives-v1.1.css'
import '../../styles/tokens-v1.1.css'
import '../../styles/card-sideproject.css'
import '../../styles/system-style.css'
import Badge from '../../components/Badge/Badge.jsx'

// Card Sideproject Demo component showcasing all variants
const CardSideprojectDemo = () => (
  <div className="system-container"> 
    <div className="system-container-base">
      <h2>Card Sideproject Component</h2>
      <div className="system-container-variants">
        {/* CARD SIDEPROJECT COMPONENT VARIANT 1 */}
        <button className="card-sideproject">
          <div className="card-sideproject-body">
            <div className="card-sideproject-header">
              <h1>Title Card</h1>
              <Badge variant="dark" size="m">Badge</Badge>
            </div>
            <div className="card-sideproject-content">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            </div>
          </div>
          <div className="card-sideproject-footer">
            <div className="card-sideproject-badge">
              <Badge variant="neutral" size="m">TAG 1</Badge>
              <Badge variant="neutral" size="m">TAG 2</Badge>
              <Badge variant="neutral" size="m">TAG 3</Badge>
            </div>
          </div>
        </button>
        
        {/* CARD SIDEPROJECT COMPONENT VARIANT 2 */}
        <button className="card-sideproject">
          <div className="card-sideproject-body">
            <div className="card-sideproject-header">
              <h1>Title Card</h1>
            </div>
            <div className="card-sideproject-content">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            </div>
          </div>
          <div className="card-sideproject-footer">
            <div className="card-sideproject-badge">
              <Badge variant="neutral" size="m">TAG 1</Badge>
              <Badge variant="neutral" size="m">TAG 2</Badge>
              <Badge variant="neutral" size="m">TAG 3</Badge>
            </div>
          </div>
        </button>
      </div>
      
      <div className="system-container-variants">
        {/* DISABLED VARIANTS */}
        <button className="card-sideproject" disabled aria-disabled="true">
          <div className="card-sideproject-body">
            <div className="card-sideproject-header">
              <h1>Title Card</h1>
              <Badge variant="dark" size="m">Badge</Badge>
            </div>
            <div className="card-sideproject-content">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            </div>
          </div>
          <div className="card-sideproject-footer">
            <div className="card-sideproject-badge">
              <Badge variant="neutral" size="m">TAG 1</Badge>
              <Badge variant="neutral" size="m">TAG 2</Badge>
              <Badge variant="neutral" size="m">TAG 3</Badge>
            </div>
          </div>
        </button>
        
        <button className="card-sideproject" disabled aria-disabled="true">
          <div className="card-sideproject-body">
            <div className="card-sideproject-header">
              <h1>Title Card</h1>
            </div>
            <div className="card-sideproject-content">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            </div>
          </div>
          <div className="card-sideproject-footer">
            <div className="card-sideproject-badge">
              <Badge variant="neutral" size="m">TAG 1</Badge>
              <Badge variant="neutral" size="m">TAG 2</Badge>
              <Badge variant="neutral" size="m">TAG 3</Badge>
            </div>
          </div>
        </button>
      </div>
    </div>
  </div>
)

export default CardSideprojectDemo
