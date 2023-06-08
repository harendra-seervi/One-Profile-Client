import { useState } from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Navigate, useNavigate } from 'react-router-dom';
// css is same as we did in register so here we will not update any css

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const navigate = useNavigate();
    async function submit_login() {
        if (email != "" && password != "") {
            setErr(false);
            let result=await fetch("http://localhost:5000/login",{
                method:'post', 
                body:JSON.stringify({email,password}),
                headers:{
                    'Content-Type':'application/json'
                }
            })
            result=await result.json();
            // console.log(result);
            if(result.auth){
                localStorage.setItem('username',JSON.stringify(result.username));
                localStorage.setItem('token',JSON.stringify(result.auth));
                localStorage.setItem("currentPage",1);
                navigate('/');
            }
            else{
                setErr(true);
            }
        }
        else {
            setErr(true);
        }
    }
    return (
        <div className="register-form login-form">
            <div className="reg-card login-card">

                <h1 className="reg-heading">Login</h1>

                <TextField onChange={(data) => { setEmail(data.target.value) }} style={{ margin: "15px", marginTop: "0px" }} label="E-mail*" variant="standard" type="email" />

                <TextField onChange={(data) => { setPassword(data.target.value) }} style={{ margin: "15px" }} label="Password*" variant="standard" type="password" />

                <Button onClick={submit_login} style={{ marginTop: "30px", width: "95%", left: "15px" }} variant="contained">Login</Button>
                {
                    err ? <p className='note'>Please enter correct E-mail and Password</p>
                        : null
                }
            </div>
        </div>
    );
}

export default Login;