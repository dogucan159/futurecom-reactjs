import "./user-profile.scss";
import Toolbar, { Item } from 'devextreme-react/toolbar';
import Button from 'devextreme-react/button';
import ScrollView from 'devextreme-react/scroll-view';
import withLoadPanel from "../../utils/withLoadPanel";
import { useScreenSize } from "../../utils/media-query";
import { ProfileCard } from "../../components/profile-card/ProfileCard";
import notify from "devextreme/ui/notify";
import { useCallback, useEffect, useState } from "react";
import { getAll as getAllInstitutions } from "../../api/institution";
import { getToken } from "../../utils/auth";
import { getAll as getAllLanguages } from "../../api/language";
import { getAll as getAllAuditorTitles } from "../../api/auditorTitle";
import { getById as getUserById, update as updateUser } from "../../api/user";
import { useParams } from "react-router-dom";
import { ChangeProfilePasswordForm } from "../../components/change-profile-password-form/ChangeProfilePasswordForm";

const copyToClipboard = (text) => (evt) => {
  window.navigator.clipboard?.writeText(text);
  const tipText = "Text copied";
  notify(
    {
      message: tipText,
      minWidth: `${tipText.length + 2}ch`,
      width: "auto",
      position: { of: evt.element, offset: "0 -30" },
    },
    "info",
    500
  );
};

const UserProfileContent = ({
  basicInfoItems,
  //   contactItems,
  //   addressItems,
  profileData,
  handleDataChanged,
  handleChangePasswordClick,
  handleContentScrolled,
}) => {
  const { isXSmall } = useScreenSize();

  const onScroll = useCallback(
    (reachedTop) => {
      handleContentScrolled(reachedTop);
    },
    [handleContentScrolled]
  );

  return (
    <ScrollView className="view-wrapper-scroll" onScroll={onScroll}>
      <div className="cards-container">
        <ProfileCard
          wrapperCssClass="profile-card basic-info-card"
          title="Basic Info"
          colCount={4}
          cardData={profileData}
          items={basicInfoItems}
          onDataChanged={handleDataChanged}
        >
          <div className="basic-info-top-item profile-card-top-item">
            {/*sonra ele alinacak <FormPhoto link={profileData?.image} editable size={80} /> */}
            {/* <div className="form-photo-view">
              <div
                className="form-photo"
                style={{
                  width: 80,
                  height: 80,
                  maxHeight: 80,
                  backgroundImage: `url(${"https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/employees/05.png"}) no-repeat #fff`,
                }}
              ></div>
            </div> */}
            <div className={"form-avatar"}>
              <img
                alt={""}
                src={`https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/employees/05.png`}
              />
            </div>
            <div>
              <div className="title-text">{`${profileData?.userFirstName} ${profileData?.userLastName}`}</div>
              <div className="subtitle-text with-clipboard-copy">
                <span>Database ID: {profileData?.baseEntityId}</span>
                <Button
                  icon="copy"
                  className="copy-clipboard-button"
                  stylingMode="text"
                  onClick={copyToClipboard(profileData?.baseEntityId)}
                  activeStateEnabled={false}
                  focusStateEnabled={false}
                  hoverStateEnabled={false}
                />
              </div>
              <Button
                text="Change Password"
                className="change-password-button"
                stylingMode="contained"
                icon={isXSmall ? void 0 : "lock"}
                onClick={handleChangePasswordClick}
              />
            </div>
          </div>
        </ProfileCard>
      </div>
    </ScrollView>
  );
};

const UserProfileContentWithLoadPanel = withLoadPanel(UserProfileContent);

