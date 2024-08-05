import React from "react";
import "../styles/Modal.css";

function Modal({ title, inputs, buttons }){
    const submit = (button) => {
        var values = inputs.map(input => document.getElementById(input.id).value)
        button.submit(...values)
    }
    return (
        <div id="modal">
            <div id="modalContent">
                <h1>{title}</h1>
                {inputs.map((input, index) => (
                    <input key={index} id={input.id} type={input.type} placeholder={input.placeholder} />
                ))}
                {buttons.map(button => {
                    switch(button.style){
                        case "submit":
                            return <button onClick={() => {submit(button)}} className={button.style}>{button.text}</button>;
                        case "cancel":
                            return <button onClick={() => button.submit()} className={button.style}>{button.text}</button>;
                        default:
                            return <button className={button.style}>{button.text}</button>;
                    }
                })}
            </div>
        </div>
    )
}

export default Modal;