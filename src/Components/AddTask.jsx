import { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = "http://localhost:5000/tasks"; // Update with your actual backend URL

export default function TaskManager() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("To Do");
  const [tasks, setTasks] = useState([]);
  const [token, setToken] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    if (storedToken) fetchTasks(storedToken);
  }, []);

  const fetchTasks = async (jwt) => {
    try {
      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  // Add new task
  //   const addTask = async () => {
  //     if (!title.trim()) return alert("Title is required");
  //     try {
  //       const res = await axios.post(
  //         API_URL,
  //         { title, description, category },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       setTasks((prev) => [...prev, res.data]);
  //       closeAddModal();
  //     } catch (err) {
  //       console.error("Failed to add task", err);
  //     }
  //   };
  const addTask = async () => {
    try {
      const res = await axios.post(
        API_URL,
        { title, description, category },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Make sure the task has category field
      const newTask = { ...res.data, category };

      setTasks((prev) => [...prev, newTask]);

      closeAddModal();
    } catch (err) {
      console.error("Failed to add task", err);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  // Open edit modal and preload task data
  const openEditModal = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setCategory(task.category);
    setIsEditOpen(true);
  };

  // Save edited task
  //   const saveEditedTask = async () => {
  //     if (!title.trim()) return alert("Title is required");
  //     try {
  //       const res = await axios.put(
  //         `${API_URL}/${editingTask._id}`,
  //         { title, description, category },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );

  //       setTasks((prev) =>
  //         prev.map((task) => (task._id === editingTask._id ? res.data : task))
  //       );
  //       closeEditModal();
  //     } catch (err) {
  //       console.error("Failed to update task", err);
  //     }
  //   };

  const saveEditedTask = async () => {
    if (!title.trim()) return alert("Title is required");

    try {
      const res = await axios.put(
        `${API_URL}/${editingTask._id}`,
        { title, description, category },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Updated task from backend:", res.data);

      // fallback in case backend returns partial data
      const updatedTask = {
        ...editingTask,
        ...res.data,
        title,
        description,
        category,
      };

      setTasks((prev) =>
        prev.map((task) => (task._id === editingTask._id ? updatedTask : task))
      );

      closeEditModal();
    } catch (err) {
      console.error("Failed to update task", err);
    }
  };

  const closeAddModal = () => {
    setIsAddOpen(false);
    resetForm();
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    resetForm();
    setEditingTask(null);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("To Do");
  };

  // Animation variants for tasks
  const taskVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <div className="text-white p-8 min-h-screen bg-gradient-to-br from-[#1a2537] to-[#0d1521]">
      {/* Add Task Button */}
      <button
        onClick={() => setIsAddOpen(true)}
        className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105 mb-8"
      >
        + Add New Task
      </button>

      {/* Add Task Modal */}
      <Transition appear show={isAddOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeAddModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 bg-[#1A2537]/60 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4"
                enterTo="opacity-100 translate-y-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-4"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#2E3B55] p-6 text-white shadow-xl transition-all">
                  <Dialog.Title className="text-lg font-bold">
                    Add a New Task
                  </Dialog.Title>
                  <div className="mt-4">
                    <label className="block mb-1">Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full p-2 rounded bg-[#1A2537] border border-gray-500 focus:outline-none"
                    />
                    <label className="block mt-4 mb-1">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full p-2 rounded bg-[#1A2537] border border-gray-500 focus:outline-none"
                      rows="3"
                    />
                    <label className="block mt-4 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-2 rounded bg-[#1A2537] border border-gray-500 focus:outline-none"
                    >
                      <option>To Do</option>
                      <option>In Progress</option>
                      <option>Done</option>
                    </select>
                  </div>
                  <div className="mt-6 flex justify-end gap-4">
                    <button
                      className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded"
                      onClick={closeAddModal}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded"
                      onClick={addTask}
                    >
                      Save Task
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Edit Task Modal */}
      <Transition appear show={isEditOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeEditModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 bg-[#1A2537]/60 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4"
                enterTo="opacity-100 translate-y-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-4"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#2E3B55] p-6 text-white shadow-xl transition-all">
                  <Dialog.Title className="text-lg font-bold">
                    Edit Task
                  </Dialog.Title>
                  <div className="mt-4">
                    <label className="block mb-1">Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full p-2 rounded bg-[#1A2537] border border-gray-500 focus:outline-none"
                    />
                    <label className="block mt-4 mb-1">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full p-2 rounded bg-[#1A2537] border border-gray-500 focus:outline-none"
                      rows="3"
                    />
                    <label className="block mt-4 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-2 rounded bg-[#1A2537] border border-gray-500 focus:outline-none"
                    >
                      <option>To Do</option>
                      <option>In Progress</option>
                      <option>Done</option>
                    </select>
                  </div>
                  <div className="mt-6 flex justify-end gap-4">
                    <button
                      className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded"
                      onClick={closeEditModal}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded"
                      onClick={saveEditedTask}
                    >
                      Save Changes
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Task Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {["To Do", "In Progress", "Done"].map((status) => (
          <div
            key={status}
            className="bg-gradient-to-br from-[#2E3B55] to-[#1A2537] border border-gray-700 rounded-xl p-6 shadow-md"
          >
            <h3 className="text-xl font-semibold mb-4">{status}</h3>
            <AnimatePresence>
              {tasks.filter((t) => t.category === status).length === 0 ? (
                <motion.p
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-gray-400"
                >
                  No tasks yet.
                </motion.p>
              ) : (
                tasks
                  .filter((t) => t.category === status)
                  .map((task) => (
                    <motion.div
                      key={task._id}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={taskVariants}
                      layout
                      className="bg-[#1A2537] border border-gray-600 rounded p-4 mb-3 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                      onDoubleClick={() => openEditModal(task)}
                      title="Double click to edit"
                    >
                      <h4 className="font-semibold">{task.title}</h4>
                      <p className="text-sm text-gray-400 whitespace-pre-wrap">
                        {task.description || "-"}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500 italic">
                          {task.category}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTask(task._id);
                          }}
                          className="text-red-400 text-xs hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  ))
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
