import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

export default function AddTask() {
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <div className="text-white p-8">
      {/* Fancy Button */}
      <button
        onClick={openModal}
        className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105"
      >
        + Add New Task
      </button>

      {/* Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
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
                      className="w-full p-2 rounded bg-[#1A2537] border border-gray-500 focus:outline-none"
                    />
                    <label className="block mt-4 mb-1">Description</label>
                    <textarea
                      className="w-full p-2 rounded bg-[#1A2537] border border-gray-500 focus:outline-none"
                      rows="3"
                    />
                    <label className="block mt-4 mb-1">Category</label>
                    <select className="w-full p-2 rounded bg-[#1A2537] border border-gray-500 focus:outline-none">
                      <option>To Do</option>
                      <option>In Progress</option>
                      <option>Done</option>
                    </select>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded"
                      onClick={closeModal}
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

      {/* Fancy Category Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {["To Do", "In Progress", "Done"].map((status) => (
          <div
            key={status}
            className="bg-gradient-to-br from-[#2E3B55] to-[#1A2537] border border-gray-700 rounded-xl p-6 shadow-md hover:shadow-xl transition-transform transform hover:scale-105"
          >
            <h3 className="text-xl font-semibold mb-2">{status}</h3>
            <p className="text-sm text-gray-300">No tasks yet.</p>
          </div>
        ))}
      </div>
    </div>
  );
}
