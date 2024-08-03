async function getUserInformation(){
    var user
    await fetch("/api/v1/user/info").then(response => response.json()).then(data => {
        console.log(data)
        user = data.user
    })
    return user
}
