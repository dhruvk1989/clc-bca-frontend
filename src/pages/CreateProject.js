import React, { useState } from 'react'
import TopBar from '../components/TopBar'
import ReactQuill from 'react-quill';
import TextEditor from '../components/TextEditor';
import { Navigate } from 'react-router-dom';

function CreateProject() {

    var skills = ['Please Select','Java', 'Python', 'Data Science', 'Machine Learning', 'Android', 'iOS']
    const [skillList, setSkillList] = useState([]);
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [processed, setProcessed] = useState(false);

    function showDialog(message){
        const dialogContainer = document.createElement('div');
        dialogContainer.className = 'fixed top-0 right-0 left-0 z-10 justify-center items-center w-screen h-screen bg-gray-900 bg-opacity-50';
        const dialogBox = document.createElement('div');
        dialogBox.className = 'bg-white p-4 rounded-lg shadow-lg flex flex-col items-center justify-center';
        const messageText = document.createElement('p');
        messageText.textContent = message;
        dialogContainer.append(dialogBox);
        dialogBox.append(messageText);
        document.body.append(dialogContainer);
        setTimeout(() => {
            document.body.removeChild(dialogContainer);
        }, 2000);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const jwt = localStorage.getItem('jwt');
        const payload = {
            "title": title,
            "description": description,
            "skills": skillList.join(",")
        }
        const response = await fetch('http://localhost:8200/project', {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${jwt}`,
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(payload)
        });
        console.log(response.status);
        if(response.ok){
            const data = await response.text();
            console.log(data);
            setProcessed(true);
        }else{
            showDialog(response.status + " " + response.text());
            console.log('error' + response.statusText + " " + response.text());
        }
    }

    document.title = 'Create Issue';
    if(processed){
        return <Navigate to="/" />
    }else{
        return (
            <div className="bg-blue-50 h-screen">
                <TopBar activePage=""/>
                <div className="h-full flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-md p-8 w-1/2">
                        <h1 className="text-center text-3xl font-extrabold text-indigo-500">Create Issue</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700" htmlFor="name">
                                    Title
                                    <input value={title} onChange={(e) => setTitle(e.target.value)} maxlength="300" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Enter a short title (Max 300 characters)"/>
                                </label>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700" htmlFor="description">
                                    Description
                                    <textarea onChange={(e) => setDescription(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="description" rows="3" 
                                        placeholder='Enter description' value={description}>
                                    </textarea>
                                </label>
                            </div>
                            <div className='mb-4'>
                                <p className='mb-2'>Skills</p>
                                <select className='border border-gray-300 rounded-md p-1' 
                                    onChange={(e) => {
                                    console.log(e.target.value === 'Please Select');
                                    if(!(e.target.value === 'Please Select')){
                                        if(!skillList.includes(e.target.value)){
                                            setSkillList([...skillList, e.target.value]);  
                                        }
                                        console.log(skillList);
                                        }
                                    }}>
                                    {skills.map((skill, index) => (
                                        <option key={index} value={skill}>{skill}</option>
                                    ))}
                                </select>
                                <div className='flex-wrap gap-2 mt-4 flex'>
                                    {skillList.map((skill, index) => (
                                        <span key={index} className='bg-gray-200 hover:bg-gray-300 rounded-full px-4 py-2 text-sm font-semibold text-gray-700'>
                                            {skill}
                                        <button className='ml-2 rounded-full bg-gray-300 pl-1 pr-1'
                                            onClick={
                                                () => setSkillList(skillList.filter((s) => s !== skill))
                                            }>
                                            x
                                        </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded" type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default CreateProject
