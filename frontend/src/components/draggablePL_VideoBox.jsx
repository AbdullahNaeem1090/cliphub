import { useSortable } from "@dnd-kit/sortable";
import PropTypes from "prop-types";
import { Menu } from "lucide-react";
import { CSS } from "@dnd-kit/utilities";


const SortableVideoItem = ({ video, handleVideoCheckboxChange }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: video._id });


  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      key={video._id}
      className={`border border-gray-700 rounded-lg overflow-hidden transition-colors ${
        video._selected ? "bg-gray-750 border-blue-500" : "bg-gray-800"
      }`}
      draggable
    >
      <div className="p-4 flex items-center">
        <div {...listeners} className="text-gray-400 mr-1 hover:text-gray-200 cursor-grab">
          <button
            className="p-1 hover:bg-gray-700 rounded-md cursor-grab"
            onClick={() => handleVideoCheckboxChange(video._id)}
          >
            <Menu size={18} />
          </button>
        </div>

        <div className="flex-grow">
          <h3 className="font-medium">{video.title}</h3>
          <p className="text-sm text-gray-400">{video.description}</p>
        </div>

        <div className="mr-3">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-blue-600 rounded bg-gray-700 border-gray-600"
            checked={video.selected}
            onChange={() => handleVideoCheckboxChange(video._id)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    </div>
  );
};


SortableVideoItem.propTypes = {
  video: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    _selected: PropTypes.bool,
    title: PropTypes.string,
    description: PropTypes.string,
    selected: PropTypes.bool,
  }).isRequired,
  handleVideoCheckboxChange: PropTypes.func.isRequired,
};

export default SortableVideoItem