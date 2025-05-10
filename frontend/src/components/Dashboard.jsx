
import React, { useState, useEffect } from "react";
import axios from '../../api/axiosConfig';
import {Link} from 'react-router-dom'

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]); // load users from backend
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dueDateFilter, setDueDateFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [stats, setStats] = useState([]);

  const name = localStorage.getItem("name")

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "Pending",
    assignedTo: "",
  });

  // Fetch tasks and users on mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const taskRes = await axios.get('/tasks');
        setTasks(taskRes.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const usersRes = await axios.get('/tasks/getallusers');
        // Convert users to needed format for dropdown e.g. {id: user._id, name: user.firstName + " " + user.lastName}
        const formattedUsers = usersRes?.data.map(user => ({
          id: user._id,
          name: `${user.firstName} ${user.lastName}`
        }));
        setUsers(formattedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }

    const fetchStats = async () =>{
        try {
            const userStats = await axios.get('/tasks/stats');
            setStats(userStats.data);
        } catch (error) {
           console.error("Error fetching users:", error); 
        }
    }

    fetchTasks();
    fetchUsers();
    fetchStats();
  }, [tasks]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskForm.title || !taskForm.description || !taskForm.assignedTo) {
      alert("Please fill all required fields");
      return;
    }

    try {
      if (editTaskId !== null) {
        // Update existing task
        const response = await axios.put(`/tasks/${editTaskId}`, {
          title: taskForm.title,
          description: taskForm.description,
          dueDate: taskForm.dueDate || null,
          status: taskForm.status,
          assignedTo: taskForm.assignedTo,
        });
        setTasks(tasks.map((t) => (t._id === editTaskId ? response.data : t)));
      } else {
        // Create new task
        const response = await axios.post('/tasks', {
          title: taskForm.title,
          description: taskForm.description,
          dueDate: taskForm.dueDate || null,
          status: taskForm.status,
          assignedTo: taskForm.assignedTo,
        });
        setTasks([response.data, ...tasks]);
      }
      setTaskForm({
        title: "",
        description: "",
        dueDate: "",
        status: "Pending",
        assignedTo: "",
      });
      setEditTaskId(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error saving task:", error);
      alert(error.response?.data?.message || "Error saving task");
    }
  };

  const handleEdit = (task) => {
    setTaskForm({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate ? task.dueDate.substr(0,10) : "",
      status: task.status,
      assignedTo: task.assignedTo._id || task.assignedTo, // sometimes assignedTo may be populated user object
    });
    setEditTaskId(task._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.delete(`/tasks/${id}`);
        setTasks(tasks.filter((t) => t._id !== id));
      } catch (error) {
        console.error("Error deleting task:", error);
        alert(error.response?.data?.message || "Error deleting task");
      }
    }
  };

  // Filter overdue based on backend data
//   const overdueTasks = tasks.filter(
//     (task) => new Date(task.dueDate) < new Date() && task.status !== "Done"
//   );

  // Filters for UI
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? task.status === statusFilter : true;
    const matchesDueDate = dueDateFilter
      ? task.dueDate && task.dueDate.substr(0,10) === dueDateFilter
      : true;
    return matchesSearch && matchesStatus && matchesDueDate;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Task Dashboard</h1>
        <p className="text-center mb-4">Hello {name}</p>
      <div className="flex justify-center mb-6 gap-4">
        <button
          onClick={() => {
            setShowForm(true);
            setEditTaskId(null);
            setTaskForm({
              title: "",
              description: "",
              dueDate: "",
              status: "Pending",
              assignedTo: "",
            });
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Create Task
        </button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
            <Link to={'/'}>Back</Link>
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {editTaskId ? "Edit Task" : "New Task"}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Task title"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    placeholder="Task description"
                    value={taskForm.description}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, description: e.target.value })
                    }
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    rows="4"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={taskForm.dueDate}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, dueDate: e.target.value })
                    }
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={taskForm.status}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, status: e.target.value })
                    }
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Done</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assign To *
                  </label>
                  <select
                    value={taskForm.assignedTo}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, assignedTo: e.target.value })
                    }
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select assignee</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                  >
                    {editTaskId ? "Update Task" : "Create Task"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded shadow">
          <p className="font-medium">Tasks Assigned</p>
          <p className="text-2xl">
            {
                stats.assignedTasks ? stats.assignedTasks : 0
            }
          </p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <p className="font-medium">Tasks Created</p>
          <p className="text-2xl">
            {
                stats.createdTasks ? stats.createdTasks : 0
            }
          </p>
        </div>
        <div className="bg-red-100 p-4 rounded shadow">
          <p className="font-medium">Overdue Tasks</p>
          <p className="text-2xl">
            {
                stats.overdueTasks ? stats.overdueTasks : 0
            }
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by title or description"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Statuses</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>
        <input
          type="date"
          value={dueDateFilter}
          onChange={(e) => setDueDateFilter(e.target.value)}
          className="p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Due Date</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Assigned To</th>
              <th className="p-3 text-left">Created By</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task._id} className="border-t hover:bg-gray-50">
                <td className="p-3">{task.title}</td>
                <td className="p-3">{task.description}</td>
                <td className="p-3">{task.dueDate ? task.dueDate.substr(0,10) : ""}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      task.status === "Done"
                        ? "bg-green-100 text-green-800"
                        : task.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="p-3">{task.assignedTo?.name || (typeof task.assignedTo ==="object"? `${task.assignedTo.firstName} ${task.assignedTo.lastName}` : "Unknown")}</td>
                <td className="p-3">{task.createdBy?.name || (typeof task.createdBy ==="object"? `${task.createdBy.firstName} ${task.createdBy.lastName}` : "Unknown")}</td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => handleEdit(task)}
                    className="bg-yellow-400 px-3 py-1 text-sm rounded hover:bg-yellow-500 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="bg-red-500 px-3 py-1 text-sm text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredTasks.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">
                  No tasks found. Create a new task to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
