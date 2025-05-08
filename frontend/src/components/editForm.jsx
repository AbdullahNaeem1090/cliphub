import { useRef, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function EditForm({ showForm, setShowForm, editVideoId }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
  });
  const formRef = useRef();
  const queryClient = useQueryClient();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const updateVideo = async () => {
    const payload = new FormData();
    if (formData.title) payload.append("title", formData.title);
    if (formData.description) payload.append("description", formData.description);
    if (formData.image) payload.append("thumbnail", formData.image);

    const res = await axios.put(`/api/video/editVideo/${editVideoId}`, payload);
    return res.data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: updateVideo,
    onSuccess: () => {
      queryClient.invalidateQueries(["userVideos"]);
      setFormData({ title: "", description: "", image: null });
      formRef.current.reset();
      setShowForm(false);
    },
    onError: (err) => {
      console.error("Upload failed", err);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate();
  };

  return (
    <div className="p-4">
      {showForm && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-gray-900 text-blue-100 p-6 rounded-md w-96 relative shadow-xl">
            <button
              className="absolute top-2 right-2 text-red-400 text-xl hover:text-red-500"
              onClick={() => setShowForm(false)}
            >
              ×
            </button>
            <h2 className="text-xl mb-4 font-bold text-blue-200">Edit Video Info</h2>
            <form onSubmit={handleSubmit} ref={formRef} className="flex flex-col gap-4">
              <input
                type="text"
                name="title"
                placeholder="Title (optional)"
                onChange={handleChange}
                className="bg-gray-800 border border-gray-700 text-blue-100 p-2 rounded placeholder:text-blue-400"
              />
              <textarea
                name="description"
                placeholder="Description (optional)"
                onChange={handleChange}
                className="bg-gray-800 border border-gray-700 text-blue-100 p-2 rounded placeholder:text-blue-400"
              />
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="bg-gray-800 border border-gray-700 text-blue-100 p-2 rounded"
              />

              <button
                type="submit"
                className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
                disabled={isPending}
              >
                {isPending ? "Updating..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditForm;

EditForm.propTypes = {
  showForm: PropTypes.bool,
  setShowForm: PropTypes.func,
  editVideoId: PropTypes.string,
};
