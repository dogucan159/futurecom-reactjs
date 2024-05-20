import { useMemo, useCallback } from "react";
import List from "devextreme-react/list";

import "./UserMenuSection.scss";
import { useAuth } from "../../contexts/auth";
import notify from "devextreme/ui/notify";

export const UserMenuSection = ({ showAvatar, listRef }) => {
  const { user, signOut } = useAuth();

  const logOff = useCallback(async () => {
    const result = await signOut();

    if (!result.isOk) {
      notify(result.message, "error", 2000);
    }
  }, [signOut]);

  const menuItems = useMemo(
    () => [
      {
        text: "Logout",
        icon: "runner",
        onClick: logOff,
      },
    ],
    [logOff]
  );

  const listElementAttr = {
    class: "user-info-list",
  };

  const onItemClick = useCallback(({ itemData }) => itemData?.onClick, []);

  return (
    <>
      <div className="user-info">
        {showAvatar && (
          <div className="image-container">
            <div
              style={{
                backgroundImage: `url(${user?.avatarUrl})`,
              }}
              className="user-image"
            />
          </div>
        )}
        <div className="user-name">{`${user.userFirstName} ${user.userLastName}`}</div>
      </div>
      <List
        ref={listRef}
        elementAttr={listElementAttr}
        onItemClick={onItemClick}
        items={menuItems}
      />
    </>
  );
};
