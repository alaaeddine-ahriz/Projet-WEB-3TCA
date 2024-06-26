import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Dashboard.css";
import { useCookies } from "react-cookie";
import axios from "axios";

function Dashboard(props) {
  const [cookies, removeCookie] = useCookies(["user"]);
  const user = props.user;
  const [suc, setSuc] = useState();
  const [info, setInfo] = useState([]);
  const [editing, setEditing] = useState(false); // État pour suivre si l'utilisateur est en mode d'édition
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const [successMessage, setSuccessMessage] = useState(""); // État pour gérer le message de succès
  const [newUserName, setnewUserName] = useState("");

  const [newCity, setnewCity] = useState("");
  const [preferences, setPreferences] = useState({
    Préférence_1: null,
    Préférence_2: null,
    Préférence_3: null,
    Préférence_4: null,
    Préférence_5: null,
  });

  const updatePreferences = (data) => {
    setInfo(data);
    setPreferences({
      Préférence_1: data.Préférence_1,
      Préférence_2: data.Préférence_2,
      Préférence_3: data.Préférence_3,
      Préférence_4: data.Préférence_4,
      Préférence_5: data.Préférence_5,
    });
    setnewUserName(data.userName);
    setnewCity(data.Ville_par_défaut);
  };

  useEffect(() => {
    // Effectuer la requête HTTP lorsque la page est chargée
    axios
      .get(`http://localhost:4000/Dashboard?nomRecherche=${user}`)
      .then((res) => {
        console.log("dashboard: " + res.data["nom"]);
        updatePreferences(res.data);
      })
      .catch((err) => console.log(err));
  }, []); // Utilisation d'une liste de dépendances vide pour exécuter une fois lors du montage initial

  const toggleEditing = () => {
    if (editing) {
      axios
        .put("http://localhost:4000/update", {
          user,
          newUserName,
          newCity,
          preferences,
        })
        .then((res) => {
          if (res.data.message === "User updated successfully") {
            // Modification réussie, vous pouvez informer l'utilisateur ici
            setSuccessMessage("User updated successfully");

            axios
              .get(`http://localhost:4000/Dashboard?nomRecherche=${user}`)
              .then((res) => {
                console.log("dashboard: " + res.data["nom"]);
                updatePreferences(res.data);
              })
              .catch((err) => console.log(err));
          } else {
            // La modification a échoué, affichez un message d'erreur approprié
            alert("Failed to update user");
          }
        })
        .catch((err) => {
          // Erreur lors de la requête, affichez un message d'erreur
          console.error("Error updating user:", err);
          alert("An error occurred while updating user");
        })
        .finally(() => {
          // Quelle que soit la réponse (réussie ou échouée), mettez fin à l'édition
          setEditing(false);
        });
    } else {
      // Si l'utilisateur n'est pas en mode d'édition, basculez simplement l'état d'édition
      setEditing(!editing);
    }
  };

  const handlePreferenceChange = (e) => {
    const { name, checked } = e.target;

    // Compter le nombre de préférences actuellement cochées
    const numCheckedPreferences = Object.values(preferences).reduce(
      (acc, curr) => (curr ? acc + 1 : acc),
      0,
    );

    // Limiter à trois préférences cochées
    if (numCheckedPreferences < 3 || !checked) {
      setPreferences((prevState) => ({
        ...prevState,
        [name]: checked,
      }));
    } else {
      // Afficher un message d'alerte ou une notification pour informer l'utilisateur qu'il ne peut pas cocher plus de trois cases
      alert("Vous ne pouvez sélectionner que trois préférences");
    }
  };

  function handleLogout() {
    // Supprimer le cookie 'user'
    props.onLogout();
    // Rediriger l'utilisateur vers la page d'accueil
    navigate("/");
  }

  return (
    <div className="login-container">
      <div className="dashboard">
        <Link to="/">
          <button type="submit">Back to Weather</button>
        </Link>
        <div className="dashboard-title">
          <h2>Dashboard</h2>
        </div>
        <div className="profil">
          <div className="photo">
            <img
              src="https://www.w3schools.com/howto/img_avatar.png"
              alt="avatar"
            />
          </div>
          <div className="nom-prenom">
            <input
              type="user"
              value={info.user}
              autoComplete="off"
              name="user"
              className="form-control rounded-0"
            />
          </div>
          <div className="user-id">
            {editing ? (
              <input
                type="user"
                placeholder={info.userName}
                autoComplete="off"
                name="userName_db"
                className="form-control"
                onChange={(e) => setnewUserName(e.target.value)}
              />
            ) : (
              <input
                type="user"
                value={info.userName}
                autoComplete="off"
                name="userName"
                className="form-control"
              />
            )}
          </div>
          <div className="preferences">
            <div className="ville">
              <p>
                {" "}
                <strong>City</strong>
              </p>
              {editing ? (
                <input
                  type="user"
                  placeholder={info.Ville_par_défaut}
                  autoComplete="off"
                  name="userName_db"
                  className="form-control rounded-0"
                  onChange={(e) => setnewCity(e.target.value)}
                />
              ) : (
                <input
                  type="user"
                  value={info.Ville_par_défaut}
                  autoComplete="off"
                  name="userName"
                  className="form-control rounded-0"
                />
              )}
            </div>
            {!editing && successMessage && (
              <div className="success-message">{successMessage}</div>
            )}
            <p>
              <strong>Preferences</strong>
            </p>
            <div className="option">
              <div className="preference-item">
                <input
                  type="checkbox"
                  id="option1"
                  name="Préférence_1"
                  checked={
                    editing ? preferences.Préférence_1 : info.Préférence_1
                  }
                  onChange={handlePreferenceChange}
                  disabled={!editing}
                />
                <label htmlFor="option1">Feels Like</label>
              </div>
              <div className="preference-item">
                <input
                  type="checkbox"
                  id="option2"
                  name="Préférence_2"
                  checked={
                    editing ? preferences.Préférence_2 : info.Préférence_2
                  }
                  onChange={handlePreferenceChange}
                  disabled={!editing}
                />
                <label htmlFor="option2">Wind Speed</label>
              </div>
              <div className="preference-item">
                <input
                  type="checkbox"
                  id="option3"
                  name="Préférence_3"
                  checked={
                    editing ? preferences.Préférence_3 : info.Préférence_3
                  }
                  onChange={handlePreferenceChange}
                  disabled={!editing}
                />
                <label htmlFor="option3">Humidity</label>
              </div>
              <div className="preference-item">
                <input
                  type="checkbox"
                  id="option4"
                  name="Préférence_4"
                  checked={
                    editing ? preferences.Préférence_4 : info.Préférence_4
                  }
                  onChange={handlePreferenceChange}
                  disabled={!editing}
                />
                <label htmlFor="option4">Sea level</label>
              </div>
              <div className="preference-item">
                <input
                  type="checkbox"
                  id="option5"
                  name="Préférence_5"
                  checked={
                    editing ? preferences.Préférence_5 : info.Préférence_5
                  }
                  onChange={handlePreferenceChange}
                  disabled={!editing}
                />
                <label htmlFor="option5">Visibility</label>
              </div>
            </div>
            <button onClick={toggleEditing}>{editing ? "Save" : "Edit"}</button>
            <button onClick={handleLogout}>Log out</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
