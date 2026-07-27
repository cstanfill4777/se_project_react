import SideBar from "../SideBar/SideBar";
import ClothesSection from "../ClothesSection/ClothesSection";
import "./Profile.css";

function Profile({
  clothingItems,
  handleCardClick,
  handleAddClick,
  onSignOut,
  onCardLike,
  onEditProfile,
}) {
  return (
    <div className="profile">
      <SideBar onSignOut={onSignOut} onEditProfile={onEditProfile} />

      <ClothesSection
        clothingItems={clothingItems}
        handleCardClick={handleCardClick}
        handleAddClick={handleAddClick}
        onCardLike={onCardLike}
      />
    </div>
  );
}

export default Profile;
