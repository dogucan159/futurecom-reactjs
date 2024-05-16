import "./email-contents.scss";
import DataSource from "devextreme/data/data_source";
import { useEffect, useState } from "react";
import {
  getAll as getEmailContents,
} from "../../api/emailContents";
import { DataGrid, Paging, Column } from "devextreme-react/data-grid";

import { getToken } from "../../utils/auth";

const cellRender = (cellData) => (
  <a href={`/#/email-content/${cellData.data.baseEntityId}`}>
    {cellData.value}
  </a>
);

export const EmailContentsPage = () => {
  const [gridDataSource, setGridDataSource] = useState();

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

  return (
    <>
      <div id="data-grid-demo">
        <DataGrid
          dataSource={gridDataSource}
          keyExpr="baseEntityId"
          showBorders
        >
          <Paging enabled={false} />
          <Column
            dataField="emailContentModule"
            caption="Module"
            cellRender={cellRender}
          />
          <Column dataField="emailContentSubject" caption="Subject" />
          <Column
            dataField="emailContentIsNotAllAuditType"
            caption="Tüm denetim türlerinde geçerli değil"
            dataType="boolean"
          />
        </DataGrid>
      </div>
    </>
  );
};
