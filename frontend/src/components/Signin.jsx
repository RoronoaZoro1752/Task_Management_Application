import { Link, useNavigate } from "react-router-dom";
import axios from '../../api/axiosConfig';
import { useState } from "react";

export default function Signin() {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = e => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('/auth/login', credentials);
            alert("Login successful!")
            localStorage.setItem("token", res?.data?.token)
            const name = res.data.firstName
            localStorage.setItem("name", name)
            navigate('/')
        } catch (error) {
            alert(error.response?.data?.message || 'Login failed');
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            required
                            className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            required
                            className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex justify-center mb-2">
                        <p>Don't have an account?&nbsp;
                             <Link className="text-blue-400 underline" to="/signup">Sign Up</Link></p>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors hover:cursor-pointer"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}
