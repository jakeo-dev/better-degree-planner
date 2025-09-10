import { useState } from "react";
import { FaTimes } from "react-icons/fa";

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, color: string) => void;
  initialName?: string;
  initialColor?: string;
}

export default function CourseModal({
  isOpen,
  onClose,
  onSubmit,
  initialName = "",
  initialColor = "",
}: CourseModalProps) {
  const [name, setName] = useState(initialName);
  const [color, setColor] = useState(initialColor);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
      >
      <div className="bg-gray-100 rounded-2xl shadow-xl w-[95vw] max-w-md p-6 relative animate-fadeIn">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition cursor-pointer">
          <FaTimes size={20} aria-label="Close modal" title="Close modal" />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Edit Course Info</h2>

        {/* Course Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Course Name
          </label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value.slice(0, 30))} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter course name"/>
          <p className="text-xs text-gray-400 mt-1">
            {name.length}/30 characters
          </p>
        </div>

        {/* Course Color */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Course Color
          </label>
          <div className="grid grid-cols-7 gap-2">
            {[
              "bg-red-200 hover:bg-red-300 focus:bg-red-300",
              "bg-orange-200 hover:bg-orange-300 focus:bg-orange-300",
              "bg-yellow-200 hover:bg-yellow-300 focus:bg-yellow-300",
              "bg-green-200 hover:bg-green-300 focus:bg-green-300",
              "bg-blue-200 hover:bg-blue-300 focus:bg-blue-300",
              "bg-violet-200 hover:bg-violet-300 focus:bg-violet-300",
              "bg-neutral-200 hover:bg-neutral-300 focus:bg-neutral-300",
            ].map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-8 h-8 transition rounded-full border-2 cursor-pointer ${
                  color === c ? "border-black" : "border-transparent"
                } ${c}`}
              />
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg bg-gray-200 hover:bg-gray-300 transition cursor-pointer">
            Cancel
          </button>

          <button onClick={() => { onSubmit(name, color); onClose(); }} className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
