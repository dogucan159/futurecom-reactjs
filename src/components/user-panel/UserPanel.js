import React, { useRef, useCallback } from "react"
import DropDownButton from "devextreme-react/drop-down-button"
import { Template } from "devextreme-react/core/template"
import { UserMenuSection } from "../user-menu-section/UserMenuSection"
import "./UserPanel.scss"
import { useAuth } from "../../contexts/auth"

export const UserPanel = ({ menuMode }) => {
  const { user } = useAuth()
  const listRef = useRef(null)

  const dropDownButtonAttributes = {
    class: "user-button"
  }

  const buttonDropDownOptions = {
    width: "auto"
  }

  const dropDownButtonContentReady = useCallback(
    ({ component }) => {
      component.registerKeyHandler("downArrow", () => {
        listRef.current?.instance.focus()
      })
    },
    [listRef]
  )

  return (
    <div className="user-panel">
      {menuMode === "context" && (
        <DropDownButton
          stylingMode="text"
          icon={'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/employees/05.png'}
          showArrowIcon={false}
          elementAttr={dropDownButtonAttributes}
          dropDownOptions={buttonDropDownOptions}
          dropDownContentTemplate="dropDownTemplate"
          onContentReady={dropDownButtonContentReady}
        >
          <Template name="dropDownTemplate">
            <UserMenuSection listRef={listRef} />
          </Template>
        </DropDownButton>
      )}
      {menuMode === "list" && <UserMenuSection showAvatar />}
    </div>
  )
}
