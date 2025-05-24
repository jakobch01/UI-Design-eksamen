import { X } from "lucide-react";

const FeedAlert = ({ pigId, stable, onClose }) => {
  return (
    <div className="bg-[#4B4B4B] text-white p-4 rounded-lg border border-gray-300 relative w-fit shadow-md">
      <div className="flex items-center mb-2">
        <div className="mr-2">⚠️</div>
        <strong className="text-white mr-auto">ALERT</strong>
        <button
          className="text-white hover:text-red-400 ml-2"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
      <div className="pl-6 text-sm leading-tight">
        <p>LOW FEEDING IN</p>
        <p>LOCATION: {stable}</p>
        <p>NUMBER: {pigId}</p>
      </div>
    </div>
  );
};


export default FeedAlert;
