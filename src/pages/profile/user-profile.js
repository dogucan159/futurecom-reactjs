import "./user-profile.scss";
import React, { useState, useCallback, useEffect } from "react";

import notify from "devextreme/ui/notify";

import Toolbar, { Item } from "devextreme-react/toolbar";
import Button from "devextreme-react/button";
import ScrollView from "devextreme-react/scroll-view";
import { FormPhoto } from "../../components";
import { ProfileCard } from "../../components/profile-card/ProfileCard";
import { withLoadPanel } from "../../utils/withLoadPanel";
import { useScreenSize } from "../../utils/media-query";
import { ChangeProfilePasswordForm } from "../../components/change-profile-password-form/ChangeProfilePasswordForm";
import { useParams } from "react-router-dom";
import { getAll as getAllInstitutions } from "../../api/institution";
import { getToken } from "../../utils/auth";
import { getAll as getAllLanguages } from "../../api/language";
import { getAll as getAllAuditorTitles } from "../../api/auditorTitle";
import { getById as getUserById, update as updateUser } from "../../api/user";

const PROFILE_ID = 22;

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

const formatPhone = (value) => {
  return String(value).replace(/(\d{3})(\d{3})(\d{4})/, "+1($1)$2-$3");
};

const UserProfileContent = ({
  basicInfoItems,
  contactItems,
  addressItems,
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
            <FormPhoto link="" editable size={80} />
            <div>
              <div className="title-text">{`${profileData?.userFirstName} ${profileData?.userLastName}`}</div>
              <div className="subtitle-text with-clipboard-copy">
                <span>Username: {profileData?.userIdentificationNumber}</span>
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

        {/* <ProfileCard
          wrapperCssClass="profile-card contacts-card"
          title="Contacts"
          cardData={profileData}
          items={contactItems}
          onDataChanged={handleDataChanged}
        >
          <div className="profile-card-top-item">
            <div className="image-wrapper">
              <i className="dx-icon dx-icon-mention" />
            </div>
            <div>
              <div className="title-text">
                {formatPhone(profileData?.phone)}
              </div>
              <div className="subtitle-text with-clipboard-copy">
                {profileData?.email}
                <Button
                  icon="copy"
                  className="copy-clipboard-button"
                  stylingMode="text"
                  onClick={copyToClipboard(profileData?.email)}
                  activeStateEnabled={false}
                  focusStateEnabled={false}
                  hoverStateEnabled={false}
                />
              </div>
            </div>
          </div>
        </ProfileCard>

        <ProfileCard
          wrapperCssClass="profile-card address-card"
          title="Address"
          cardData={profileData}
          items={addressItems}
          onDataChanged={handleDataChanged}
        >
          <div className="profile-card-top-item">
            <div className="image-wrapper">
              <i className="dx-icon dx-icon-map" />
            </div>
            <div>
              <div className="title-text">
                {profileData?.address}, {profileData?.city},{" "}
                {profileData?.state}, {profileData?.country}
              </div>
            </div>
          </div>
        </ProfileCard> */}
      </div>
    </ScrollView>
  );
};

const UserProfileContentWithLoadPanel = withLoadPanel(UserProfileContent);

export const UserProfilePage = () => {
  const [profileData, setProfileData] = useState();
  const [savedProfileData, setSavedProfileData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isChangePasswordPopupOpened, setIsChangedPasswordPopupOpened] =
    useState(false);
  const [isDataChanged, setIsDataChanged] = useState(false);
  const [basicInfoItems, setBasicInfoItems] = useState([]);
  const [contactItems, setContactItems] = useState([]);
  const [addressItems, setAddressItems] = useState([]);
  const [isContentScrolled, setIsContentScrolled] = useState(false);
  const { selectedUserId } = useParams();

  const dataChanged = useCallback(() => {
    setIsDataChanged(true);
  }, []);

  const changePassword = useCallback(() => {
    setIsChangedPasswordPopupOpened(true);
  }, []);

  const handleContentScrolled = useCallback((reachedTop) => {
    setIsContentScrolled(!reachedTop);
  }, []);

  const setSavedData = useCallback(
    (data = profileData) => {
      setSavedProfileData(JSON.parse(JSON.stringify(data)));
    },
    [profileData]
  );

  const onCancel = useCallback(() => {
    setProfileData(savedProfileData);
    setSavedData(savedProfileData);
    setIsDataChanged(false);
  }, [savedProfileData, setSavedData]);

  const onSave = useCallback(async () => {
    try {
      const token = getToken();
      await updateUser(profileData, token.access_token);
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
      const message = `An error occurred while updating the user:  ${error.message}`;
      notify(
        {
          message,
          position: {
            my: "center top",
            at: "center top",
          },
        },
        "error",
        10000
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
        if (!userResult.isOk) {
          throw new Error(userResult.message);
        }
        const institutionResult = await getAllInstitutions(token.access_token);
        if (!institutionResult.isOk) {
          throw new Error(institutionResult.message);
        }
        const languageResult = await getAllLanguages(token.access_token);
        if (!languageResult.isOk) {
          throw new Error(languageResult.message);
        }
        const auditorTitleResult = await getAllAuditorTitles(
          token.access_token
        );
        if (!auditorTitleResult.isOk) {
          throw new Error(auditorTitleResult.message);
        }

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
              dataSource: resp.institutionResult.data,
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
              dataSource: resp.auditorTitleResult.data,
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
              dataSource: resp.languageResult.data,
              displayExpr: "languageCode",
              valueExpr: "baseEntityId",
            },
          },
          { dataField: "userFirstName", colSpan: 2, label: "First Name" },
          { dataField: "userLastName", colSpan: 2, label: "Last Name" },
        ];
        setBasicInfoItems(basicInfoItems);
        setProfileData(resp.userResult.data);
        setSavedData(resp.userResult.data);
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
          contactItems={contactItems}
          addressItems={addressItems}
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
        currentUserId={selectedUserId}
        visible={isChangePasswordPopupOpened}
        setVisible={setIsChangedPasswordPopupOpened}
      />
    </div>
  );
};
