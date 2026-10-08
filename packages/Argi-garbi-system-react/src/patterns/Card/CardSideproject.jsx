import React from 'react'
import '../../styles/tokens-v1.1.css'
import './card-sideproject.css'
import Badge from '../../components/Badge/Badge.jsx'

const CardSideproject = ({ 
  variant = "withBadge", 
  title = "Title Card", 
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  tags = ["TAG 1", "TAG 2", "TAG 3"],
  badge = "COMING SOON",
  disabled = false 
}) => {
  return (
    <button 
      className="card-sideproject" 
      disabled={disabled}
    >
      <div className="card-sideproject-body">
        <div className="card-sideproject-header">
          <h1>{title}</h1>
          {variant === "withBadge" && (
            <Badge variant="dark" size="m">{badge}</Badge>
          )}
        </div>
        <div className="card-sideproject-content">
          <p>{description}</p>
        </div>
      </div>
      <div className="card-sideproject-footer">
        <div className="card-sideproject-badge">
          {tags.map((tag, index) => (
            <Badge key={index} variant="neutral" size="m">{tag}</Badge>
          ))}
        </div>
      </div>
    </button>
  )
}

export default CardSideproject
