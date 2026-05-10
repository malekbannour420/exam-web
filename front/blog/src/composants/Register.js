import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import "../styles.css";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Vérification mot de passe
        if (password !== passwordConfirmation) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const response = await api.post("/register", {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });

            const data = response.data;

            // sauvegarde
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // redirect
            navigate("/notes");

        } catch (err) {
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("Server unreachable. Make sure Laravel is running.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Create account</h2>
                <p className="auth-subtitle">Start taking notes today</p>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                        />
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? "Creating account..." : "Register"}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}