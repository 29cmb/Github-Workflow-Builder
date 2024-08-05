import React from "react";
import "../styles/Modal.css";
import Dropdown from 'react-bootstrap/Dropdown';

function Modal({ title, inputs, button }){
    const submit = () => {
        var values = inputs.map(input => document.getElementById(input.id).value)
        button[1](...values)
    }
    return (
        <div id="modal">
            <div id="modalContent">
                <h1>{title}</h1>
                {inputs.map((input, index) => (
                    <input key={index} id={input.id} type={input.type} placeholder={input.placeholder} />
                ))}
                <button onClick={submit}>{button[0]}</button>
            </div>
        </div>
    )
}

export default Modal;