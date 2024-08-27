import DataSource from "devextreme/data/data_source";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getToken } from "../../utils/auth";
import { getAll as getProcesses } from "../../api/processes";
import {
  Column,
  DataGrid,
  Item,
  Selection,
  Toolbar,
  FilterRow,
  HeaderFilter,
  Pager,
  Paging,
} from "devextreme-react/data-grid";
import { DeleteButton } from "../../components/delete-button/DeleteButton";
import { Button } from "devextreme-react/button";

const cellRender = (cellData) => (
  <Link to={`${cellData.data.baseEntityId}`}>{cellData.value}</Link>
);

const ProcessesPage = () => {
  const dataGridRef = useRef();
  const [gridDataSource, setGridDataSource] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    setGridDataSource(
      new DataSource({
        key: "baseEntityId",
        load: async () => {
          const token = getToken();
          const result = await getProcesses(token.access_token);
          return result;
        },
      })
    );
  }, []);

  const getSelectedRows = () =>
    dataGridRef.current?.instance?.getSelectedRowKeys();

  const deleteSelectedRows = () => {};

  const addNewRow = () => {
    navigate(`new`);
  };

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
          <Paging enabled pageSize={10} />
          <Pager visible showInfo={true} />
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
            dataField="processCode"
            caption="Code"
            cellRender={cellRender}
          />
          <Column dataField="processDescription" caption="Description" />
        </DataGrid>
      </div>
    </>
  );
};

export default ProcessesPage;
