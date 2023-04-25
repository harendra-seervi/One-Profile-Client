import { useEffect } from "react";

function Messaging() {

    useEffect(() => {
        fetchMessages();
    }, []);

    async function fetchMessages(){
        const token=localStorage.getItem("token");
        let result=await fetch('http://localhost:5000/messaging',{
            method:'post',
            headers:{
                Authorization:`Bearer ${token}`
            }
        });
        result=await result.json();
        console.log(result);
    }

    return (
        <h1>My Messages</h1>
    );
}
export default Messaging;