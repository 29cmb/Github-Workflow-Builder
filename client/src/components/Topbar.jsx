import React from "react";
import AuthComponent from "./AuthComponent"
import "../styles/Topbar.css";

function Topbar({ buttons }) {
    return (
        <div id="topbar">
            <img src="/assets/SmallLogoFull.png" alt="Overflow"></img>
            {buttons.map((b, index) => (
                (() => {
                    if (b[3] === undefined) {
                        return (
                            <button
                                key={index}
                                id="topbarBtn"
                                className={b[2] === true ? "green" : "regular"}
                                onClick={() => window.location.href = b[0]}
                            >
                                {b[1]}
                            </button>
                        );
                    } else {
                        return (
                            <AuthComponent
                                key={index}
                                component={
                                    <button
                                        id="topbarBtn"
                                        className={b[2] === true ? "green" : "regular"}
                                        onClick={() => window.location.href = b[0]}
                                    >
                                        {b[1]}
                                    </button>
                                }
                                auth={b[3]}
                            />
                        );
                    }
                })()
            ))}
             
        </div>
    );
}

export default Topbar;