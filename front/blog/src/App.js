import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import Login from "./composants/Login";
import Register from "./composants/Register";
import Notes from "./composants/Notes";
import "./styles.css";

function Navbar() {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const location = useLocation();
    const logout = () => {
        localStorage.clear();
        navigate("/login");
    };
    const hideLinks = ["/login", "/register"].includes(location.pathname);

    return (
        <nav className="navbar">
            <div className="nav-title">📝 NoteApp Pro</div>
            {!hideLinks && (
                <div className="nav-links">
                    {!token ? (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/notes">Notes</Link>
                            <button onClick={logout} className="nav-logout-btn">Logout</button>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <div className="app-container">
                <Navbar />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/notes" element={<Notes />} />
                    <Route path="/" element={<Login />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}