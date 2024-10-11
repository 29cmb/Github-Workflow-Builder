import "../styles/Project.css";

function Project({ name, description, owner, id, gallery }) {
    return (
        <div className="project" style={gallery ? {"width": "425px"} : {}}>
            <img src="/assets/FullLogo.png" alt="Project" />
            <p id="name">{name}</p>
            <p id="owner">Owned by: <span className={owner.type}>{owner.name}</span></p>
            <p id="description"><i>{description}</i></p>
            <button id="open" onClick={() => {window.location.href = (gallery === true ? `/projects/${id}/view` : `/projects/${id}`)}}>Open</button>
        </div>
    )
}

export default Project;