import {
  ButtonItem,
  EmailRule,
  Form,
  GroupItem,
  Item,
  Label,
  RequiredRule,
} from "devextreme-react/form";
import "./app-setting.scss";
import { ScrollView } from "devextreme-react/scroll-view";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getToken } from "../../utils/auth";
import {
  create as createAppSetting,
  update as updateAppSetting,
  getById as getAppSettingById,
} from "../../api/appSettings";
import { withLoadPanel } from "../../utils/withLoadPanel";
import notify from "devextreme/ui/notify";

const colCountByScreen = {
  xs: 2,
  sm: 2,
  md: 2,
  lg: 2,
};

const AppSettingForm = ({ appSettingData }) => {
  const formData = useRef(appSettingData);
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
      const token = getToken();
      let result;
      if (formData.current.baseEntityId) {
        result = await updateAppSetting(
          JSON.stringify(formData.current),
          token.access_token
        );
      } else {
        result = await createAppSetting(
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
        <Form
          // ref={formRef}
          colCount={1}
          id="frmAppSetting"
          formData={formData.current}
          // onFieldDataChanged={onFormFieldChange}
        >
          <GroupItem caption="Mail Server" colCount={2}>
            <Item dataField="appSettingName" editorType="dxTextBox">
              <RequiredRule message="Name is required" />
              <Label text="Name" />
            </Item>
            <Item dataField="appSettingSMTPServerName" editorType="dxTextBox">
              <Label text="Server" />
            </Item>
            <Item
              dataField="appSettingSMTPServerFromEmail"
              editorType="dxTextBox"
            >
              <EmailRule message="Email is invalid" />
              <Label text="From" />
            </Item>
            <Item
              dataField="appSettingSMTPServerUserName"
              editorType="dxTextBox"
            >
              <Label text="Username" />
            </Item>
            <Item
              dataField="appSettingSMTPServerPassword"
              editorType="dxTextBox"
              editorOptions={{ mode: "password" }}
            >
              <Label text="Password" />
            </Item>
            <Item
              dataField="appSettingSMTPServerPort"
              editorType="dxNumberBox"
              editorOptions={{ format: "#" }}
            >
              <Label text="Port" />
            </Item>
            <Item
              dataField="appSettingSMTPServerType"
              editorType="dxSelectBox"
              editorOptions={{
                key: "code",
                dataSource: [{ code: "Network" }],
                displayExpr: "code",
                valueExpr: "code",
              }}
            >
              <Label text="Server Type" />
            </Item>
            <Item
              dataField="appSettingSMTPServerEnableSSL"
              editorType="dxSwitch"
            >
              <Label text={"Enable SSL"} />
            </Item>
            <Item dataField="appSettingIsDefault" editorType="dxCheckBox">
              <Label text={"Default"} />
            </Item>
          </GroupItem>
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
const AppSettingFormWithLoadPanel = withLoadPanel(AppSettingForm);

export const AppSettingPage = () => {
  const [appSettingData, setAppSettingData] = useState({
    baseEntityId: undefined,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { selectedAppSettingId } = useParams();
  useEffect(() => {
    if (selectedAppSettingId) {
      const fetchData = async () => {
        try {
          const token = getToken();
          const result = await getAppSettingById(
            selectedAppSettingId,
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
          setAppSettingData(resp.result);
          setIsLoading(false);
        })
        .catch((error) => {
          notify(error.message, "error", 3000);
        });
    } else {
      setIsLoading(false);
    }
  }, [selectedAppSettingId]);

  return (
    <div className="view-host app-setting">
      <div className="view-wrapper">
        <AppSettingFormWithLoadPanel
          appSettingData={appSettingData}
          hasData={!isLoading}
          loading={isLoading}
        />
      </div>
    </div>
  );
};
