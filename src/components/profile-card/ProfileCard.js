import { useRef } from "react";
import { useScreenSize, getSizeQualifier } from "../../utils/media-query";
import Form, {
  Item,
  Label,
  ValidationRule as ValidationRuleComponent
} from "devextreme-react/form";


export const ProfileCard = ({
  items = [],
  colCount = 2,
  title = "",
  cardData,
  onDataChanged,
  children,
  wrapperCssClass,
}) => {
  const { isXSmall } = useScreenSize();
  const formRef = useRef(null);

  const onFieldChange = (fieldName) => (value) => {
    const isValid = formRef.current?.instance.validate().isValid;

    if (!isValid) {
      return;
    }

    if (fieldName) {
      cardData[fieldName] = value;
    }

    onDataChanged(cardData);
  };

  const onFormFieldChange = (e) => onFieldChange(e.dataField)(e.value);

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
                  ...item.editorOptions,
                }}
                colSpan={item.colSpan}
              >
                {item.label && <Label text={item.label} />}
                {item.validators?.map((rule, index) => (
                  <ValidationRuleComponent key={index} type={rule.type} />
                ))}
              </Item>
            ))}
          </Form>
        </div>
      </div>
    </div>
  );
};
