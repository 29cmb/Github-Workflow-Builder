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
        <div id="content">
            <p class="main">{data.message}</p>
            <p class="note"><i>Invites expire after 7 days</i></p>
            <a href="/dashboard">Return to Dashboard</a>
        </div>
    </>)
  }

  return (
    <>
      <h1>Invite</h1>
      <div></div>
    </>
  );
};

export default Invite;