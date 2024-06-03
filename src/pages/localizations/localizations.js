import {
  Column,
  DataGrid,
  Editing,
  FilterRow,
  HeaderFilter,
  LoadPanel,
  Lookup,
  Pager,
  Paging,
  ValidationRule,
} from "devextreme-react/data-grid";
import DataSource from "devextreme/data/data_source";
import { useEffect, useState } from "react";
import { getToken } from "../../utils/auth";
import {
  create as createLocalization,
  getAll as getLocalizations,
  remove as removeLocalization,
  update as updateLocalization,
} from "../../api/localization";
import { getAll as getLanguages } from "../../api/language";
import notify from "devextreme/ui/notify";

export const LocalizationsPage = () => {
  const [gridDataSource, setGridDataSource] = useState();
  const [languages, setLanguages] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      const languageResult = await getLanguages(token.access_token);
      return {
        languageResult,
      };
    };
    fetchData()
      .then((resp) => {
        setLanguages(resp.languageResult.data);
        setGridDataSource(
          new DataSource({
            key: "baseEntityId",
            load: async () => {
              const token = getToken();
              const localizationResult = await getLocalizations(
                token.access_token
              );
              return localizationResult.data;
            },
            insert: async (values) => {
              const postedJsonData = {
                ...values,
                baseEntityCreatedDate: new Date(),
              };
              const data = JSON.stringify(postedJsonData);
              const token = getToken();
              const result = await createLocalization(data, token.access_token);
              if (!result.isOk) {
                notify(result.message, "error", 3000);
              }
            },
            update: async (key, values) => {
              const data = JSON.stringify(values);
              const token = getToken();
              const result = await updateLocalization(
                key,
                data,
                token.access_token
              );
              if (!result.isOk) {
                notify(result.message, "error", 3000);
              }
            },
            remove: async (key) => {
              const token = getToken();
              const result = await removeLocalization(key, token.access_token);
              if (!result.isOk) {
                notify(result.message, "error", 3000);
              }
            },
          })
        );
      })
      .catch((error) => {
        notify(error.message, "error", 2000);
      });
  }, []);

  const onRowUpdating = (options) => {
    options.newData = { ...options.oldData, ...options.newData };
  };

  return (
    <>
      <DataGrid
        id="grid-container"
        focusedRowEnabled
        dataSource={gridDataSource}
        keyExpr="baseEntityId"
        onRowUpdating={onRowUpdating}
        showBorders
      >
        {/* <Scrolling rowRenderingMode="virtual" /> */}
        <FilterRow visible />
        <HeaderFilter visible />
        <LoadPanel enabled />
        <Paging enabled pageSize={10} />
        <Pager visible showInfo={true} />
        <Editing mode="row" allowUpdating allowDeleting allowAdding />

        <Column
          width={200}
          dataField="localizationLanguageId"
          caption="Language"
        >
          <ValidationRule type="required" />
          <Lookup
            dataSource={languages}
            displayExpr="languageCode"
            valueExpr="baseEntityId"
          />
        </Column>
        <Column dataField="localizationKey" caption="Expression">
          <ValidationRule type="required" />
        </Column>
        <Column dataField="localizationValue" caption="Translation">
          <ValidationRule type="required" />
        </Column>
        {/* <Column
          dataField="baseEntityCreatedDate"
          visible={true}
          caption="Created Date"
          dataType="datetime"
        ></Column> */}
      </DataGrid>
    </>
  );
};
