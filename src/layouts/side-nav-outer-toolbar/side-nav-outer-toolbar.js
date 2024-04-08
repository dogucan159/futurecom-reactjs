import Drawer from "devextreme-react/drawer";
import ScrollView from "devextreme-react/scroll-view";
import React, { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Header, SideNavigationMenu, Footer } from "../../components";
import "./side-nav-outer-toolbar.scss";
import { useScreenSize } from "../../utils/media-query";
import { Template } from "devextreme-react/core/template";
import { useMenuPatch } from "../../utils/patches";
import { useAuth } from "../../contexts/auth";
import { Popup } from "devextreme-react";
import { ToolbarItem } from "devextreme-react/cjs/data-grid";
import notify from "devextreme/ui/notify";
import { getToken, getTokenDuration } from "../../utils/auth";

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

export default function SideNavOuterToolbar({ title, children }) {
  const scrollViewRef = useRef(null);
  const navigate = useNavigate();
  const { isXSmall, isLarge } = useScreenSize();
  const [patchCssClass, onMenuReady] = useMenuPatch();
  const [menuStatus, setMenuStatus] = useState(
    isLarge ? MenuStatus.Opened : MenuStatus.Closed
  );
  const [popupVisible, setPopupVisible] = useState(false);
  const { signOut, refreshToken } = useAuth(false);

  useEffect(() => {
    const tokenData = getToken();
    if (tokenData && tokenData.access_token !== "EXPIRED") {
      const tokenDuration = getTokenDuration();
      console.log(getRemainingTimeText(tokenDuration));

      setTimeout(() => {
        setPopupVisible(true);
      }, tokenDuration);
    }
  }, [popupVisible]);

  const toggleMenu = useCallback(({ event }) => {
    setMenuStatus((prevMenuStatus) =>
      prevMenuStatus === MenuStatus.Closed
        ? MenuStatus.Opened
        : MenuStatus.Closed
    );
    event.stopPropagation();
  }, []);

  const temporaryOpenMenu = useCallback(() => {
    setMenuStatus((prevMenuStatus) =>
      prevMenuStatus === MenuStatus.Closed
        ? MenuStatus.TemporaryOpened
        : prevMenuStatus
    );
  }, []);

  const onOutsideClick = useCallback(() => {
    setMenuStatus((prevMenuStatus) =>
      prevMenuStatus !== MenuStatus.Closed && !isLarge
        ? MenuStatus.Closed
        : prevMenuStatus
    );
    return menuStatus === MenuStatus.Closed ? true : false;
  }, [isLarge, menuStatus]);

  const onNavigationChanged = useCallback(
    ({ itemData, event, node }) => {
      if (menuStatus === MenuStatus.Closed || !itemData.path || node.selected) {
        event.preventDefault();
        return;
      }

      navigate(itemData.path);
      scrollViewRef.current.instance.scrollTo(0);

      if (!isLarge || menuStatus === MenuStatus.TemporaryOpened) {
        setMenuStatus(MenuStatus.Closed);
        event.stopPropagation();
      }
    },
    [navigate, menuStatus, isLarge]
  );

  const refreshTokenData = useCallback(async () => {
    const result = await refreshToken();
    if (result.isOk) {
      setPopupVisible(false);
    } else {
      const message = result.message;
      console.log(message);
      notify(
        {
          message,
          position: {
            my: "center top",
            at: "center top",
          },
        },
        "success",
        3000
      );
    }
  }, [refreshToken]);

  const getRefreshTokenButtonOptions = useCallback(
    () => ({
      icon: "refresh",
      stylingMode: "contained",
      text: "Refresh Token",
      onClick: refreshTokenData,
    }),
    [refreshTokenData]
  );

  const getSignOutButtonOptions = useCallback(
    () => ({
      icon: "runner",
      text: "Logout",
      stylingMode: "outlined",
      onClick: signOut,
    }),
    [signOut]
  );

  return (
    <div className={"side-nav-outer-toolbar"}>
      <Popup
        visible={popupVisible}
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
      <Header menuToggleEnabled toggleMenu={toggleMenu} title={title} />
      <Drawer
        className={["drawer", patchCssClass].join(" ")}
        position={"before"}
        closeOnOutsideClick={onOutsideClick}
        openedStateMode={isLarge ? "shrink" : "overlap"}
        revealMode={isXSmall ? "slide" : "expand"}
        minSize={isXSmall ? 0 : 60}
        maxSize={250}
        shading={isLarge ? false : true}
        opened={menuStatus === MenuStatus.Closed ? false : true}
        template={"menu"}
      >
        <div className={"container"}>
          <ScrollView ref={scrollViewRef} className={"layout-body with-footer"}>
            <div className={"content"}>
              {React.Children.map(children, (item) => {
                return item.type !== Footer && item;
              })}
            </div>
            <div className={"content-block"}>
              {React.Children.map(children, (item) => {
                return item.type === Footer && item;
              })}
            </div>
          </ScrollView>
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

const MenuStatus = {
  Closed: 1,
  Opened: 2,
  TemporaryOpened: 3,
};
