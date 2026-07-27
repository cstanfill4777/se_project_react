import { useContext } from "react";
import "./ItemModal.css";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function ItemModal({ isOpen, onClose, card, onDeleteItem }) {
  const currentUser = useContext(CurrentUserContext);

  const isOwn = card.owner === currentUser?._id;

  return (
    <div className={`modal ${isOpen ? "modal_opened" : ""}`}>
      <div className="modal__content modal__content_type_image">
        <button
          onClick={onClose}
          type="button"
          className="modal__close modal__close_type_preview"
        ></button>

        <img src={card.link} alt={card.name} className="modal__image" />

        <div className="modal__footer">
          <div>
            <h2 className="modal__caption">{card.name}</h2>
            <p className="modal__weather">Weather: {card.weather}</p>
          </div>

          {isOwn && (
            <button
              type="button"
              className="modal__delete-btn"
              onClick={() => onDeleteItem(card)}
            >
              Delete item
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ItemModal;
