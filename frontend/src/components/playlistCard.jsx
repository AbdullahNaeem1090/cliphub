import PropTypes from "prop-types";

function PlaylistCard({ playlist, onNavigate, onDelete, thumbnail }) {
  return (
    <div
      onClick={onNavigate}
      className="cursor-pointer rounded-xl overflow-hidden shadow-md transform hover:scale-[1.06] transition duration-200 group"
    >
      <div className="relative w-full h-56">
        <div className="absolute top-1 left-2 w-full h-full bg-gray-500 rounded-md opacity-40 z-0" />
        <img
          className="relative w-full h-full object-cover rounded-md z-10"
          src={thumbnail || "/src/assets/defaultPlaylist.png"}
          alt="Playlist Thumbnail"
        />
      </div>

      <div className="bg-transparent p-4 flex justify-between items-start">
        <div>
          <h5 className="text-xl font-semibold text-white mb-1">{playlist?.title}</h5>
          <p className="text-sm text-gray-400">Type: {playlist?.type || "Standard"}</p>
          <p className="text-sm text-gray-400">Videos: {playlist?.videos.length}</p>
        </div>
        <img
          src="/src/assets/delete.png"
          className="h-6 w-6 hover:scale-110 transition-transform duration-150"
          alt="Delete"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        />
      </div>
    </div>
  );
}

PlaylistCard.propTypes = {
  playlist: PropTypes.object.isRequired,
  onNavigate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  thumbnail: PropTypes.string,
};

export default PlaylistCard;
