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
                {inputs.map((input, index) => {
                    return (() => {
                        switch(input.type) {
                            case "combobox":
                                return (
                                    <select id={input.id} defaultValue={input.default || input.options[0]}>
                                        {input.options.map((option, index) => (
                                            <option value={option} key={index}>{option}</option>
                                        ))}
                                    </select>
                                );
                            default:
                                return (
                                    <input key={index} id={input.id} class="modalInput" type={input.type} disabled={input.disabled || false} placeholder={input.placeholder} ref={input.ref || null}/>
                                );
                        }
                    })();
                })}
                {buttons.map((button, index) => (
                    <button
                        key={index}
                        id="modalButton"
                        onClick={() => {
                            button.sendArgs === true ? submit(button) : button.submit();
                        }}
                        className={button.style}
                    >
                        {button.text}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default Modal;