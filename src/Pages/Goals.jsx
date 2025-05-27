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
    <div className="relative p-4 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 min-h-screen text-white">
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
          <div
            key={goal}
            className="bg-blue-800 p-4 rounded-lg shadow w-[30%] text-center"
          >
            <h3 className="font-bold text-lg">{goal}</h3>
          </div>
        ))}
      </div>

      {/* Add Goal Button */}
      <div className="mb-6">
        <button
          className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-full transition-all duration-300 shadow-lg"
          onClick={() => setShowModal(true)}
        >
          ➕ Add Goal
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity">
          <div className="bg-white text-black p-6 rounded-2xl shadow-xl w-96 animate-fade-in-up">
            <h3 className="text-2xl font-bold mb-4">Add New Goal</h3>
            <input
              type="text"
              placeholder="Goal Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 mb-4 focus:outline-none"
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 mb-4 focus:outline-none"
            >
              {goals.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
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
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="bg-gray-800 p-4 rounded-md">
            {tasks.map((task) => (
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
