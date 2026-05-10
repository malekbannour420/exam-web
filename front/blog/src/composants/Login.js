import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import "../styles.css";

export default function Login() {
    // État du formulaire
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    // Traiter la connexion
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Envoyer les identifiants au serveur
            const response = await api.post("/login", { email, password });
            const data = response.data;

            // Sauvegarder le token et les infos utilisateur
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            
            // Rediriger vers la page des notes
            navigate("/notes");
        } catch (err) {
            // Afficher l'erreur
            setError(err.response?.data?.message || "Connexion échouée. Vérifiez vos identifiants.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Bienvenue</h2>
                <p className="auth-subtitle">Connectez-vous à votre compte</p>

                {/* Afficher l'erreur si elle existe */}
                {error && <div className="alert alert-error">{error}</div>}

                {/* Formulaire de connexion */}
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="votre@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Mot de passe</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? "Connexion..." : "Se connecter"}
                    </button>
                </form>

                {/* Lien vers l'inscription */}
                <p className="auth-footer">
                    Pas de compte? <Link to="/register">S'inscrire</Link>
                </p>
            </div>
        </div>
    );
}