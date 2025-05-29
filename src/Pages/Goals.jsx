import { useState, useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const goals = ["Daily Goal", "Weekly Goal", "Monthly Goal"];

function SortableItem({ id, title, category }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-3 m-2 goal-card border-gray-700 text-white rounded-md cursor-move shadow-md transition-transform transform hover:scale-105 hover:duration-500 font-bold text-lg border"
    >
      <h4 className="font-bold">{title}</h4>
      <p className="text-sm category italic">{category}</p>
    </div>
  );
}

export default function DragDropBoard() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState(goals[0]);
  const [selectedCategory, setSelectedCategory] = useState(goals[0]);

  // Load tasks from backend
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await fetch("https://mini-dashboard-server.vercel.app/api/goals");
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error("Failed to load goals:", err);
      }
    };

    fetchGoals();
  }, []);

  const filteredTasks = tasks.filter(
    (task) => task.category === selectedCategory
  );

  const completedCount = 1; // You can calculate based on task properties
  const progress =
    tasks.length > 0 ? Math.floor((completedCount / tasks.length) * 100) : 0;

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;

    const oldIndex = tasks.findIndex((t) => t._id === active.id);
    const newIndex = tasks.findIndex((t) => t._id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    setTasks((items) => arrayMove(items, oldIndex, newIndex));

    // Optional: update order in DB
  }

  async function handleAddTask() {
    if (!newTitle.trim()) return;

    try {
      const res = await fetch("https://mini-dashboard-server.vercel.app/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: newTitle,
          category: newCategory,
        }),
      });

      const newGoal = await res.json();
      setTasks((prev) => [...prev, newGoal]);
      setNewTitle("");
      setNewCategory(goals[0]);
      setShowModal(false);
      setSelectedCategory(newCategory);
    } catch (err) {
      console.error("Failed to add goal:", err);
    }
  }

  return (
    <div className="relative p-4 min-h-screen ">
      <h2 className="text-3xl font-bold mb-4">🎯 Your Goals</h2>

      <div className="w-full progress rounded-full h-4 mb-6">
        <div
          className="bg-green-500 h-4 rounded-full text-xs text-center"
          style={{ width: `${progress}%` }}
        >
          {progress}%
        </div>
      </div>

      {/* Goal Category Buttons */}
      <div className="flex justify-between mb-6">
        {goals.map((goal) => (
          <button
            key={goal}
            onClick={() => setSelectedCategory(goal)}
            className={`w-[30%] rounded-xl p-6 shadow-md transition-transform transform hover:scale-105 text-center font-bold text-lg border ${
              selectedCategory === goal
                ? "bg-gradient-to-br from-blue-500 to-indigo-700 text-white border-blue-700"
                : " goal-category"
            }`}
          >
            {goal}
          </button>
        ))}
      </div>

      {/* Add Goal Button */}
      <div className="mb-6">
        <button
          className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105"
          onClick={() => setShowModal(true)}
        >
          ➕ Add Goal
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[#0f172a]/70 backdrop-blur-md flex justify-center items-center z-50 transition-all duration-300">
          <div className="bg-[#1A2537]/80 p-6 rounded-2xl shadow-xl w-96 animate-fade-in-up">
            <h3 className=" text-white font-bold py-2">
              Add New Goal
            </h3>
            <input
              type="text"
              placeholder="Goal Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full border border-gray-500 rounded p-2 mb-4 bg-transparent text-white placeholder-gray-400 focus:outline-none"
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full border border-gray-500 rounded p-2 mb-4 bg-transparent text-white focus:outline-none"
            >
              {goals.map((cat) => (
                <option
                  key={cat}
                  value={cat}
                  className="bg-[#1A2537] text-white"
                >
                  {cat}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-400 text-black rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DnD Context */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={filteredTasks.map((task) => task._id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="goal-box p-4 rounded-md min-h-[100px]">
            {filteredTasks.length === 0 ? (
              <p className="text-center text-gray-400 py-8">
                No goals yet in <strong>{selectedCategory}</strong>.
              </p>
            ) : (
              filteredTasks.map((task) => (
                <SortableItem
                  key={task._id}
                  id={task._id}
                  title={task.title}
                  category={task.category}
                />
              ))
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
