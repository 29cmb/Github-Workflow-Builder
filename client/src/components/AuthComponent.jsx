import {useState, useEffect} from "react";

function AuthComponent({ auth, component }){
    const [authorized, setAuthorized] = useState(false)
    useEffect(() => {
        fetch('/api/v1/user/info')
        .then(response => response.json())
        .then(data => {
            setAuthorized(data.success);
        })
        .catch(error => {
            console.error('Error fetching auth status:', error);
        });
    }, [])

    if(auth === true && authorized === true){
        return component
    } else if(auth === false && authorized === false){
        return component
    }
}

export default AuthComponent;