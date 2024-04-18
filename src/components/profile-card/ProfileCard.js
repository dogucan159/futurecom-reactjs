import "./ProfileCard.scss"
import React, { useRef } from "react"
import Form, {
  Item,
  Label,
  ValidationRule as ValidationRuleComponent
} from "devextreme-react/form"
// import { StatusSelectBox } from "../status-select-box/StatusSelectBox"
// import { PicturedItemSelectBox } from "../pictured-item-select-box/PicturedItemSelectBox"
import { useScreenSize, getSizeQualifier } from "../../utils/media-query"

export const ProfileCard = ({
  items = [],
  colCount = 2,
  title = "",
  cardData,
  onDataChanged,
  children,
  wrapperCssClass
}) => {
  const { isXSmall } = useScreenSize()
  const formRef = useRef(null)
  const onFieldChange = fieldName => value => {
    const isValid = formRef.current?.instance.validate().isValid

    if (!isValid) {
      return
    }

    if (fieldName) {
      cardData[fieldName] = value
    }

    onDataChanged(cardData)
  }
  const onFormFieldChange = e => onFieldChange(e.dataField)(e.value)

  return (
    <div className={wrapperCssClass}>
      <div className="profile-card-panel">
        <div className="title-text profile-card-panel-header">{title}</div>
        <div className="form-container">
          {children}
          <Form
            ref={formRef}
            formData={cardData}
            showColonAfterLabel
            colCount={isXSmall ? 2 : colCount}
            screenByWidth={getSizeQualifier}
            labelLocation="top"
            labelMode="outside"
            onFieldDataChanged={onFormFieldChange}
          >
            {items.map((item, index) => (
              <Item
                key={index}
                dataField={item.dataField}
                editorType={item.editorType}
                editorOptions={{
                  stylingMode: "filled",
                  valueChangeEvent: "input",
                  ...item.editorOptions
                }}
                colSpan={item.colSpan}
              >
                {item.label && <Label text={item.label} />}
                {item.validators?.map((rule, index) => (
                  <ValidationRuleComponent key={index} type={rule.type} />
                ))}
                {/* {item.dataField === "status" && (
                  <StatusSelectBox
                    labelMode="hidden"
                    stylingMode="filled"
                    value={cardData[item.dataField]}
                    onValueChange={onFieldChange(item.dataField)}
                  />
                )}
                {item.dataField === "supervisor" && (
                  <PicturedItemSelectBox
                    label={item.label}
                    value={cardData[item.dataField]}
                    items={item.itemsList}
                    onValueChange={onFieldChange(item.dataField)}
                  />
                )} */}
              </Item>
            ))}
          </Form>
        </div>
      </div>
    </div>
  )
}
