import React, { useEffect, useState } from 'react';
import { Link, json } from 'react-router-dom';
import TopBar from '../components/TopBar';
import FootBar from '../components/FootBar';

function ProjectList() {

    document.title = 'Issues';

    const [joinedProjectsVisible, setJoinedProjectsVisible] = useState(false);
    const [myProjectsVisible, setMyProjectsVisible] = useState(false);
    const [projectList, setProjectList] = useState([]);
    const [joinedProjects, setJoinedProjects] = useState([]);

    const fetchData = async () => {
        const response = await fetch(`http://localhost:8200/project/myProjects`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            },
        });
        const data = await response.json();
        setProjectList(data.createdProjects);
        setJoinedProjects(data.joinedProject);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return(
        <div className="bg-gray-50 h-screen">
            <TopBar activePage="Issues"/>
            <div className="flex justify-center mt-5">
                <div className="flex flex-col w-4/5 mt-10">
                    <div className="flex flex-row border-b-2 p-4 cursor-pointer" onClick={() => setMyProjectsVisible(!myProjectsVisible)}>
                        My Projects
                        <span className={`${myProjectsVisible ? 'rotate-180' : ''} transition duration-300 transform`} >▾</span>
                    </div>
                    {myProjectsVisible && (
                        <div className="flex flex-col mt-4">
                            {/* Fetch project details from projectList array */}
                            {projectList.map((project) => (
                                <div key={project.projectId}>
                                    <Link to={`/projects/${project.projectId}`}>
                                        <div className="bg-white shadow-md rounded-lg p-4 m-4">
                                            <h1 className="text-lg">{project.title}</h1>
                                            <p className="text-gray-600">{project.projectOwner.name }</p>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="flex flex-row border-b-2 p-4 cursor-pointer" onClick={() => setJoinedProjectsVisible(!joinedProjectsVisible)}>
                        Joined Projects
                        <span className={`${joinedProjectsVisible ? 'rotate-180' : ''} transition duration-300 transform`} >▾</span>
                    </div>
                    {joinedProjectsVisible && (
                        <div className="flex flex-col mt-4">
                            {/* Fetch project details from joinedProjects array */}
                            {joinedProjects.map((project) => (
                                <div key={project.projectId}>
                                    <Link to={`/projects/${project.id}`}>
                                        <div className="bg-white shadow-md rounded-lg p-4 m-4">
                                            <h1 className="text-lg">{project.title}</h1>
                                            <p className="text-gray-600">{project.description}</p>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <FootBar    />
        </div>
    )

}

export default ProjectList;