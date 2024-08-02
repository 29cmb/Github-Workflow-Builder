function signup(){
    const email = document.getElementById("email")
    const username = document.getElementById("username")
    const password = document.getElementById("password")
    const note = document.getElementById("note")

    fetch("/api/v1/user/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email.value, username: username.value, password: password.value
        })
    }).then(response => response.json()).then(data => {
        console.log(data)
        note.innerHTML = data.message
    })
}