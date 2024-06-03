import ArrayStore from "devextreme/data/array_store";
import { getByUserLogId } from "../../api/itemLog";
import DataSource from "devextreme/data/data_source";
import { useEffect, useState } from "react";
import {
  Column,
  DataGrid,
  FilterRow,
  HeaderFilter,
  Paging,
} from "devextreme-react/data-grid";
import notify from "devextreme/ui/notify";
import { getToken } from "../../utils/auth";

const getItemLogs = async (key) => {
  const token = getToken();
  const result = await getByUserLogId(key, token.access_token);
  if (!result.isOk) {
    notify(result.message, "error", 2000);
  } else {
    return new DataSource({
      store: new ArrayStore({
        data: result.data,
        key: "baseEntityId",
      }),
    });
  }
};

const UserLogDetailTemplate = (props) => {
  const [dataSource, setDataSource] = useState();
  useEffect(() => {
    const fetchData = async () => {
      const itemLogs = await getItemLogs(props.data.key);
      return itemLogs;
    };

    fetchData()
      .then((resp) => {
        setDataSource(resp);
      })
      .catch((error) => {
        notify(error.message, "error", 2000);
      });
  }, [props.data.key]);

  return (
    <>
      <DataGrid dataSource={dataSource} showBorders columnAutoWidth>
        <FilterRow visible />
        <HeaderFilter visible={false} />
        <Paging enabled />
        <Column dataField="itemLogControlName" caption="Control Name" />
        <Column dataField="itemLog_ItemId" caption="Item Id" />
        <Column dataField="itemLogActionComment" caption="Comment" />
        <Column
          dataField="itemLogActionDate"
          caption="Action Date"
          dataType="datetime"
        />
        <Column dataField="itemLogActionType" caption="Action Type" />
      </DataGrid>
    </>
  );
};

export default UserLogDetailTemplate;
