import "./app-settings.scss";
import DataSource from "devextreme/data/data_source";
import { useEffect, useRef, useState } from "react";
import {
  getAll as getAppSettings,
  remove as removeAppSettings,
} from "../../api/appSettings";
import {
  DataGrid,
  Paging,
  Column,
  Toolbar,
  Item,
  Selection,
  FilterRow,
  HeaderFilter,
} from "devextreme-react/data-grid";

import { getToken } from "../../utils/auth";
import { Button } from "devextreme-react/button";
import { Link, useNavigate } from "react-router-dom";
import { DeleteButton } from "../../components/delete-button/DeleteButton";
import notify from "devextreme/ui/notify";

const cellRender = (cellData) => (
  <Link to={`${cellData.data.baseEntityId}`}>{cellData.value}</Link>
);

export const AppSettingsPage = () => {
  const dataGridRef = useRef();
  const [gridDataSource, setGridDataSource] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    setGridDataSource(
      new DataSource({
        key: "baseEntityId",
        load: async () => {
          const token = getToken();
          const result = await getAppSettings(token.access_token);
          return result;
        },
      })
    );
  }, []);

  const deleteSelectedRows = async () => {
    const selectedRows = getSelectedRows();
    const token = getToken();
    const result = await removeAppSettings(
      JSON.stringify(selectedRows),
      token.access_token
    );
    if (result.isOk) {
      dataGridRef.current?.instance?.refresh();
    } else {
      notify(result.message, "error", 2000);
    }
  };

  const addNewRow = () => {
    navigate(`new`);
  };

  const getSelectedRows = () =>
    dataGridRef.current?.instance?.getSelectedRowKeys();

  return (
    <>
      <div id="data-grid-demo">
        <DataGrid
          ref={dataGridRef}
          dataSource={gridDataSource}
          keyExpr="baseEntityId"
          showBorders
        >
          <FilterRow visible={false} />
          <HeaderFilter visible={false} />
          <Paging enabled={false} />

          <Toolbar>
            <Item location="after">
              <DeleteButton
                icon="trash"
                getSelectedRows={getSelectedRows}
                onClick={deleteSelectedRows}
              />
            </Item>
            <Item>
              <Button icon="add" onClick={addNewRow}></Button>
            </Item>
          </Toolbar>

          <Selection mode="multiple" selectAllMode="page" />

          <Column
            dataField="appSettingName"
            caption="Name"
            cellRender={cellRender}
          />
          <Column
            dataField="appSettingIsDefault"
            caption="Default"
            dataType="boolean"
            allowFiltering={false}
          ></Column>
        </DataGrid>
      </div>
    </>
  );
};
