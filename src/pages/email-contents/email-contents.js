import "./email-contents.scss";
import DataSource from "devextreme/data/data_source";
import { useEffect, useRef, useState } from "react";
import {
  getAll as getEmailContents,
  remove as removeEmailContents,
} from "../../api/emailContents";
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
import { useNavigate } from "react-router-dom";
import { DeleteButton } from "../../components/delete-button/DeleteButton";
import notify from "devextreme/ui/notify";

const cellRender = (cellData) => (
  <a href={`/#/email-content/${cellData.data.baseEntityId}`}>
    {cellData.value}
  </a>
);

export const EmailContentsPage = () => {
  const dataGridRef = useRef();
  const [gridDataSource, setGridDataSource] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    setGridDataSource(
      new DataSource({
        key: "baseEntityId",
        load: async () => {
          const token = getToken();
          const result = await getEmailContents(token.access_token);
          return result;
        },
      })
    );
  }, []);

  const deleteSelectedRows = async () => {
    const selectedRows = getSelectedRows();
    const token = getToken();
    const result = await removeEmailContents(
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
    navigate(`/email-content/new`);
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
          <FilterRow visible />
          <HeaderFilter visible />
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
            dataField="emailContentModule"
            caption="Module"
            cellRender={cellRender}
          />
          <Column dataField="emailContentSubject" caption="Subject" />
          {/* <Column
            dataField="emailContentIsNotAllAuditType"
            caption="Tüm denetim türlerinde geçerli değil"
            dataType="boolean"
            allowFiltering={false}
          ></Column> */}
        </DataGrid>
      </div>
    </>
  );
};
