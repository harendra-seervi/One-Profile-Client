import "./registerstyle.css";
import { useState, useMemo, useEffect } from 'react'
import Select from 'react-select'
import countryList from 'react-select-country-list'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import * as React from 'react';

function Register() {
    const [value, setValue] = useState('');
    const options = useMemo(() => countryList().getData(), [])
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cPassword, setCPassword] = useState("");
    const [opusername, setUserName] = useState("");
    const [country, setCountry] = useState("");
    const [cf, setCfHandle] = useState("");
    const [cc, setCCHandle] = useState("");
    const [at, setATHandle] = useState("");
    const [hr, setHRHandle] = useState("");
    const [sp, setSPHandle] = useState("");
    const [isValidNameEmail, setIsValidNameEmail] = useState(true);
    const [isExist, setIsExist] = useState(false);
    const [passMatch, setPassMatch] = useState(true);
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(false);
    
    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });
    
    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };
    const changeHandler = value => {
        //country select option
        setValue(value)
        setCountry(value.label);
    }
    useEffect(() => {
        if (localStorage.getItem("user")) {
            localStorage.setItem("currentPage", 1);
            navigate("/");
        }
    })
    
    
    
    async function submit() {
        //Form Validation
        //checking userExist or not with op username
        let findUser = await fetch(`http://localhost:5000/register/${opusername}`);
        if (name.length == 0 || email.length == 0) {
            setIsValidNameEmail(false);
        }
        else if ((password != cPassword) || password.length == 0) {
            setIsValidNameEmail(true);
            setIsExist(false);
            setPassMatch(false);
        }
        else if (opusername.length == 0) {
            setIsValidNameEmail(true);
            setIsExist(true);
            setPassMatch(true);
        }
        else if (opusername.length > 0) {
            findUser = await findUser.json();
            if (!findUser) {
                setIsExist(true);
            }
            else {
                setIsExist(false);
                setPassMatch(true);
                setPassMatch(true);
                // Valid form , Here we going to enter data into Database:- 
                let result = await fetch('http://localhost:5000/register', {
                    method: 'post',
                    body: JSON.stringify({ name, opusername, email, password, country, cf, cc, sp, at, hr }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                result = await result.json();
                localStorage.setItem("currentPage", 5);
                // localStorage.setItem("user",JSON.stringify(result));
                handleClick();
                setTimeout(() => {
                    navigate("/login");
                    
                }, 2000);
            }
        }
    }
    
    
    return (
        <div className="register-form">
            <div className="reg-card">

                <h1 className="reg-heading">Register</h1>

                <TextField onChange={(e) => { setName(e.target.value) }} style={{ margin: "15px", marginTop: "0px" }} label="Full Name*" variant="standard" />

                <TextField onChange={(e) => { setEmail(e.target.value) }} style={{ margin: "15px" }} label="E-mail*" variant="standard" type="email" />

                <TextField onChange={(e) => { setPassword(e.target.value) }} style={{ margin: "15px" }} label="Password*" variant="standard" type="password" />

                <TextField onChange={(e) => { setCPassword(e.target.value) }} style={{ margin: "15px" }} label="Confirm Password*" variant="standard" type="password" />

                <TextField onChange={(e) => { setUserName(e.target.value) }} style={{ margin: "15px" }} label="One Profile Username (Unique)*" variant="standard" />

                <Select placeholder="Select Country" className="country-select" options={options} value={value} onChange={changeHandler} />

                <TextField onChange={(e) => { setCfHandle(e.target.value) }} style={{ margin: "15px" }} label="CodeForces Handle" variant="standard" />

                <TextField onChange={(e) => { setCCHandle(e.target.value) }} style={{ margin: "15px" }} label="CodeChef Handle" variant="standard" />

                <TextField onChange={(e) => { setSPHandle(e.target.value) }} style={{ margin: "15px" }} label="Spoj Handle" variant="standard" />

                <TextField onChange={(e) => { setATHandle(e.target.value) }} style={{ margin: "15px" }} label="AtCoder Handle" variant="standard" />

                <TextField onChange={(e) => { setHRHandle(e.target.value) }} style={{ margin: "15px" }} label="HackerRank Handle" variant="standard" />

                <Stack spacing={2} sx={{ width: '100%' }}>
                    <Button onClick={submit} style={{ marginTop: "30px", width: "95%", left: "15px" }} variant="contained" >
                        SignUp
                    </Button>
                   
                    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                            Register success! Enter same E-mail and password to login
                        </Alert>
                    </Snackbar>
                </Stack>
                {
                    !isValidNameEmail ? <p className="note">* Please check Name or E-mail</p> : null
                }
                {
                    isExist ? <p className="note">* Incorrect OPusername OR OPusername already exist please provide diffrent username</p> : null
                }
                {
                    !passMatch ? <p className="note">*Incorrect Password OR Password is not matched</p> : null
                }
            </div>
        </div>
    );
}
export default Register;
