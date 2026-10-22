import { useState } from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import '../register/registerstyle.css';

// API base URL — use same pattern as home
const API_BASE = process.env.NODE_ENV === 'production'
    ? 'https://one-profile-server.vercel.app'
    : 'http://localhost:5000';

const featureHighlights = [
    'Multi-platform Ratings on Single Page',
    'OneProfile Aggregated Rating',
    'Upcoming Contests',
    'User Comparator',
    'AI Problem Recommendation',
    'AI CP Roadmap (30/60/90 Days)',
    'AI Contest Coach',
    'AI Performance Analysis',
    'AI “Why Am I Stuck?”',
    'Achievements & Skill Badges',
    'Rating & Progress Analytics',
    'Skill / Problem Heatmap',
    'Global CP Skill Map',
    'Find Your CP Twin',
    'Mentor Match',
];

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState(false);
    const navigate = useNavigate();

    async function submit_login() {
        if (email !== "" && password !== "") {
            setErr(false);
            try {
                let result = await fetch(`${API_BASE}/api/auth/login`, {
                    method: 'POST', 
                    body: JSON.stringify({ email, password }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                result = await result.json();
                if (result.success && result.data) {
                    localStorage.setItem('username', JSON.stringify(result.data.opusername));
                    localStorage.setItem('token', JSON.stringify(result.data.token || 'logged-in'));
                    localStorage.setItem("currentPage", 1);
                    navigate('/');
                } else {
                    setErr(true);
                }
            } catch (error) {
                console.error('Login error:', error);
                setErr(true);
            }
        } else {
            setErr(true);
        }
    }

    return (
        <div className="register-form login-form">
            <div className="auth-card login-card">
                <div className="auth-brand">
                    <span className="auth-badge">Welcome back</span>
                    <h2>Track smarter.</h2>
                    <p>
                        View your coding performance, compare ratings, and keep your competitive programming profile updated.
                    </p>

                    <div className="auth-features">
                        <div className="auth-feature">
                            <span className="auth-feature-dot" />
                            Central profile dashboard
                        </div>
                        <div className="auth-feature">
                            <span className="auth-feature-dot" />
                            Multi-platform ratings
                        </div>
                        <div className="auth-feature">
                            <span className="auth-feature-dot" />
                            AI-powered CP growth
                        </div>
                    </div>

                    <div className="feature-grid">
                        {featureHighlights.map((item) => (
                            <span key={item} className="feature-pill">{item}</span>
                        ))}
                    </div>
                </div>

                <div className="auth-form-panel">
                    <div className="auth-header">
                        <span className="auth-eyebrow">Sign in</span>
                        <h1 className="reg-heading">Login</h1>
                        <p className="auth-subtitle">Use your account details to continue.</p>
                    </div>

                    <div className="auth-fields">
                        <TextField
                            className="auth-field"
                            onChange={(data) => setEmail(data.target.value)}
                            label="E-mail*"
                            variant="outlined"
                            type="email"
                        />

                        <TextField
                            className="auth-field"
                            onChange={(data) => setPassword(data.target.value)}
                            label="Password*"
                            variant="outlined"
                            type="password"
                        />

                        <Button onClick={submit_login} className="auth-submit" variant="contained">
                            Login
                        </Button>

                        {err && <p className='note'>Please enter a valid email and password</p>}

                        <div className="auth-footer">
                            New here? <Link to="/register">Create account</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;