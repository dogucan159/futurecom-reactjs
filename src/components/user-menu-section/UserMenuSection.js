import { useMemo, useCallback } from "react";
import List from "devextreme-react/list";

import "./UserMenuSection.scss";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../../store/auth/auth-actions";

export const UserMenuSection = ({ showAvatar, listRef }) => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const logOff = useCallback(async () => {
    dispatch(signOut());
  }, [dispatch]);

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
