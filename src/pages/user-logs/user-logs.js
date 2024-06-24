import {
  Column,
  DataGrid,
  Item,
  Lookup,
  MasterDetail,
  Paging,
  Toolbar,
} from "devextreme-react/data-grid";
import { useCallback, useEffect, useState } from "react";
import { getAll as getAllUsers } from "../../api/user";
import { getToken } from "../../utils/auth";
import { DateBox } from "devextreme-react/date-box";
import notify from "devextreme/ui/notify";
import { getByStartAndFinishDate } from "../../api/userLog";
import { formatDate } from "../../utils/utility";
import UserLogDetailTemplate from "../../components/userlog-detail-template/UserLogDetailTemplate";

let startDate;
let finishDate;

export const UserLogsPage = () => {
  const [gridDataSource, setGridDataSource] = useState();
  const [userList, setUserList] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      const userResult = await getAllUsers(token.access_token);
      return {
        userResult,
      };
    };

    fetchData()
      .then((resp) => {
        setUserList(resp.userResult);
      })
      .catch((error) => {
        notify(error.message, "error", 2000);
      });
  }, []);

  const fetchUserLogs = useCallback(async () => {
    const token = getToken();
    const result = await getByStartAndFinishDate(
      formatDate(startDate),
      formatDate(finishDate),
      token.access_token
    );
    if (!result.isOk) {
      notify(result.message, "error", 2000);
    } else {
      setGridDataSource(result.data);
    }
  }, []);

  const onStartDateValueChanged = useCallback(
    async (e) => {
      startDate = e.value;
      if (finishDate && startDate > finishDate) {
        notify(
          {
            message: "The finish date cannot be less than the start date",
            position: { at: "top center", my: "top center" },
          },
          "warning",
          1000
        );
      } else {
        await fetchUserLogs();
      }
    },
    [fetchUserLogs]
  );

  const onFinishDateValueChanged = useCallback(
    async (e) => {
      finishDate = e.value;
      if (!startDate) {
        notify(
          {
            message: "Please first select a start date",
            position: { at: "top center", my: "top center" },
          },
          "warning",
          1000
        );
      } else if (startDate > finishDate) {
        notify(
          {
            message: "The finish date cannot be less than the start date",
            position: { at: "top center", my: "top center" },
          },
          "warning",
          1000
        );
      } else {
        await fetchUserLogs();
      }
    },
    [fetchUserLogs]
  );

  return (
    <>
      <DataGrid
        id="grid-container"
        dataSource={gridDataSource}
        keyExpr="baseEntityId"
        showBorders
        height={750}
      >
        {/* <Scrolling mode="virtual" /> */}
        <Paging enabled pageSize={10} />
        <Toolbar>
          <Item location="before">
            <div className="dx-field">
              <div className="dx-field-label">Start Date</div>
              <div className="dx-field-value">
                <DateBox type="date" onValueChanged={onStartDateValueChanged} />
              </div>
            </div>
          </Item>
          <Item location="before">
            <div className="dx-field">
              <div className="dx-field-label">Finish Date</div>
              <div className="dx-field-value">
                <DateBox
                  type="date"
                  onValueChanged={onFinishDateValueChanged}
                />
              </div>
            </div>
          </Item>
        </Toolbar>
        <Column dataField="userLogUserId" caption="User">
          <Lookup
            dataSource={userList}
            displayExpr="userIdentificationNumber"
            valueExpr="baseEntityId"
          />
        </Column>
        <Column dataField="userLogAction" caption="Action"></Column>
        <Column
          dataField="userLogActionDateTime"
          caption="Login Date"
          dataType="datetime"
        ></Column>
        <Column
          dataField="userLogIsSecureLogout"
          caption="Secure Logout"
          dataType="boolean"
        ></Column>
        <Column
          dataField="userLogCheckOutTime"
          caption="Logout Date"
          dataType="datetime"
        ></Column>
        <MasterDetail enabled component={UserLogDetailTemplate} />
      </DataGrid>
    </>
  );
};
