import React, { useEffect, useState } from 'react';
import API from '../api';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'Todo',
        assigned_to: '',
        due_date: ''
    });
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const fetchComments = async (taskId) => {
        try {
            const res = await API.get(`/comments/${taskId}`);
            setComments(res.data.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            await API.post('/comments', {
                task_id: currentTask.id,
                user_id: user.id,
                content: newComment
            });
            setNewComment('');
            fetchComments(currentTask.id);
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    useEffect(() => {
        fetchTasks();
        fetchEmployees();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await API.get('/tasks');
            setTasks(res.data.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const fetchEmployees = async () => {
        try {
            const res = await API.get('/employees');
            setEmployees(res.data.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await API.delete(`/tasks/${id}`);
                fetchTasks();
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    };

    const handleOpenModal = (task = null) => {
        if (task) {
            setCurrentTask(task);
            setFormData({
                title: task.title,
                description: task.description,
                status: task.status,
                assigned_to: task.assigned_to || '',
                due_date: task.due_date || ''
            });
            fetchComments(task.id);
        } else {
            setCurrentTask(null);
            setComments([]);
            setFormData({
                title: '',
                description: '',
                status: 'Todo',
                assigned_to: '',
                due_date: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentTask) {
                await API.put(`/tasks/${currentTask.id}`, formData);
            } else {
                await API.post('/tasks', formData);
            }
            setIsModalOpen(false);
            fetchTasks();
        } catch (error) {
            console.error('Error saving task:', error);
            alert('Error saving task. Please check inputs.');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Done': return 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-600/20';
            case 'In Progress': return 'bg-amber-100 text-amber-700 ring-1 ring-amber-600/20';
            default: return 'bg-slate-100 text-slate-700 ring-1 ring-slate-600/20';
        }
    };

    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const isAdmin = user?.role === 'Admin';

    const filteredTasks = isAdmin
        ? tasks
        : tasks.filter(task => task.assigned_to === user?.id);

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Tasks</h1>
                    <p className="text-slate-500 mt-1">Track and manage project tasks</p>
                </div>
                {isAdmin && (
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl flex items-center space-x-2 shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-0.5"
                    >
                        <Plus className="w-5 h-5" />
                        <span className="font-medium">Add Task</span>
                    </button>
                )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Assigned To</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Due Date</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {filteredTasks.map((task) => (
                            <tr key={task.id} className="hover:bg-slate-50/80 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-slate-900">{task.title}</div>
                                    <div className="text-sm text-slate-500 mt-0.5">{task.description}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {task.assigned_employee_name ? (
                                        <div className="flex items-center">
                                            <div className="h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold mr-2">
                                                {task.assigned_employee_name.charAt(0)}
                                            </div>
                                            <span className="text-sm text-slate-700">{task.assigned_employee_name}</span>
                                        </div>
                                    ) : (
                                        <span className="text-sm text-slate-400 italic">Unassigned</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusColor(task.status)}`}>
                                        {task.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-slate-500">{task.due_date}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleOpenModal(task)} className="text-primary-600 hover:text-primary-900 mr-4 p-2 hover:bg-primary-50 rounded-lg transition-colors">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    {isAdmin && (
                                        <button onClick={() => handleDelete(task.id)} className="text-rose-600 hover:text-rose-900 p-2 hover:bg-rose-50 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentTask ? 'Edit Task' : 'Add Task'}>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                        <input type="text" required className="block w-full border-slate-200 rounded-xl shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm p-2.5 bg-slate-50 border" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea rows="3" className="block w-full border-slate-200 rounded-xl shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm p-2.5 bg-slate-50 border" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                            <select className="block w-full border-slate-200 rounded-xl shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm p-2.5 bg-slate-50 border" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                                <option value="Todo">Todo</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                            <input
                                type="date"
                                className={`block w-full border-slate-200 rounded-xl shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm p-2.5 bg-slate-50 border ${!isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`}
                                value={formData.due_date}
                                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                disabled={!isAdmin}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Assign To</label>
                        <select className="block w-full border-slate-200 rounded-xl shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm p-2.5 bg-slate-50 border" value={formData.assigned_to} onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}>
                            <option value="">Unassigned</option>
                            {employees.map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="pt-2">
                        <button type="submit" className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-lg shadow-primary-500/30 px-4 py-3 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none sm:text-sm transition-all hover:-translate-y-0.5">
                            Save Task
                        </button>
                    </div>
                </form>

                {currentTask && (
                    <div className="mt-8 pt-6 border-t border-slate-100">
                        <h4 className="text-lg font-bold text-slate-900 mb-4">Comments</h4>
                        <div className="space-y-4 mb-4 max-h-48 overflow-y-auto">
                            {comments.map((comment) => (
                                <div key={comment.id} className="bg-slate-50 p-3 rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <span className="text-sm font-semibold text-slate-900">{comment.user_name}</span>
                                        <span className="text-xs text-slate-400">{new Date(comment.created_at).toLocaleString()}</span>
                                    </div>
                                    <p className="text-sm text-slate-600 mt-1">{comment.content}</p>
                                </div>
                            ))}
                            {comments.length === 0 && <p className="text-sm text-slate-400 italic">No comments yet.</p>}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Add a comment..."
                                className="block w-full border-slate-200 rounded-xl shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm p-2.5 bg-slate-50 border"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddComment(e)}
                            />
                            <button
                                onClick={handleAddComment}
                                className="bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-800 transition-colors"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default TaskList;
