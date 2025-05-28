import { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const API_URL = "http://localhost:5000/api/tasks";

export default function TaskManager() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("To Do");
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [quote, setQuote] = useState(null);

  const fetchQuote = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/quote");
      const data = await res.json();
      setQuote(data[0]);
    } catch (err) {
      console.error("Failed to fetch quote", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL);
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  const addTask = async () => {
    if (!title.trim()) return alert("Title is required");
    try {
      const res = await axios.post(API_URL, {
        title,
        description,
        category,
      });
      const newTask = { ...res.data, category };
      setTasks((prev) => [...prev, newTask]);
      fetchQuote();
      closeAddModal();
    } catch (err) {
      console.error("Failed to add task", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
      console.log("Delete");
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setCategory(task.category);
    setIsEditOpen(true);
  };

  const saveEditedTask = async () => {
    if (!title.trim()) return alert("Title is required");

    try {
      const res = await axios.put(`${API_URL}/${editingTask._id}`, {
        title,
        description,
        category,
      });

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

  const taskVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  // DnD Sensors
  const sensors = useSensors(useSensor(PointerSensor));

  // Sortable task component to enable dragging
  // function SortableTask({ task, onDelete, onEdit }) {
  //   const { attributes, listeners, setNodeRef, transform, transition } =
  //     useSortable({ id: task._id });

  //   const style = {
  //     transform: CSS.Transform.toString(transform),
  //     transition,
  //   };

  //   return (
  //     <motion.div
  //       ref={setNodeRef}
  //       {...attributes}
  //       {...listeners}
  //       style={style}
  //       initial="hidden"
  //       animate="visible"
  //       exit="exit"
  //       variants={taskVariants}
  //       layout
  //       className="bg-[#1A2537] border border-gray-600 rounded p-4 mb-3 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
  //       onDoubleClick={() => onEdit(task)}
  //       title="Double click to edit"
  //     >
  //       <h4 className="font-semibold">{task.title}</h4>
  //       <p className="text-sm text-gray-400 whitespace-pre-wrap">
  //         {task.description || "-"}
  //       </p>
  //       <div className="flex justify-between items-center mt-2">
  //         <span className="text-xs text-gray-500 italic">{task.category}</span>
  //         <button
  //           onClick={(e) => {
  //             e.stopPropagation();
  //             onDelete(task._id);
  //           }}
  //           className="text-red-400 text-xs hover:underline"
  //         >
  //           Delete
  //         </button>
  //       </div>
  //     </motion.div>
  //   );
  // }

  // function SortableTask({ task, onDelete, onEdit }) {
  //   const { attributes, listeners, setNodeRef, transform, transition } =
  //     useSortable({ id: task._id });

  //   const style = {
  //     transform: CSS.Transform.toString(transform),
  //     transition,
  //   };

  //   return (
  //     <motion.div
  //       ref={setNodeRef}
  //       {...attributes}
  //       {...listeners}
  //       style={style}
  //       initial="hidden"
  //       animate="visible"
  //       exit="exit"
  //       variants={taskVariants}
  //       layout
  //       className="bg-[#1A2537] border border-gray-600 rounded p-4 mb-3 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
  //       // Removed onDoubleClick here
  //     >
  //       <h4 className="font-semibold">{task.title}</h4>
  //       <p className="text-sm text-gray-400 whitespace-pre-wrap">
  //         {task.description || "-"}
  //       </p>
  //       <div className="flex justify-between items-center mt-2">
  //         <span className="text-xs text-gray-500 italic">{task.category}</span>
  //         <div className="flex space-x-4">
  //           <button
  //             onClick={(e) => {
  //               e.stopPropagation();
  //               onEdit(task);
  //             }}
  //             className="text-blue-400 text-xs hover:underline"
  //           >
  //             Edit
  //           </button>
  //           <button
  //             onClick={(e) => {
  //               e.stopPropagation();
  //               onDelete(task._id);
  //             }}
  //             className="text-red-400 text-xs hover:underline"
  //           >
  //             Delete
  //           </button>
  //         </div>
  //       </div>
  //     </motion.div>
  //   );
  // }
  function SortableTask({ task, onDelete, onEdit }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: task._id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <motion.div
        ref={setNodeRef}
        {...attributes}
        // Removed {...listeners} here from the whole card
        style={style}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={taskVariants}
        layout
        className="bg-[#1A2537] border border-gray-600 rounded p-4 mb-3 shadow-md hover:shadow-lg transition-shadow cursor-pointer flex justify-between items-start"
      >
        <div>
          <h4 className="font-semibold">{task.title}</h4>
          <p className="text-sm text-gray-400 whitespace-pre-wrap">
            {task.description || "-"}
          </p>
          <span className="text-xs text-gray-500 italic">{task.category}</span>
        </div>

        {/* Drag handle */}
        <div
          {...listeners}
          className="cursor-grab select-none ml-4 mt-1 text-gray-400 hover:text-gray-200"
          title="Drag to reorder"
        >
          ≡
        </div>

        {/* Edit/Delete buttons */}
        <div className="flex flex-col justify-between items-center ml-4 space-y-2">
          <div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              className="text-blue-400 text-xs hover:underline"
            >
              Edit
            </button>
          </div>
          <div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task._id);
              }}
              className="text-red-400 text-xs hover:underline"
            >
              Delete
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="text-white p-8 min-h-screen bg-gradient-to-br from-[#1a2537] to-[#0d1521]">
      <button
        onClick={() => setIsAddOpen(true)}
        className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105 mb-8"
      >
        + Add New Task
      </button>

      {/* Add Modal */}
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

      {/* Edit Modal */}
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
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded"
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

      {/* Tasks Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["To Do", "In Progress", "Done"].map((status) => (
          <div key={status} className="flex flex-col">
            <h3 className="text-lg font-semibold mb-4">{status}</h3>

            <DndContext
              collisionDetection={closestCenter}
              sensors={sensors}
              onDragEnd={({ active, over }) => {
                if (!over || active.id === over.id) return;

                setTasks((prev) => {
                  // Tasks in this column
                  const columnTasks = prev.filter((t) => t.category === status);
                  // Tasks outside this column
                  const otherTasks = prev.filter((t) => t.category !== status);

                  const oldIndex = columnTasks.findIndex(
                    (t) => t._id === active.id
                  );
                  const newIndex = columnTasks.findIndex(
                    (t) => t._id === over.id
                  );

                  if (oldIndex === -1 || newIndex === -1) return prev;

                  const newColumnTasks = arrayMove(
                    columnTasks,
                    oldIndex,
                    newIndex
                  );

                  // Keep order of other tasks, then new order of this column
                  return [...otherTasks, ...newColumnTasks];
                });
              }}
            >
              <SortableContext
                items={tasks
                  .filter((t) => t.category === status)
                  .map((t) => t._id)}
                strategy={verticalListSortingStrategy}
              >
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
                        <SortableTask
                          key={task._id}
                          task={task}
                          onDelete={deleteTask}
                          onEdit={openEditModal}
                        />
                      ))
                  )}
                </AnimatePresence>
              </SortableContext>
            </DndContext>
          </div>
        ))}
      </div>

      {/* Motivational Quote */}
      {quote && (
        <blockquote className="mt-12 text-center italic text-gray-400 max-w-2xl mx-auto">
          &ldquo;{quote.text}&rdquo; — <cite>{quote.author}</cite>
        </blockquote>
      )}
    </div>
  );
}
