import Drawer from "devextreme-react/drawer";
import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import { Header, SideNavigationMenu, Footer } from "../../components";
import "./side-nav-outer-toolbar.scss";
import { useScreenSize } from "../../utils/media-query";
import { Template } from "devextreme-react/core/template";
import { useMenuPatch } from "../../utils/patches";
import { Popup } from "devextreme-react";
import { ToolbarItem } from "devextreme-react/cjs/data-grid";
import { getToken, getTokenDuration } from "../../utils/auth";
import { useDispatch, useSelector } from "react-redux";
import { refreshToken, signOut } from "../../store/auth/auth-actions";
import { authActions } from "../../store/auth/auth-slice";
import appInfo from "../../app-info";
import { Outlet } from "react-router-dom";

const MenuStatus = {
  Closed: 1,
  Opened: 2,
  TemporaryOpened: 3,
};

function getRemainingTimeText(diff) {
  // get total seconds between the times
  var delta = Math.abs(diff) / 1000;

  // calculate (and subtract) whole days
  var days = Math.floor(delta / 86400);
  delta -= days * 86400;

  // calculate (and subtract) whole hours
  var hours = Math.floor(delta / 3600) % 24;
  delta -= hours * 3600;

  // calculate (and subtract) whole minutes
  var minutes = Math.floor(delta / 60) % 60;
  delta -= minutes * 60;

  // what's left is seconds
  var seconds = Math.floor(delta % 60);

  return `${hours} saat ${minutes} dakika ${seconds} saniye kaldi...`;
}

export default function SideNavOuterToolbar() {
  const navigate = useNavigate();
  const { isXSmall, isLarge } = useScreenSize();
  const [patchCssClass, onMenuReady] = useMenuPatch();
  const [menuStatus, setMenuStatus] = useState(null);

  const dispatch = useDispatch();
  const popup = useSelector((state) => state.auth.popupVisible);

  useEffect(() => {
    const tokenData = getToken();
    if (tokenData && tokenData.access_token !== "EXPIRED") {
      const tokenDuration = getTokenDuration();
      console.log(getRemainingTimeText(tokenDuration - 60000));

      setTimeout(() => {
        dispatch(authActions.setPopupVisible({ isVisible: true }));
      }, tokenDuration - 60000);
    }
  }, [dispatch, popup]);

  const getDefaultMenuOpenState = useCallback(
    () => (isLarge ? MenuStatus.Opened : MenuStatus.Closed),
    [isLarge]
  );
  const getMenuOpenState = useCallback(
    (status) => {
      if (status === null) {
        return getDefaultMenuOpenState();
      }

      return status;
    },
    [getDefaultMenuOpenState]
  );

  const getMenuStatus = useCallback(
    (status) => {
      return status === getDefaultMenuOpenState() ? null : status;
    },
    [getDefaultMenuOpenState]
  );

  const changeMenuStatus = useCallback(
    (reducerFn) => {
      setMenuStatus((prevMenuStatus) =>
        getMenuStatus(
          reducerFn(getMenuOpenState(prevMenuStatus)) ?? prevMenuStatus
        )
      );
    },
    [getMenuOpenState, getMenuStatus]
  );

  const toggleMenu = useCallback(
    ({ event }) => {
      changeMenuStatus((prevStatus) =>
        prevStatus === MenuStatus.Closed ? MenuStatus.Opened : MenuStatus.Closed
      );
      event?.stopPropagation();
    },
    [changeMenuStatus]
  );

  const temporaryOpenMenu = useCallback(() => {
    changeMenuStatus((prevStatus) =>
      prevStatus === MenuStatus.Closed ? MenuStatus.TemporaryOpened : null
    );
  }, [changeMenuStatus]);

  const onOutsideClick = useCallback(() => {
    changeMenuStatus((prevStatus) =>
      prevStatus !== MenuStatus.Closed && !isLarge ? MenuStatus.Closed : null
    );
    return !isLarge;
  }, [isLarge, changeMenuStatus]);

  const onNavigationChanged = useCallback(
    ({ itemData: { path }, event, node }) => {
      if (
        getMenuOpenState(menuStatus) === MenuStatus.Closed ||
        !path ||
        node?.selected
      ) {
        event?.preventDefault();
        return;
      }

      navigate(path);
      if (!isLarge || menuStatus === MenuStatus.TemporaryOpened) {
        setMenuStatus(getMenuStatus(MenuStatus.Closed));
        event?.stopPropagation();
      }
    },
    [navigate, menuStatus, isLarge]
  );

  const refreshTokenData = useCallback(async () => {
    dispatch(refreshToken());
  }, [dispatch]);

  const getRefreshTokenButtonOptions = useCallback(
    () => ({
      icon: "refresh",
      stylingMode: "contained",
      text: "Refresh Token",
      onClick: refreshTokenData,
    }),
    [refreshTokenData]
  );

  const logOff = () => {
    dispatch(signOut());
  };

  const getSignOutButtonOptions = useCallback(
    () => ({
      icon: "runner",
      text: "Logout",
      stylingMode: "outlined",
      onClick: logOff,
    }),
    [logOff]
  );

  return (
    <div className={"side-nav-outer-toolbar"}>
      <Popup
        visible={popup}
        dragEnabled={false}
        hideOnOutsideClick={false}
        showCloseButton={false}
        showTitle={true}
        title="Warning"
        container=".dx-viewport"
        width={400}
        height={280}
      >
        <ToolbarItem
          widget="dxButton"
          toolbar="bottom"
          location="before"
          options={getRefreshTokenButtonOptions()}
        />
        <ToolbarItem
          widget="dxButton"
          toolbar="bottom"
          location="after"
          options={getSignOutButtonOptions()}
        />
        <p>Token geçerlilik süresi dolmuştur..</p>
      </Popup>

      <Header
        className="layout-header"
        menuToggleEnabled
        toggleMenu={toggleMenu}
        title={appInfo.title}
      />

      <Drawer
        className={["drawer layout-body", patchCssClass].join(" ")}
        position="before"
        closeOnOutsideClick={onOutsideClick}
        openedStateMode={isLarge ? "shrink" : "overlap"}
        revealMode={isXSmall ? "slide" : "expand"}
        minSize={isXSmall ? 0 : 48}
        maxSize={250}
        shading={isLarge ? false : true}
        opened={
          getMenuOpenState(menuStatus) === MenuStatus.Closed ? false : true
        }
        template="menu"
      >
        <div className={"content"}>
          {/* {React.Children.map(children, (item) => {
            return item.type !== Footer && item;
          })} */}
          <Outlet />
        </div>
        <Template name={"menu"}>
          <SideNavigationMenu
            compactMode={menuStatus === MenuStatus.Closed}
            selectedItemChanged={onNavigationChanged}
            openMenu={temporaryOpenMenu}
            onMenuReady={onMenuReady}
          ></SideNavigationMenu>
        </Template>
      </Drawer>
    </div>
  );
}
