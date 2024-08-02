async function getUserID(){
    var user = null
    await fetch("/api/v1/user/info").then(response => response.json()).then(data => {
        console.log(data)
        user = data.uid
    })
    return user
}

async function getUserInformation(){
    const uid = await getUserID()
    if(uid == null) return null
    var user = null
    await fetch("/api/v1/user/get", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            uid
        })
    }).then(response => response.json()).then(data => {
        console.log(data)
        user = data.user
    })
    return user
}
