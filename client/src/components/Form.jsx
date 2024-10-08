import "../styles/Form.css";

function Form({ inputs, subtext, buttonData }) {
    const submit = () => {
        const values = inputs.map(input => document.getElementById(input.id).value)
        buttonData[1](document.getElementById("note"), ...values)
    }
    return (
        <div id="formContainer">
            {inputs.map((input, index) => (
                <div key={index}>
                    <input key={index} id={input.id} type={input.type} placeholder={input.placeholder} />
                    <br />
                </div>
            ))}
            <p>{subtext}</p>
            <p id="note" />
            <button onClick={submit}>{buttonData[0]}</button>
            <br/>
        </div>
    )
}

export default Form;