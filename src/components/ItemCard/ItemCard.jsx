import { useContext } from "react";
import "./ItemCard.css";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function ItemCard({ item, onCardClick, onCardLike }) {
  const currentUser = useContext(CurrentUserContext);

  const handleCardClick = () => {
    onCardClick(item);
  };

  const isLiked =
    currentUser &&
    Array.isArray(item.likes) &&
    item.likes.some((id) => id === currentUser._id);

  const handleLike = () => {
    onCardLike({
      id: item._id,
      isLiked,
    });
  };

  return (
    <li className="card">
      <h2 className="card__name">{item.name}</h2>

      {currentUser && (
        <button
          type="button"
          className={`card__like-button ${
            isLiked ? "card__like-button_active" : ""
          }`}
          onClick={handleLike}
        >
          ♥
        </button>
      )}

      <img
        onClick={handleCardClick}
        className="card__image"
        src={item.link}
        alt={item.name}
      />
    </li>
  );
}

export default ItemCard;
