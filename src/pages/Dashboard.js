import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import FootBar from "../components/FootBar";
import { useState } from "react";
import { useEffect } from "react";

function Dashboard({isAuthenticated}) {

    document.title = 'Dashboard';

    const [projectList, setProjectList] = useState([]);
    const jwt = localStorage.getItem('jwt');
    const user = localStorage.getItem('user');

    const fetchData = async () => {
        const response = await fetch(`http://localhost:8200/project`, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
        const data = await response.json();
        setProjectList(data.body);
    };

    useEffect(() => {
        console.log(localStorage.getItem('jwt'));
        fetchData();
    }, []);

    // const projectListHtml = projectList.map((project) => (
    //     <div key={project.id}>
    //         <Link to={`/projects/${project.id}`}>
    //             <div className="bg-white shadow-md rounded-lg p-8 m-4">
    //                 <h1 className="text-lg">{project.name}</h1>
    //                 <p className="text-gray-600">{project.description}</p>
    //             </div>
    //         </Link>
    //     </div>
    // ));

    console.log(isAuthenticated);

    if(isAuthenticated === true){
        console.log('ohk');
        return (
            <div className="bg-gray-100 h-screen">
            <TopBar activePage="Dashboard"/>
            <div className="flex justify-center">
                <div className="w-4/5 mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                    {projectList.map((project) => (
                        <Link 
                            to={{pathname : `/issues/${project.projectId}`,
                                query: {
                                    title: project.title,
                                    description : project.description,
                                    skills : project.skills,
                                    projectOwner : JSON.stringify(project.projectOwner)
                                }
                            }}
                            key={project.projectId}
                         >
                            <div className="mt-5 rounded-lg shadow-md p-4 bg-white hover:bg-gray-100 transition duration-150 ease-in-out">
                                <h2 className="text-lg font-bold">{project.title}</h2>
                                <p className="text-gray-600">{project.projectOwner.name}</p>
                                <p className="text-gray-600">{project.description.substring(0, 100) + (project.description.length > 100 ? '...' : '')}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <FootBar/>
        </div>
        )
    }else{
        return(
            <Navigate to="/login" />
        )

    }
}

export default Dashboard;