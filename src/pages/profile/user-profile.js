import './user-profile.scss';
import { Button, ScrollView, Toolbar } from "devextreme-react";
import { Item } from "devextreme-react/form";
import withLoadPanel from "../../utils/withLoadPanel";
import { useScreenSize } from "../../utils/media-query";
import { ProfileCard } from "../../components/profile-card/ProfileCard";
import notify from "devextreme/ui/notify";
import { useCallback, useEffect, useState } from "react";
import { getAll as getAllInstitutions } from "../../api/institution";
import { getToken, getUser } from "../../utils/auth";

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
                <span>Username: {profileData?.userIdentificationNumber}</span>
                <Button
                  icon="copy"
                  className="copy-clipboard-button"
                  stylingMode="text"
                  onClick={copyToClipboard(profileData?.id)}
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

  const onSave = useCallback(() => {
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
  }, [setSavedData]);

  useEffect(() => {
    const fetchInstitutionData = async () => {
      const token = getToken();
      const result = await getAllInstitutions(token.access_token);
      if (!result.isOk) {
        throw new Error(result.message);
      }
      return result;
    };

    fetchInstitutionData()
      .then((resp) => {
        console.log(resp);
        const basicInfoItems = [
          { dataField: "userFirstName", colSpan: 2 },
          { dataField: "userLastName", colSpan: 2 },
          {
            dataField: "userInstitutionId",
            editorType: "dxSelectBox",
            colSpan: 1,
            editorOptions: {
              key: "baseEntityId",
              dataSource: resp.data,
              displayExpr: "institutionName",
              valueExpr: "baseEntityId",
            },
          },
          { dataField: "userIdentificationNumber", colSpan: 1 },
        ];

        setBasicInfoItems(basicInfoItems);
        const user = getUser();
        setProfileData(user);
        setSavedData(user);
        setIsLoading(false);
      })
      .catch((error) => {
        const message = error.message;
        console.log(message);
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
  }, []);

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
    </div>
  );
}
