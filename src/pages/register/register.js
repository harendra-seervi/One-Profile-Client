import "./registerstyle.css";
import { useState, useMemo, useEffect } from 'react'
import Select from 'react-select'
import countryList from 'react-select-country-list'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate, Link } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import * as React from 'react';

// API base URL — use localhost during development
const API_BASE = process.env.NODE_ENV === 'production'
    ? 'https://one-profile-server.vercel.app'
    : 'http://localhost:5000';

function Register() {
    const [value, setValue] = useState('');
    const options = useMemo(() => countryList().getData(), [])
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cPassword, setCPassword] = useState("");
    const [opusername, setUserName] = useState("");
    const [country, setCountry] = useState("");
    const [codeforces, setCodeforcesHandle] = useState("");
    const [codechef, setCodechefHandle] = useState("");
    const [atcoder, setAtcoderHandle] = useState("");
    const [leetcode, setLeetcodeHandle] = useState("");
    const [isValidNameEmail, setIsValidNameEmail] = useState(true);
    const [isExist, setIsExist] = useState(false);
    const [passMatch, setPassMatch] = useState(true);
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const handleClick = () => setOpen(true);
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };

    const changeHandler = value => {
        setValue(value);
        setCountry(value.label);
    }

    useEffect(() => {
        if (localStorage.getItem("user")) {
            localStorage.setItem("currentPage", 1);
            navigate("/");
        }
    }, [navigate]);

    async function submit() {
        try {
            if (name.length === 0 || email.length === 0) {
                setIsValidNameEmail(false);
                return;
            }
            if ((password !== cPassword) || password.length === 0) {
                setIsValidNameEmail(true);
                setIsExist(false);
                setPassMatch(false);
                return;
            }
            if (opusername.length === 0) {
                setIsValidNameEmail(true);
                setIsExist(true);
                setPassMatch(true);
                return;
            }

            const availabilityResponse = await fetch(`${API_BASE}/api/auth/check-username/${opusername}`);
            const availabilityData = await availabilityResponse.json();

            if (!availabilityData.available) {
                setIsExist(true);
                return;
            }

            setIsExist(false);
            setPassMatch(true);

            const result = await fetch(`${API_BASE}/api/auth/register`, {
                method: 'POST',
                body: JSON.stringify({ 
                    name, 
                    opusername, 
                    email, 
                    password, 
                    country, 
                    codeforces, 
                    codechef, 
                    leetcode, 
                    atcoder 
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const resultData = await result.json();

            if (resultData.success) {
                localStorage.setItem("currentPage", 5);
                handleClick();
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            } else {
                setIsValidNameEmail(false);
            }
        } catch (error) {
            console.error('Registration error:', error);
            setIsValidNameEmail(false);
        }
    }

    return (
        <div className="register-form">
            <div className="auth-card">
                <div className="auth-brand">
                    <span className="auth-badge">OneProfile</span>
                    <h2>Build your coding identity.</h2>
                    <p>
                        Track your competitive programming ratings across Codeforces, CodeChef, LeetCode,
                        and AtCoder in one polished profile.</p>

                    <div className="auth-features">
                        <div className="auth-feature">
                            <span className="auth-feature-dot" />
                            One dashboard for all platforms
                        </div>
                        <div className="auth-feature">
                            <span className="auth-feature-dot" />
                            Live rating tracking and ranking
                        </div>
                        <div className="auth-feature">
                            <span className="auth-feature-dot" />
                            Share your profile with confidence
                        </div>
                    </div>
                </div>

                <div className="auth-form-panel">
                    <div className="auth-header">
                        <span className="auth-eyebrow">Welcome</span>
                        <h1 className="reg-heading">Create account</h1>
                        <p className="auth-subtitle">Set up your profile and start tracking your ratings.</p>
                    </div>

                    <div className="auth-fields">
                        <div className="auth-row">
                            <TextField
                                className="auth-field"
                                onChange={(e) => setName(e.target.value)}
                                label="Full Name*"
                                variant="outlined"
                            />
                            <TextField
                                className="auth-field"
                                onChange={(e) => setEmail(e.target.value)}
                                label="E-mail*"
                                variant="outlined"
                                type="email"
                            />
                        </div>

                        <div className="auth-row">
                            <TextField
                                className="auth-field"
                                onChange={(e) => setPassword(e.target.value)}
                                label="Password*"
                                variant="outlined"
                                type="password"
                            />
                            <TextField
                                className="auth-field"
                                onChange={(e) => setCPassword(e.target.value)}
                                label="Confirm Password*"
                                variant="outlined"
                                type="password"
                            />
                        </div>

                        <TextField
                            className="auth-field"
                            onChange={(e) => setUserName(e.target.value)}
                            label="OneProfile Username*"
                            variant="outlined"
                        />

                        <Select
                            placeholder="Select Country"
                            className="country-select"
                            options={options}
                            value={value}
                            onChange={changeHandler}
                        />

                        <div className="auth-row">
                            <TextField
                                className="auth-field"
                                onChange={(e) => setCodeforcesHandle(e.target.value)}
                                label="CodeForces Handle"
                                variant="outlined"
                            />
                            <TextField
                                className="auth-field"
                                onChange={(e) => setCodechefHandle(e.target.value)}
                                label="CodeChef Handle"
                                variant="outlined"
                            />
                        </div>

                        <div className="auth-row">
                            <TextField
                                className="auth-field"
                                onChange={(e) => setLeetcodeHandle(e.target.value)}
                                label="LeetCode Handle"
                                variant="outlined"
                            />
                            <TextField
                                className="auth-field"
                                onChange={(e) => setAtcoderHandle(e.target.value)}
                                label="AtCoder Handle"
                                variant="outlined"
                            />
                        </div>

                        <Stack spacing={2} sx={{ width: '100%' }}>
                            <Button onClick={submit} className="auth-submit" variant="contained">
                                Sign up
                            </Button>

                            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                                    Registration successful! Redirecting to login...
                                </Alert>
                            </Snackbar>
                        </Stack>

                        {!isValidNameEmail && <p className="note">* Please check your name or email</p>}
                        {isExist && <p className="note">* Username is invalid or already exists</p>}
                        {!passMatch && <p className="note">* Password does not match or is empty</p>}

                        <div className="auth-footer">
                            Already have an account? <Link to="/login">Log in</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
