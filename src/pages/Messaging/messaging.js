import React, { useEffect, useRef, useState } from 'react';
import { Layout, Avatar, Input, Tooltip, Image, message } from 'antd';
import './messaging.css';
import { json, useNavigate } from 'react-router-dom';
function Messaging() {
    const { Content } = Layout;
    const [messageStatus, setMessageStatus] = useState(0);
    const navigate = useNavigate();
    useEffect(() => {
        fetchMessages();
    }, [])
    function LogOutAndNavigateToHome() {
        setMessageStatus(0);
        localStorage.clear();
        navigate("/");
        localStorage.setItem("currentPage", 1);
    }
    async function fetchMessages() {
        let token = localStorage.getItem("token");
        token = token.substr(1,token.length-2); 
        if (!token) {
            LogOutAndNavigateToHome();
            return;
        }
        let result = await fetch('http://localhost:5000/messaging', {
            method: 'post',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (result.status == 500 || result.status == 406) {
            LogOutAndNavigateToHome();
            return 0;
        }
        else {
            setMessageStatus(1);
            result = await result.json();
            return 1;
        }
    }

    return (
        messageStatus == 1 ? < h1 > Messaging</h1 >
            : null
    );
}

export default Messaging;
