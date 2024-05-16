import {
  EmailRule,
  Form,
  GroupItem,
  Label,
  SimpleItem,
} from "devextreme-react/form";
import "./configs.scss";
import { useEffect, useRef, useState } from "react";
import { getToken } from "../../utils/auth";
import notify from "devextreme/ui/notify";
import {
  getAll as getAllConfigs,
  update as updateConfig,
} from "../../api/config";
import { ScrollView } from "devextreme-react";

export const ConfigsPage = () => {
  const [configData, setConfigData] = useState();
  const formRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        const result = await getAllConfigs(token.access_token);
        return {
          result,
        };
      } catch (error) {
        throw new Error(error.message);
      }
    };

    fetchData()
      .then((resp) => {
        let model = {};
        if (resp.result) {
          for (let index = 0; index < resp.result.length; index++) {
            let val = resp.result[index].configValue;
            if (
              resp.result[index].configKey === "SMTPServerEnableSsl" ||
              resp.result[index].configKey === "IsActionPlanTest"
            ) {
              val = val === "true" ? true : false;
            }
            model = {
              ...model,
              [resp.result[index].configKey]: val,
            };
          }
        }
        setConfigData(model);
      })
      .catch((error) => {
        notify(error.message, "error", 3000);
      });
  }, []);

  const onFieldChange = (fieldName) => async (value) => {
    const isValid = formRef.current?.instance.validate().isValid;

    if (!isValid) {
      return;
    }

    const data = JSON.stringify({
      configKey: fieldName,
      configValue: value,
    });
    var token = getToken();
    const result = await updateConfig(data, token.access_token);
    if (!result.isOk) {
      notify(result.message, "error", 3000);
    }
  };

  const onFormFieldChange = (e) => onFieldChange(e.dataField)(e.value);

  return (
    <ScrollView>
      <div className="long-title">
        <h3>Config settings</h3>
      </div>
      <div className="form-container">
        <Form
          ref={formRef}
          colCount={1}
          id="frmConfig"
          formData={configData}
          onFieldDataChanged={onFormFieldChange}
        >
          <GroupItem caption="Email" colCount={2}>
            <SimpleItem
              dataField="SMTPServer"
              editorType="dxTextBox"
              editorOptions={{
                valueChangeEvent: "change",
              }}
            >
              <Label text="Server" />
            </SimpleItem>
            <SimpleItem dataField="SMTPServerFromEmail" editorType="dxTextBox">
              <EmailRule message="Email is invalid" />
              <Label text="From" />
            </SimpleItem>
            <SimpleItem dataField="SMTPServerUserName" editorType="dxTextBox">
              <Label text="Username" />
            </SimpleItem>
            <SimpleItem
              dataField="SMTPServerPassword"
              editorType="dxTextBox"
              editorOptions={{ mode: "password" }}
            >
              <Label text="Password" />
            </SimpleItem>
            <SimpleItem
              dataField="SMTPServerPort"
              editorType="dxNumberBox"
              editorOptions={{ format: "#" }}
            >
              <Label text="Port" />
            </SimpleItem>
            <SimpleItem
              dataField="SMTPServerType"
              editorType="dxSelectBox"
              editorOptions={{
                key: "code",
                dataSource: [{ code: "Network" }],
                displayExpr: "code",
                valueExpr: "code",
              }}
            >
              <Label text="Server Type" />
            </SimpleItem>
            <SimpleItem dataField="SMTPServerEnableSsl" editorType="dxSwitch">
              <Label text={"Enable SSL"} />
            </SimpleItem>
          </GroupItem>
          <GroupItem caption="Aksiyon" colCount={2}>
            <SimpleItem
              dataField="AuditFindingMonitoringPoolColumnsForAuditee"
              editorType="dxTextArea"
            >
              <Label text="Denetlenenler için aksiyon havuzu kolon sırası" />
            </SimpleItem>
            <SimpleItem
              dataField="AuditFindingMonitoringPoolColumnsForAuditor"
              editorType="dxTextArea"
            >
              <Label text="Denetçiler için aksiyon havuzu kolon sırası" />
            </SimpleItem>
            <SimpleItem
              dataField="ActionOwnerType"
              editorType="dxSelectBox"
              editorOptions={{
                key: "code",
                dataSource: [
                  { code: "R", description: "Sadece Sorumlu" },
                  { code: "I", description: "Sadece Departman" },
                  { code: "RI", description: "Sorumlu ve Departman" },
                ],
                displayExpr: "description",
                valueExpr: "code",
              }}
            >
              <Label text="Aksiyon Sahibi Türü" />
            </SimpleItem>
            <SimpleItem dataField="IsActionPlanTest" editorType="dxCheckBox">
              <Label text={"Denetlenen gibi giriş yap"} />
            </SimpleItem>
          </GroupItem>
        </Form>
      </div>
    </ScrollView>
  );
};
