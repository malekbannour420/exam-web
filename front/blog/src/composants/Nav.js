import { Link } from "react-router-dom";

export default function Nav() {
    return (
        <nav style={{ padding: 20, background: "#f0f0f0", marginBottom: 20 }}>
            <Link to="/login" style={{ marginRight: 10 }}>Login</Link>
            <Link to="/register" style={{ marginRight: 10 }}>Register</Link>
            <Link to="/notes">Notes</Link>
        </nav>
    );
}