import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '../../components/Loading';
import "../../styles/Invite.css"

const Invite = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/v1/teams/invite/${id}`)
      .then(r => r.json())
      .then(data => {
        setData(data);
      })
      .catch((err) => {
        console.log(err)
        setError(true)
    });
  }, [id]);

  if (error) {
    return (
      <>
        <h1>Error</h1>
        <p>Internal Server Error</p>
      </>
    );
  }

  if (!data) {
    return (<Loading/>)
  }

  if(data.success === false){
    return (<>
        <h1>Error</h1>
        <div id="content" class="error">
            <p class="main">{data.message}</p>
            <p className="note"><i>
                {(() => {
                  switch (data.code) {
                    case 1:
                      return "Accepted invites are deleted";
                    case 2:
                      return "Invites expire after 7 days";
                    case 3:
                      return "Log in with a different account to accept this invite";
                    default:
                      return "This might be internal, It's not your fault!";
                  }
                })()}
            </i></p>
            <a href="/dashboard">Return to Dashboard</a>
        </div>
    </>)
  }

  return (
    <>
      <h1>Invite</h1>
      <div id="content">
            <p class="main">You have been invited to the<br/>{data.team.name}<br/>team</p>
            <p class="note"><i>Invites expire after 7 days, be quick!</i></p>
            <a href="/dashboard">Return to Dashboard</a>
            <button className='submit'>Accept</button>
        </div>
    </>
  );
};

export default Invite;