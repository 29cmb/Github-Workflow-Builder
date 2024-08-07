import React from "react";
import "../styles/Modal.css";
// eslint-disable-next-line no-unused-vars
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'

function Modal({ title, inputs, buttons }){
    const submit = (button) => {
        var values = inputs.map(input => document.getElementById(input.id).value)
        button.submit(...values)
    }
    return (
        <div id="modal">
            <div id="modalContent">
                <h1>{title}</h1>
                {inputs.map((input, index) => {
                    return (() => {
                        switch(input.type) {
                            case "combobox":
                                return (
                                    <></> // TODO: use combobox
                                );
                            default:
                                return (
                                    <input key={index} id={input.id} type={input.type} disabled={input.disabled || false} placeholder={input.placeholder} ref={input.ref || null}/>
                                );
                        }
                    })();
                })}
                {buttons.map(button => {
                    switch(button.style){
                        case "submit":
                            return <button onClick={() => {submit(button)}} className={button.style}>{button.text}</button>;
                        default:
                            return <button onClick={() => button.submit()} className={button.style}>{button.text}</button>;
                    }
                })}
            </div>
        </div>
    )
}

export default Modal;