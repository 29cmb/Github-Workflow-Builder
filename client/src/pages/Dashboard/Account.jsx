import { useState, useEffect, useRef } from "react";
import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";
import "../../styles/Account.css";
import Modal from "../../components/Modal";
import toast, { Toaster } from 'react-hot-toast';

function Account() {
    const [user, setUser] = useState({});
    const [profile, setProfile] = useState({});

    const [emailModalOpen, setEmailModalOpen] = useState(false);
    const [emailRevealed, revealEmail] = useState(false)
    const [usernameModalOpen, setUsernameModalOpen] = useState(false);
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const [bioModalOpen, setBioModalOpen] = useState(false);
    const [avatarModalOpen, setAvatarModalOpen] = useState(false);

    const [pfp, setPfp] = useState("");
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetch("/api/v1/user/credentials", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => {
            setUser(data.user);
        })
        .catch(error => console.error("Failed to fetch user:", error));

        fetch("/api/v1/user/info", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => response.json()).then(data => {
            setProfile(data.user);
            fetch(`/api/v1/user/${data.user.uid}/pfp`).then(data => {
                setPfp(data.url)
            })
        }).catch(error => console.error("Failed to fetch user:", error));        
    }, []);

    return (
        <>
            <Toaster />
            <Topbar buttons={[["/", "Home", false]]} />
            <Sidebar buttons={[
                ["/dashboard", "Projects", false],
                ["/dashboard/teams", "Teams", false],
                ["/dashboard/account", "Account", true]
            ]} />
            
            {emailModalOpen ? <Modal
                title="Change Email"
                inputs={[
                    {id: "new", type: "text", placeholder: "New Email"},
                ]}
                buttons={[
                    {id: "email", text: "Submit", sendArgs: true, style: "submit", submit: (email) => {
                        setEmailModalOpen(false);
                        fetch("/api/v1/user/update", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                email
                            })
                        }).then(r => r.json()).then(data => {
                            if(data.success === true){
                                toast("Your email has been changed successfully! Reloading...", {
                                    icon: "✅",
                                    style: {
                                        color: "white",
                                        backgroundColor: "#333",
                                        borderRadius: "10px",
                                        maxWidth: "60%",
                                    }
                                });
                                setTimeout(() => {
                                    window.location.reload()
                                }, 1500)
                            } else {
                                toast(`Something went wrong when trying to change your email: ${data.message}`, {
                                    icon: "❌",
                                    style: {
                                        color: "white",
                                        backgroundColor: "#333",
                                        borderRadius: "10px",
                                        maxWidth: "60%",
                                    }
                                });
                            }
                        })
                    }},
                    {id: "cancel", text: "Cancel", style: "cancel", submit: () => {
                        setEmailModalOpen(false);
                    }}
                ]}
             /> : null}
            {usernameModalOpen ? <Modal
                title="Change Username"
                inputs={[
                    {id: "new", type: "text", placeholder: "New Username"},
                ]}
                buttons={[
                    {id: "username", text: "Submit", sendArgs: true, style: "submit", submit: (username) => {
                        setUsernameModalOpen(false);
                        fetch("/api/v1/user/update", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                username
                            })
                        }).then(r => r.json()).then(data => {
                            if(data.success === true){
                                toast("Your username has been changed successfully! Reloading...", {
                                    icon: "✅",
                                    style: {
                                        color: "white",
                                        backgroundColor: "#333",
                                        borderRadius: "10px",
                                        maxWidth: "60%",
                                    }
                                });
                                setTimeout(() => {
                                    window.location.reload()
                                }, 1500)
                            } else {
                                toast(`Something went wrong when trying to change your username: ${data.message}`, {
                                    icon: "❌",
                                    style: {
                                        color: "white",
                                        backgroundColor: "#333",
                                        borderRadius: "10px",
                                        maxWidth: "60%",
                                    }
                                });
                            }
                        })
                    }},
                    {id: "cancel", text: "Cancel", style: "cancel", submit: () => {
                        setUsernameModalOpen(false);
                    }}
                ]}
             /> : null}
            {passwordModalOpen ? <Modal
                title="Change Password"
                inputs={[
                    {id: "old", type: "password", placeholder: "Old Password"},
                    {id: "new", type: "password", placeholder: "New Password"},
                    {id: "confNew", type: "password", placeholder: "Confirm New Password"},
                ]}
                buttons={[
                    {id: "email", text: "Submit", style: "submit", sendArgs: true, submit: (oldPass, newPass, confirmNewPass) => {
                        if(newPass !== confirmNewPass){
                            toast("Passwords do not match!", {
                                icon: "❌",
                                style: {
                                    color: "white",
                                    backgroundColor: "#333",
                                    borderRadius: "10px",
                                    maxWidth: "60%",
                                }
                            });
                            return;
                        }
                        
                        setPasswordModalOpen(false);
                        fetch("/api/v1/user/update", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                confirmation: oldPass,
                                password: newPass
                            })
                        }).then(r => r.json()).then(data => {
                            if(data.success === true){
                                toast("Your password has been changed successfully! Logging out...", {
                                    icon: "✅",
                                    style: {
                                        color: "white",
                                        backgroundColor: "#333",
                                        borderRadius: "10px",
                                        maxWidth: "60%",
                                    }
                                });
                                setTimeout(() => {
                                    window.location.href = "/login"
                                }, 1500)
                            } else {
                                toast(`Something went wrong when trying to change your password: ${data.message}`, {
                                    icon: "❌",
                                    style: {
                                        color: "white",
                                        backgroundColor: "#333",
                                        borderRadius: "10px",
                                        maxWidth: "60%",
                                    }
                                });
                            }
                        })
                    }},
                    {id: "cancel", text: "Cancel", style: "cancel", submit: () => {
                        setPasswordModalOpen(false);
                    }}
                ]}
             /> : null}
            {bioModalOpen ? <Modal
                title="Change Bio"
                inputs={[
                    {id: "new", type: "text", placeholder: "New Bio"},
                ]}
                buttons={[
                    {id: "bio", text: "Submit", style: "submit", sendArgs: true, submit: (bio) => {
                        setBioModalOpen(false);
                        fetch("/api/v1/user/profile/update", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                bio
                            })
                        }).then(r => r.json()).then(data => {
                            if(data.success === true){
                                toast("Your bio has been changed successfully! Reloading...", {
                                    icon: "✅",
                                    style: {
                                        color: "white",
                                        backgroundColor: "#333",
                                        borderRadius: "10px",
                                        maxWidth: "60%",
                                    }
                                });
                                setTimeout(() => {
                                    window.location.reload()
                                }, 1500)
                            } else {
                                toast(`Something went wrong when trying to change your bio: ${data.message}`, {
                                    icon: "❌",
                                    style: {
                                        color: "white",
                                        backgroundColor: "#333",
                                        borderRadius: "10px",
                                        maxWidth: "60%",
                                    }
                                });
                            }
                        })
                    }},
                    {id: "cancel", text: "Cancel", style: "cancel", submit: () => {
                        setBioModalOpen(false);
                    }}
                ]}
             /> : null}
            {avatarModalOpen ? <Modal
                title="Change Picture"
                inputs={[
                    { id: "newPfp", type: "file", placeholder: "New Profile Picture", ref: fileInputRef },
                ]}
                buttons={[
                    {
                        id: "pfp", text: "Submit", style: "submit", submit: () => {
                            setAvatarModalOpen(false);
                            const formData = new FormData();
                            formData.append("avatar", fileInputRef.current.files[0]);
                            
                            fetch("/api/v1/user/avatar/set", {
                                method: "POST",
                                body: formData,
                            }).then(r => r.json()).then(data => {
                                if (data.success === true) {
                                    toast("Your profile picture has been changed successfully! Reloading...", {
                                        icon: "✅",
                                        style: {
                                            color: "white",
                                            backgroundColor: "#333",
                                            borderRadius: "10px",
                                            maxWidth: "60%",
                                        }
                                    });
                                    setTimeout(() => {
                                        window.location.reload();
                                    }, 1500);
                                } else {
                                    toast(`Something went wrong when trying to change your profile picture: ${data.message}`, {
                                        icon: "❌",
                                        style: {
                                            color: "white",
                                            backgroundColor: "#333",
                                            borderRadius: "10px",
                                            maxWidth: "60%",
                                        }
                                    });
                                }
                            }).catch(error => {
                                console.log(error);
                            });
                        }
                    },
                    {
                        id: "cancel", text: "Cancel", style: "cancel", submit: () => {
                            setAvatarModalOpen(false);
                        }
                    }
                ]}
            /> : null}
            <div id="account">
                <h2 id="accountInfo">Account Information</h2>
                <p>Email</p>
                <p id="email">
                    {user?.email ? (emailRevealed ? user.email : `${user.email[0]}${'*'.repeat(user.email.indexOf('@') - 1)}${user.email.slice(user.email.indexOf('@'))}`) : ""}
                    <button onClick={() => {setEmailModalOpen(true)}}><u>Change</u></button>
                    <button onClick={() => {revealEmail(!emailRevealed)}}><u>Reveal</u></button>
                </p>
                <p>Username</p>
                <p id="username">
                    {user.username}
                    <button onClick={() => {setUsernameModalOpen(true)}}><u>Change</u></button>
                </p>
                <p>Password</p>
                <p id="password">
                    *************
                    <button onClick={() => {setPasswordModalOpen(true)}}><u>Change</u></button>
                </p>
                <h2 id="Appearance">Appearance</h2>
                <p>Bio</p>
                <p id="bio">
                    {profile.bio}
                    <button onClick={() => {setBioModalOpen(true)}}><u>Change</u></button>
                </p>
                <p>Profile Picture</p>
                <p className="pfp">
                    <img id="pfp" src={pfp} alt="Profile" />
                    <button onClick={() => {setAvatarModalOpen(true)}}><u>Change</u></button>
                </p>
               
            </div>
        </>
    );
}

export default Account;