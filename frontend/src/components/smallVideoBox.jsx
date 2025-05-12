import PropTypes from "prop-types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SidebarVideoCard = ({ video, currVideoId, changeVideo, enableDrag }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: video._id,
    });

    console.log(enableDrag)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`flex flex-col md:flex-row p-2 mb-2 rounded-lg shadow text-white transition hover:bg-white hover:bg-opacity-10 cursor-pointer ${
        currVideoId === video._id ? "ring-2 ring-blue-500" : ""
      }`}
    >
      
      {enableDrag && (
        <div
          {...listeners}
          className="self-start md:self-center p-1 cursor-grab"
        >
          <img
            src="/src/assets/menu.png"
            alt="Drag"
            className="w-4 h-4 opacity-70"
          />
        </div>
      )}

      <img
        src={video.thumbnail}
        alt="thumbnail"
        className="object-cover rounded-lg w-full h-28 md:w-48 lg:w-36"
        onClick={() => changeVideo(video._id)}
      />

      <div className="flex flex-1 pl-2 pt-2 md:pt-0 justify-between">
        <div
          className="flex flex-col overflow-hidden w-full"
          onClick={() => changeVideo(video._id)}
        >
          <p className="text-sm font-semibold text-slate-200 line-clamp-2">
            {video.title}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <div className="hidden md:block h-6 w-6 rounded-full overflow-hidden">
              <img
                src={video.avatar || "/src/assets/defaultAvatar.png"}
                alt="avatar"
                className="object-cover w-full h-full"
              />
            </div>
            <p className="text-xs text-slate-400 truncate">{video.username}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

SidebarVideoCard.propTypes = {
  video: PropTypes.object.isRequired,
  currVideoId: PropTypes.string.isRequired,
  changeVideo: PropTypes.func.isRequired,
  enableDrag: PropTypes.bool.isRequired,
};

export default SidebarVideoCard;
