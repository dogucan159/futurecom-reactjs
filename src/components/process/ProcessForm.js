import { ScrollView } from "devextreme-react/scroll-view";
import { useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ProcessForm.scss";
import {
  ButtonItem,
  Form,
  GroupItem,
  Item,
  Label,
  RequiredRule,
} from "devextreme-react/form";
import { getToken } from "../../utils/auth";
import notify from "devextreme/ui/notify";
import {
  update as updateProcess,
  create as createProcess,
} from "../../api/processes";
import {
  RichEditComponent,
  richEditVal,
} from "../rich-text-editor/RichEditComponent";

const colCountByScreen = {
  xs: 2,
  sm: 2,
  md: 2,
  lg: 2,
};
const ProcessForm = ({ processData }) => {
  const richEditRef = useRef();
  const formData = useRef(processData);
  const navigate = useNavigate();

  const backButtonOptions = {
    icon: "back",
    text: "Back",
    width: "120px",
    onClick: () => {
      navigate("..");
    },
  };

  const saveButtonOptions = {
    icon: "save",
    text: "Save",
    type: "default",
    useSubmitBehavior: true,
    width: "120px",
  };

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      richEditRef.current.rich.saveDocument();
      formData.current.processCommentRichTextBase64 = richEditVal.toString();
      const token = getToken();
      console.log(formData.current);
      let result;
      if (formData.current.baseEntityId) {
        result = await updateProcess(
          JSON.stringify(formData.current),
          token.access_token
        );
      } else {
        result = await createProcess(
          JSON.stringify(formData.current),
          token.access_token
        );
      }
      if (result.isOk) {
        navigate("..");
      } else {
        notify(result.message, "error", 3000);
      }
    },
    [navigate]
  );

  return (
    <ScrollView className="view-wrapper-scroll">
      <form className="login-form" onSubmit={onSubmit}>
        <Form colCount={1} id="frmProcessForm" formData={formData.current}>
          <Item dataField="processCode" editorType="dxTextBox">
            <RequiredRule message="Code is required" />
            <Label text="Code" />
          </Item>
          <Item dataField="processDescription" editorType="dxTextBox">
            <RequiredRule message="Description is required" />
            <Label text="Description" />
          </Item>
          <Item>
            <RichEditComponent
              ref={richEditRef}
              width="100%"
              height="600px"
              documentBase64={formData.current.processCommentRichTextBase64}
            />
          </Item>
          <GroupItem
            cssClass="buttons-group"
            colCountByScreen={colCountByScreen}
          >
            <ButtonItem buttonOptions={backButtonOptions} name="Back" />
            <ButtonItem buttonOptions={saveButtonOptions} />
          </GroupItem>
        </Form>
      </form>
    </ScrollView>
  );
};

export default ProcessForm;
