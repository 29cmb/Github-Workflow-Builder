function login(){
    const username = document.getElementById("username")
    const password = document.getElementById("password")
    const note = document.getElementById("note")
    
    fetch("/api/v1/user/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username.value, password: password.value
        })
    }).then(response => response.json()).then(data => {
        if(data.success) return window.location.href = "/dashboard"
        note.innerHTML = data.message
    })
}