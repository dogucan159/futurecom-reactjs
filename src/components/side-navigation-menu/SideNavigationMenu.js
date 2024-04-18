import React, { useEffect, useRef, useCallback, useMemo } from "react";

import TreeView from "devextreme-react/tree-view";

import "./SideNavigationMenu.scss";

import * as events from "devextreme/events";
import Footer from "../footer/Footer";
import { getUser } from "../../utils/auth";
import { navigation } from '../../app-navigation';
import { useNavigation } from "../../contexts/navigation";
import { useScreenSize } from "../../utils/media-query";

export const SideNavigationMenu = (props) => {
  const { children, selectedItemChanged, openMenu, compactMode, onMenuReady } =
    props;

  const { isLarge } = useScreenSize();
  function normalizePath() {
    const user = getUser();
    return navigation.map((item) => ({
      ...item,
      expanded: isLarge,
      path: item.path && !/^\//.test(item.path) ? `/${item.path}` : item.path,
      items:
        item.items &&
        item.items.map((itm) => ({
          ...itm,
          path:
            itm.text === "Profile"
              ? `${itm.path}/${user.baseEntityId}`
              : itm.path,
        })),
    }));
  }

  const items = useMemo(normalizePath, []);

  const {
    navigationData: { currentPath },
  } = useNavigation();

  const treeViewRef = useRef(null);
  const wrapperRef = useRef();
  const getWrapperRef = useCallback(
    (element) => {
      const prevElement = wrapperRef.current;
      if (prevElement) {
        events.off(prevElement, "dxclick");
      }

      wrapperRef.current = element;
      events.on(element, "dxclick", (e) => {
        openMenu(e);
      });
    },
    [openMenu]
  );

  useEffect(() => {
    const treeView = treeViewRef.current && treeViewRef.current.instance;
    if (!treeView) {
      return;
    }

    if (currentPath !== undefined) {
      treeView.selectItem(currentPath);
      treeView.expandItem(currentPath);
    }

    if (compactMode) {
      treeView.collapseAll();
    }
  }, [currentPath, compactMode]);

  return (
    <div
      className="dx-swatch-additional side-navigation-menu"
      ref={getWrapperRef}
    >
      {children}
      <div className="menu-container theme-dependent">
        <TreeView
          ref={treeViewRef}
          items={items}
          keyExpr="path"
          selectionMode="single"
          focusStateEnabled={false}
          expandEvent="click"
          onItemClick={selectedItemChanged}
          onContentReady={onMenuReady}
          width="100%"
        />
      </div>
      <Footer>
        Copyright © {new Date().getFullYear()} <br /> Developer Express Inc.
      </Footer>
    </div>
  );
};
