import "../styles/Project.css";

function Project({ name, owner, id }) {
    return (
        <div className="project">
            <img src="/assets/FullLogo.png" alt="Project"></img>
            <p id="name">{name}</p>
            <p id="owner">Owned by: <span className={owner.type}>{owner.name}</span></p>
            <button id="open" onClick={() => {window.location.href = `/projects/${id}`}}>Open</button>
        </div>
    )
}

export default Project;