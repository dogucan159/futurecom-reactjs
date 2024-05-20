import {
  ButtonItem,
  Form,
  GroupItem,
  Item,
  Label,
  RequiredRule,
} from "devextreme-react/form";
import "./email-content.scss";
import { ScrollView } from "devextreme-react/scroll-view";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getToken } from "../../utils/auth";
import {
  create as createEmailContent,
  update as updateEmailContent,
  getById as getEmailContentById,
} from "../../api/emailContents";
import { withLoadPanel } from "../../utils/withLoadPanel";
import { getHtmlEditorOptions } from "../../utils/html-editor";
import notify from "devextreme/ui/notify";

const colCountByScreen = {
  xs: 2,
  sm: 2,
  md: 2,
  lg: 2,
};

const EmailContentForm = ({ emailContentData }) => {
  const formData = useRef(emailContentData);
  const navigate = useNavigate();

  const backButtonOptions = {
    icon: "back",
    text: "Back",
    width: "120px",
    onClick: () => {
      navigate("/email-contents");
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
      const token = getToken();
      const result = await updateEmailContent(
        JSON.stringify(formData.current),
        token.access_token
      );
      if (result.isOk) {
        navigate("/email-contents");
      } else {
        notify(result.message, "error", 3000);
      }
    },
    [navigate]
  );

  return (
    <ScrollView className="view-wrapper-scroll">
      <form className="login-form" onSubmit={onSubmit}>
        <Form
          // ref={formRef}
          colCount={1}
          id="frmEmailContent"
          formData={formData.current}
          // onFieldDataChanged={onFormFieldChange}
        >
          <Item
            dataField="emailContentModule"
            editorType="dxSelectBox"
            editorOptions={{
              key: "code",
              dataSource: [
                { code: "ResetPassword", description: "Parola Sıfırlama" },
              ],
              displayExpr: "description",
              valueExpr: "code",
            }}
          >
            <RequiredRule message="Module is required" />
            <Label text="Module" />
          </Item>
          <Item dataField="emailContentSubject" editorType="dxTextBox">
            <RequiredRule message="Subject is required" />
            <Label text="Subject" />
          </Item>

          <Item
            dataField="emailContentBody"
            editorType="dxHtmlEditor"
            editorOptions={getHtmlEditorOptions(500)}
          >
            <RequiredRule message="Body is required" />
            <Label text="Body" />
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
const EmailContentFormWithLoadPanel = withLoadPanel(EmailContentForm);

export const EmailContentPage = () => {
  const [emailContentData, setEmailContentData] = useState({
    baseEntityId: undefined,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { selectedEmailContentId } = useParams();
  useEffect(() => {
    if (selectedEmailContentId) {
      const fetchData = async () => {
        try {
          const token = getToken();
          const result = await getEmailContentById(
            selectedEmailContentId,
            token.access_token
          );
          return {
            result,
          };
        } catch (error) {
          throw new Error(error.message);
        }
      };

      fetchData()
        .then((resp) => {
          setEmailContentData(resp.result);
          setIsLoading(false);
        })
        .catch((error) => {
          notify(error.message, "error", 3000);
        });
    } else {
      setIsLoading(false);
    }
  }, [selectedEmailContentId]);

  return (
    <div className="view-host email-content">
      <div className="view-wrapper">
        <EmailContentFormWithLoadPanel
          emailContentData={emailContentData}
          hasData={!isLoading}
          loading={isLoading}
        />
      </div>
    </div>
  );
};
