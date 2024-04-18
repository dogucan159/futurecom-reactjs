import React from "react"

import ScrollView from "devextreme-react/scroll-view"

import "./single-card.scss"
import { CardAuth } from "../../components/card-auth/CardAuth"

export const SingleCard = ({ title, description, children }) => {
  return (
    <ScrollView
      height="100%"
      width="100%"
      className="view-wrapper-scroll single-card"
    >
      <CardAuth title={title} description={description}>
        {children}
      </CardAuth>
    </ScrollView>
  )
}
