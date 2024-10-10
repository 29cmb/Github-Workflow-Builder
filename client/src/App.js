import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Projects from './pages/Dashboard/Projects.jsx';
import Loading from './components/Loading';
import Teams from './pages/Dashboard/Teams.jsx';
import Account from './pages/Dashboard/Account.jsx';
import Invite from './pages/Misc/Invite.jsx';
import EditPage from "./pages/Projects/EditPage.jsx";
import ViewPage from './pages/Projects/ViewPage.jsx';
import ProjectGallery from './pages/Projects/ProjectGallery.jsx';
 
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/v1/user/info')
      .then(response => response.json())
      .then(data => {
        setIsLoading(false);
        setIsAuthenticated(data.success);
      })
      .catch(error => {
        console.error('Error fetching auth status:', error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} />
        <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={isAuthenticated ? <Projects /> : <Navigate to="/login" replace />} />
        <Route path="/dashboard/teams" element={isAuthenticated ? <Teams /> : <Navigate to="/login" replace />} />
        <Route path="/dashboard/account" element={isAuthenticated ? <Account /> : <Navigate to="/login" replace />} />
        <Route path="/invite/:id" element={isAuthenticated ? <Invite /> : <Navigate to="/login" />} />
        <Route path="/projects/:pid" element={<ProjectWrapper isAuthenticated={isAuthenticated} />} />
        <Route path="/projects/:pid/view" element={<ViewWrapper/>}></Route>
      </Routes>
    </Router>
  );
}

function ProjectWrapper({ isAuthenticated }) {
  const { pid } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetch(`/api/v1/project/${pid}/checkEdit`)
        .then(r => r.json())
        .then(data => {
          setIsLoading(false);
          setCanEdit(data.success);
        })
        .catch(error => {
          console.error('Error checking edit permission:', error);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [pid, isAuthenticated]);

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return canEdit ? <EditPage id={pid} /> : <Navigate to={`/projects/${pid}/view`}></Navigate>;
}

function ViewWrapper(){
  const id = useParams().pid;
  const [isLoading, setIsLoading] = useState(true);
  const [canView, setCanView] = useState(false);

  useEffect(() => {
    fetch(`/api/v1/project/${id}/canView`)
      .then(r => r.json())
      .then(data => {
        setIsLoading(false);
        setCanView(data.success);
      })
      .catch(error => {
        console.error('Error checking view permission:', error);
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return <Loading />;
  }

  return canView ? <ViewPage id={id} /> : <Navigate to="/dashboard" replace />;
}

export default App;