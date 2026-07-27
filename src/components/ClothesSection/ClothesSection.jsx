import { useContext } from "react";
import ItemCard from "../ItemCard/ItemCard";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function ClothesSection({
  clothingItems,
  handleCardClick,
  handleAddClick,
  onCardLike,
}) {
  const currentUser = useContext(CurrentUserContext);

  const userItems = clothingItems.filter(
    (item) => item.owner === currentUser?._id,
  );

  return (
    <section className="clothes-section">
      <div className="clothes-section__header">
        <p>Your items</p>

        <button type="button" onClick={handleAddClick}>
          + Add new
        </button>
      </div>

      <ul className="cards__list">
        {userItems.map((item) => (
          <ItemCard
            key={item._id}
            item={item}
            onCardClick={handleCardClick}
            onCardLike={onCardLike}
          />
        ))}
      </ul>
    </section>
  );
}

export default ClothesSection;
