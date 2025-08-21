import { Link, useLocation } from "react-router";
import { useNavigate } from "react-router";
import HighlightIcon from "@material-ui/icons/Highlight";

function Header(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <header>
      <div className="header-title">
        <h1>
          <Link to="/" className="header-link">
            <HighlightIcon />
            Keeper
          </Link>
        </h1>
        {user && user.username && (
          <div
            style={{
              color: "#e9e8e5ff",
              fontWeight: "bold",
              fontSize: "1.3rem",
            }}
          >
            Welcome {user.username}
          </div>
        )}
      </div>
      {location.pathname === "/" && (
        <div className="header-buttons">
          <div className="search">
            <input
              onChange={(e) => {
                return props.change(e);
              }}
              type="text"
              name="search"
              value={props.value}
              placeholder="Search notes with title"
            ></input>
            <button>Search</button>
          </div>
          <button className="logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;
