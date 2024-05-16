import "./config-groups.scss";
import DataSource from "devextreme/data/data_source";
import { useEffect, useState } from "react";
import {
  create as createConfigGroup,
  getAll as getConfigGroups,
  remove as removeConfigGroup,
  update as updateConfigGroup,
} from "../../api/configGroup";
import DataGrid, {
  Sorting,
  HeaderFilter,
  Scrolling,
  Column,
  Toolbar,
  Item,
  Paging,
  Editing,
  ValidationRule,
  FilterRow,
} from "devextreme-react/data-grid";
import { getToken } from "../../utils/auth";
import notify from "devextreme/ui/notify";

export const ConfigGroupsPage = () => {
  const [gridDataSource, setGridDataSource] = useState();

  useEffect(() => {
    setGridDataSource(
      new DataSource({
        key: "baseEntityId",
        load: async () => {
          const token = getToken();
          const result = await getConfigGroups(token.access_token);
          return result;
        },
        insert: async (values) => {
          const data = JSON.stringify(values);
          const token = getToken();
          const result = await createConfigGroup(data, token.access_token);
          if (!result.isOk) {
            notify(result.message, "error", 3000);
          }
        },
        update: async (key, values) => {
          const data = JSON.stringify(values);
          console.log(data);
          const token = getToken();
          const result = await updateConfigGroup(key, data, token.access_token);
          if (!result.isOk) {
            notify(result.message, "error", 3000);
          }
        },
        remove: async (key) => {
          const token = getToken();
          const result = await removeConfigGroup(key, token.access_token);
          if (!result.isOk) {
            notify(result.message, "error", 3000);
          }
        },
      })
    );
  }, []);

  const onRowUpdating = (options) => {
    options.newData = { ...options.oldData, ...options.newData };
  };

  return (
    <>
      <DataGrid
        id="dataGridConfigGroups"
        dataSource={gridDataSource}
        keyExpr="baseEntityId"
        allowColumnReordering={true}
        showBorders={true}
        onRowUpdating={onRowUpdating}
        columnAutoWidth={false}
      >
        <FilterRow visible={false} />
        <Paging enabled={true} />
        <Editing
          mode="row"
          allowUpdating={true}
          allowDeleting={true}
          allowAdding={true}
        />
        <HeaderFilter visible={false} />
        <Sorting mode="multiple" />
        <Scrolling mode="virtual" />
        <Toolbar>
          <Item location="before">
            <div className="module">Config Groups</div>
          </Item>
          <Item name="addRowButton" showText="always" />
        </Toolbar>
        <Column dataField="configGroupCode" caption="Code" width={250}>
          <ValidationRule type="required" />
        </Column>
        <Column dataField="configGroupDescription" caption="Description" width={400}>
          <ValidationRule type="required" />
        </Column>
      </DataGrid>
    </>
  );
};
