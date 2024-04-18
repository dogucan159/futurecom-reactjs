import React from "react"

import "./CardAuth.scss"

export const CardAuth = ({ title, description, children }) => {
  return (
    <div className="auth-card">
      <div className="dx-card content">
        <div className="header">
          <div className="title">{title}</div>
          <div className="description">{description}</div>
        </div>
        {children}
      </div>
    </div>
  )
}