export default function UserProfilePage() {
  const [isContentScrolled, setIsContentScrolled] = useState(false);
  const [isDataChanged, setIsDataChanged] = useState(false);
  const [isChangePasswordPopupOpened, setIsChangedPasswordPopupOpened] =
    useState(false);
  const [profileData, setProfileData] = useState();
  const [savedProfileData, setSavedProfileData] = useState();
  const [basicInfoItems, setBasicInfoItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { selectedUserId } = useParams();

  const handleContentScrolled = useCallback((reachedTop) => {
    setIsContentScrolled(!reachedTop);
  }, []);

  const dataChanged = useCallback(() => {
    setIsDataChanged(true);
  }, []);

  const changePassword = useCallback(() => {
    setIsChangedPasswordPopupOpened(true);
  }, []);

  const setSavedData = useCallback(
    (data = profileData) => {
      setSavedProfileData(JSON.parse(JSON.stringify(data)));
    },
    [profileData]
  );

  const onCancel = useCallback(() => {
    setProfileData(savedProfileData);
    setSavedData();
    setIsDataChanged(false);
  }, [savedProfileData, setSavedData]);

  const onSave = useCallback(async () => {
    try {
      const token = getToken();
      const resp = await updateUser(profileData, token.access_token);
      notify(
        {
          message: "Data saved",
          position: {
            at: "bottom center",
            my: "bottom center",
          },
        },
        "success"
      );
      setIsDataChanged(false);
      setSavedData();
    } catch (error) {
      const message = error.message;
      notify(
        {
          message,
          position: {
            my: "center top",
            at: "center top",
          },
        },
        "error",
        3000
      );
    }
  }, [setSavedData, profileData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        const userResult = await getUserById(
          selectedUserId,
          token.access_token
        );
        const institutionResult = await getAllInstitutions(token.access_token);
        const languageResult = await getAllLanguages(token.access_token);
        const auditorTitleResult = await getAllAuditorTitles(
          token.access_token
        );

        return {
          userResult,
          institutionResult,
          languageResult,
          auditorTitleResult,
        };
      } catch (error) {
        throw new Error(error.message);
      }
    };

    fetchData()
      .then((resp) => {
        const basicInfoItems = [
          {
            dataField: "userIdentificationNumber",
            colSpan: 1,
            label: "Username",
          },
          {
            dataField: "userInstitutionId",
            label: "Institution",
            editorType: "dxSelectBox",
            colSpan: 1,
            editorOptions: {
              key: "baseEntityId",
              dataSource: resp.institutionResult,
              displayExpr: "institutionName",
              valueExpr: "baseEntityId",
            },
          },
          {
            dataField: "userAuditorTitleId",
            label: "Title",
            editorType: "dxSelectBox",
            colSpan: 1,
            editorOptions: {
              key: "baseEntityId",
              dataSource: resp.auditorTitleResult,
              displayExpr: "auditorTitleCode",
              valueExpr: "baseEntityId",
            },
          },
          {
            dataField: "userLanguageId",
            label: "Language",
            editorType: "dxSelectBox",
            colSpan: 1,
            editorOptions: {
              key: "baseEntityId",
              dataSource: resp.languageResult,
              displayExpr: "languageCode",
              valueExpr: "baseEntityId",
            },
          },
          { dataField: "userFirstName", colSpan: 2, label: "First Name" },
          { dataField: "userLastName", colSpan: 2, label: "Last Name" },
        ];

        setBasicInfoItems(basicInfoItems);
        setProfileData(resp.userResult);
        setSavedData(resp.userResult);
        setIsLoading(false);
      })
      .catch((error) => {
        const message = error.message;
        notify(
          {
            message,
            position: {
              my: "center top",
              at: "center top",
            },
          },
          "error",
          3000
        );
      });
  }, [selectedUserId]);

  return (
    <div className="view-host user-profile">
      <div className="view-wrapper">
        <Toolbar
          className={`theme-dependent ${isContentScrolled ? "scrolled" : ""}`}
        >
          <Item location="before">
            <div className="header-text">User Profile</div>
          </Item>
          <Item location="after" locateInMenu="never">
            <Button
              className="cancel-button"
              text="Cancel"
              disabled={!isDataChanged}
              stylingMode="outlined"
              type="normal"
              onClick={onCancel}
            />
          </Item>
          <Item location="after" locateInMenu="never">
            <Button
              disabled={!isDataChanged}
              text="Save"
              icon="save"
              type="default"
              stylingMode="contained"
              onClick={onSave}
            />
          </Item>
        </Toolbar>
        <UserProfileContentWithLoadPanel
          basicInfoItems={basicInfoItems}
          //   contactItems={contactItems}
          //   addressItems={addressItems}
          profileData={profileData}
          handleChangePasswordClick={changePassword}
          handleDataChanged={dataChanged}
          handleContentScrolled={handleContentScrolled}
          hasData={!isLoading}
          loading={isLoading}
          panelProps={{
            container: ".view-wrapper",
            position: { of: ".content" },
          }}
        />
      </div>
      <ChangeProfilePasswordForm
        visible={isChangePasswordPopupOpened}
        setVisible={setIsChangedPasswordPopupOpened}
      />
    </div>
  );
}
