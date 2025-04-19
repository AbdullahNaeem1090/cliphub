import PropTypes from "prop-types";

function AddPlaylistCard({openCard}) {
  return (
    <div
      onClick={openCard}
      className="flex flex-col justify-center items-center h-56 rounded-xl text-white hover:bg-slate-600 hover:bg-opacity-5 transition cursor-pointer"
    >
      <img src="/src/assets/add.png" alt="Add" className="h-10 w-10 mb-2" />
      <p className="text-sm font-semibold">Add Playlist</p>
    </div>
  );
}

AddPlaylistCard.propTypes = {
  openCard: PropTypes.func.isRequired,

};


export default AddPlaylistCard;
