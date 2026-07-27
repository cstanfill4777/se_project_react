import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";

import LoginModal from "../LoginModal/LoginModal";
import RegisterModal from "../RegisterModal/RegisterModal";
import "./App.css";
import { coordinates, apiKey } from "../../utils/constants";
import Header from "../Header/Header";
import Main from "../Main/Main";
import ItemModal from "../ItemModal/ItemModal";
import AddItemModal from "../AddItemModal/AddItemModal";
import Footer from "../Footer/Footer";
import Profile from "../Profile/Profile";
import CurrentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnitContext";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import { getWeather, filterWeatherData } from "../../utils/weatherApi";

import * as auth from "../../utils/auth";

import EditProfileModal from "../EditProfileModal/EditProfileModal";

import {
  getItems,
  addItem,
  deleteItem,
  addCardLike,
  removeCardLike,
  editProfile,
} from "../../utils/api";

function App() {
  const [weatherData, setWeatherData] = useState({
    city: "",
    condition: "",
    type: "",
    temp: { F: 999, C: 999 },
    isDay: false,
  });

  const [activeModal, setActiveModal] = useState("");
  const [selectedCard, setSelectedCard] = useState({});
  const [clothingItems, setClothingItems] = useState([]);
  const [currentTemperatureUnit, setCurrentTemperatureUnit] = useState("F");
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleToggleSwitchChange = () => {
    setCurrentTemperatureUnit((prev) => (prev === "F" ? "C" : "F"));
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setActiveModal("preview");
  };

  const handleAddClick = () => {
    setActiveModal("add-garment");
  };

  const handleLoginClick = () => {
    setActiveModal("login");
  };

  const handleRegisterClick = () => {
    setActiveModal("register");
  };

  const closeActiveModal = () => {
    setActiveModal("");
  };

  const handleAddItem = (item) => {
    const token = localStorage.getItem("jwt");

    return addItem(item, token)
      .then((newItem) => {
        const normalizedItem = {
          ...newItem,
          _id: newItem._id || newItem.id,
          link: newItem.link || newItem.imageUrl,
        };
        setClothingItems((prevItems) => [normalizedItem, ...prevItems]);
        closeActiveModal();
      })
      .catch(console.error);
  };

  const handleDeleteItem = (card) => {
    const itemId = card._id || card.id;
    const token = localStorage.getItem("jwt");

    return deleteItem(itemId, token)
      .then(() => {
        setClothingItems((prevItems) =>
          prevItems.filter((item) => (item._id || item.id) !== itemId),
        );
        closeActiveModal();
      })
      .catch(console.error);
  };

  const handleLogin = ({ email, password }) => {
    return auth
      .authorize({ email, password })
      .then((res) => {
        localStorage.setItem("jwt", res.token);
        setIsLoggedIn(true);
        return auth.checkToken(res.token);
      })
      .then((userData) => {
        setCurrentUser(userData);
        closeActiveModal();
      })
      .catch(console.error);
  };

  const handleRegister = ({ name, avatar, email, password }) => {
    return auth
      .register({ name, avatar, email, password })
      .then(() => handleLogin({ email, password }))
      .catch(console.error);
  };

  const handleSignOut = () => {
    localStorage.removeItem("jwt");
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  const handleCardLike = ({ id, isLiked }) => {
    const token = localStorage.getItem("jwt");

    const request = isLiked
      ? removeCardLike(id, token)
      : addCardLike(id, token);

    return request
      .then((updatedCard) => {
        const normalizedCard = {
          ...updatedCard,
          _id: updatedCard._id || updatedCard.id,
          link: updatedCard.link || updatedCard.imageUrl,
        };

        setClothingItems((items) =>
          items.map((item) => (item._id === id ? normalizedCard : item)),
        );
      })
      .catch(console.error);
  };

  const handleEditProfileClick = () => {
    setActiveModal("edit-profile");
  };

  const handleEditProfile = ({ name, avatar }) => {
    const token = localStorage.getItem("jwt");

    return editProfile({ name, avatar }, token)
      .then((updatedUser) => {
        setCurrentUser(updatedUser);
        closeActiveModal();
      })
      .catch(console.error);
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (!token) return;

    auth
      .checkToken(token)
      .then((userData) => {
        setCurrentUser(userData);
        setIsLoggedIn(true);
      })
      .catch(() => {
        localStorage.removeItem("jwt");
        setCurrentUser(null);
        setIsLoggedIn(false);
      });
  }, []);

  useEffect(() => {
    getWeather(coordinates, apiKey)
      .then((data) => {
        const filteredData = filterWeatherData(data);
        setWeatherData(filteredData);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    getItems()
      .then((items) => {
        const normalizedItems = items.map((item) => ({
          ...item,
          _id: item._id || item.id,
          link: item.link || item.imageUrl,
        }));
        setClothingItems(normalizedItems);
      })
      .catch(console.error);
  }, []);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <CurrentTemperatureUnitContext.Provider
        value={{ currentTemperatureUnit, handleToggleSwitchChange }}
      >
        <div className="page">
          <div className="page__content">
            <Header
              handleAddClick={handleAddClick}
              weatherData={weatherData}
              isLoggedIn={isLoggedIn}
              onLoginClick={handleLoginClick}
              onRegisterClick={handleRegisterClick}
            />

            <Routes>
              <Route
                path="/"
                element={
                  <Main
                    weatherData={weatherData}
                    handleCardClick={handleCardClick}
                    clothingItems={clothingItems}
                    onCardLike={handleCardLike}
                  />
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <Profile
                      clothingItems={clothingItems}
                      handleCardClick={handleCardClick}
                      handleAddClick={handleAddClick}
                      onSignOut={handleSignOut}
                      onCardLike={handleCardLike}
                      onEditProfile={handleEditProfileClick}
                    />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>

          <Footer />

          <AddItemModal
            isOpen={activeModal === "add-garment"}
            onClose={closeActiveModal}
            onAddItem={handleAddItem}
          />

          <ItemModal
            isOpen={activeModal === "preview"}
            card={selectedCard}
            onClose={closeActiveModal}
            onDeleteItem={handleDeleteItem}
          />

          <LoginModal
            isOpen={activeModal === "login"}
            onClose={closeActiveModal}
            onLogin={handleLogin}
          />

          <RegisterModal
            isOpen={activeModal === "register"}
            onClose={closeActiveModal}
            onRegister={handleRegister}
          />

          <EditProfileModal
            isOpen={activeModal === "edit-profile"}
            onClose={closeActiveModal}
            onEditProfile={handleEditProfile}
          />
        </div>
      </CurrentTemperatureUnitContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default App;
