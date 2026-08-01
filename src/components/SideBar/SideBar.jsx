import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import "./SideBar.css";

function SideBar({ onSignOut, onEditProfile }) {
  const currentUser = useContext(CurrentUserContext);

  const firstLetter = currentUser?.name?.charAt(0)?.toUpperCase();

  return (
    <div className="sidebar">
      {currentUser?.avatar ? (
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="sidebar__avatar"
        />
      ) : (
        <div className="sidebar__avatar sidebar__avatar-placeholder">
          {firstLetter}
        </div>
      )}

      <div className="sidebar__user-info">
        <p className="sidebar__username">{currentUser?.name}</p>

        <button type="button" onClick={onEditProfile}>
          Edit profile
        </button>

        <button
          type="button"
          className="sidebar__signout-btn"
          onClick={onSignOut}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default SideBar;
