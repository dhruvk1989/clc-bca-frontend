import React, { useState } from 'react';
import { Link, Navigate, json } from 'react-router-dom';

function Register() {

    document.title = 'Register!';

    const [jwt, setJwt] = useState(null);

    const handleSubmit = async(event) => {
        event.preventDefault();
        const payload = {
            "email": email,
            "name": name,
            "skills": skillList,
            "skillsToLearn": toLearnList,
            "password": password
        }
        const response = await fetch('http://localhost:8200/auth/addNewUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        if(response.ok){
            const data = await response.text();
            console.log(data);
            
            if(data === 'User Added Successfully'){
                console.log('alright gear up');
                const jwtPayload = {
                    "username": email,
                    "password": password
                }
                const jwtResponse = await fetch('http://localhost:8200/auth/generateToken', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(jwtPayload)
                });

                if(jwtResponse.ok){
                    const jwtData = await jwtResponse.text();
                    console.log(jwtData);
                    const responseData = JSON.parse(jwtData);
                    if(responseData.jwt.startsWith('e')){
                        localStorage.setItem('jwt', responseData.jwt); // Store JWT in localStorage (optional)
                        setJwt(responseData.jwt);
                    }
                }else{
                    console.log('error' + response.statusText + " " + response.text());
                }
            }
        }else{
            console.log('error' + response.statusText + " " + response.text());
        }
    }

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [skillList, setSkillList] = useState([]);
    const [toLearnList, setToLearnList] = useState([]);
    var error1 = "";

    var skills = ['Please Select','Java', 'Python', 'Data Science', 'Machine Learning', 'Android', 'iOS']

    var skillsToLearn = ['Please Select','Java', 'Python', 'Data Science', 'Machine Learning', 'Android', 'iOS']

    if(localStorage.getItem('jwt') !== null){
        console.log('i;m here lets go');
        return <Navigate to="/" />;
    }else{
        return (

            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <h2 className='text-center font-bold text-gray-900 text-3xl'>
                            Register!
                        </h2>
                        <input type='text'
                            id='name'
                            name='name'
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder='Name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input type='text'
                            id='email'
                            name='email'
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input type='password'
                            id='password'
                            name='password'
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {/* SKILLS THAT I KNOW */}
                        <p>Skills</p>
                        <select className='border border-gray-300 rounded-md p-1' 
                            onChange={(e) => {
                            console.log(e.target.value === 'Please Select');
                            if(!(e.target.value === 'Please Select')){
                                if(!skillList.includes(e.target.value)){
                                    if(!toLearnList.includes(e.target.value)){
                                        setSkillList([...skillList, e.target.value]);   
                                    }
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


                        {/* SKILLS THAT I DON'T KNOW */}

                        <p>Skills to Learn</p>
                        <select className='border border-gray-300 rounded-md p-1' 
                            onChange={(e) => {
                            console.log(e.target.value === 'Please Select');
                            if(!(e.target.value === 'Please Select')){
                                if(!toLearnList.includes(e.target.value)){
                                    if(!skillList.includes(e.target.value)){
                                        setToLearnList([...toLearnList, e.target.value]);
                                    }                           
                                }
                                console.log(toLearnList)
                            }
                        }}>
                            {skillsToLearn.map((skill, index) => (
                                <option key={index} value={skill}>{skill}</option>
                            ))}
                        </select>
                        <div className='flex-wrap gap-2 mt-4 flex'>
                            {toLearnList.map((skill, index) => (
                                <span key={index} className='bg-gray-200 hover:bg-gray-300 rounded-full px-4 py-2 text-sm font-semibold text-gray-700'>
                                    {skill}
                                    <button className='ml-2 rounded-full bg-gray-300 pl-1 pr-1'
                                    onClick={
                                        () => setToLearnList(toLearnList.filter((s) => s !== skill))
                                    }>
                                        x
                                    </button>
                                </span>
                            ))}
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <Link to="/">Sign up!</Link>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        )
    }

}

export default Register;