import { useState } from "react";
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
      className="p-3 m-2 bg-white text-black rounded shadow cursor-move"
    >
      <h4 className="font-bold">{title}</h4>
      <p className="text-sm text-gray-600">{category}</p>
    </div>
  );
}

export default function DragDropBoard() {
  const [tasks, setTasks] = useState([
    { id: "1", title: "Design login UI", category: "Daily Goal" },
    { id: "2", title: "Create modal for goals", category: "Weekly Goal" },
    { id: "3", title: "Add drag-and-drop", category: "Monthly Goal" },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState(goals[0]);
  const [selectedCategory, setSelectedCategory] = useState("Daily Goal");

  // Filter tasks by selected category
  const filteredTasks = tasks.filter(
    (task) => task.category === selectedCategory
  );
  const completedCount = 1; // simulate 1/3 done
  const progress = Math.floor((completedCount / tasks.length) * 100);

  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  function handleAddTask() {
    if (!newTitle) return;
    const newTask = {
      id: Date.now().toString(),
      title: newTitle,
      category: newCategory,
    };
    setTasks([...tasks, newTask]);
    setNewTitle("");
    setNewCategory(goals[0]);
    setShowModal(false);
  }

  return (
    <div className="relative p-4  min-h-screen text-white">
      <h2 className="text-3xl font-bold mb-4">🎯 Your Goals</h2>

      {/* Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-4 mb-6">
        <div
          className="bg-green-500 h-4 rounded-full text-xs text-center"
          style={{ width: `${progress}%` }}
        >
          {progress}%
        </div>
      </div>

      {/* Goal Categories */}
      <div className="flex justify-between mb-6">
        {goals.map((goal) => (
          <button
            key={goal}
            onClick={() => setSelectedCategory(goal)}
            className={`w-[30%] rounded-xl p-6 shadow-md transition-transform transform hover:scale-105 text-center font-bold text-lg border ${
              selectedCategory === goal
                ? "bg-gradient-to-br from-blue-500 to-indigo-700 text-white border-blue-700"
                : "bg-gradient-to-br from-[#2E3B55] to-[#1A2537] border-gray-700 text-white"
            }`}
          >
            {goal}
          </button>
        ))}
      </div>

      {/* Add Goal Button */}
      <div className="mb-6">
        <button
          className="px-6 py-2 bg-blue-400 hover:bg-sky-800 text-white font-semibold rounded-full transition-all duration-300 shadow-lg"
          onClick={() => setShowModal(true)}
        >
          ➕ Add Goal
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[#0f172a]/70 backdrop-blur-md flex justify-center items-center z-50 transition-all duration-300">
          <div className="bg-[#1A2537]/80 p-6 rounded-2xl shadow-xl w-96 animate-fade-in-up">
            <h3 className="text-2xl font-bold mb-4 text-white">Add New Goal</h3>
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

      {/* Drag and Drop Task List */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={filteredTasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="bg-gray-800 p-4 rounded-md">
            {filteredTasks.map((task) => (
              <SortableItem
                key={task.id}
                id={task.id}
                title={task.title}
                category={task.category}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
