import React from "react";
import "../styles/Form.css";

function Form({ inputs, subtext, buttonData }) {
    const submit = () => {
        var values = inputs.map(input => document.getElementById(input.id).value)
        buttonData[1](document.getElementById("note"), ...values)
    }
    return (
        <div id="formContainer">
            {inputs.map((input, index) => (
                <div id={index}>
                    <input id={input.id} type={input.type} placeholder={input.placeholder} />
                    <br />
                </div>
            ))}
            <p>{subtext}</p>
            <p id="note"></p>
            <button onClick={submit}>{buttonData[0]}</button>
            <br/>
            
        </div>
    )
}

export default Form;