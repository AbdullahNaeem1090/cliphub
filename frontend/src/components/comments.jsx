
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addComment,
  addReplies,
  addReply,
  remComment,
  removeReply,
} from "../slices/currentVideoSlice";
import { CustomToast } from "../utils/showUtils";
import { useAuth } from "../protection/useAuth";
import { myAxios } from "../utils/axiosInstance";

function Comments() {
  const currVideo = useSelector((state) => state.currentVideo);
  const commentRef = useRef();
  const { currUser } = useAuth();
  const [showComment, setShowComment] = useState(false);
  const [showRepInp, setShowRepInp] = useState(false);
  const [showRepliess, setShowReplies] = useState(false);
  const [commBoxId, setCommBoxId] = useState("");
  const [repButtonId, setRepButtonId] = useState("");

  let replyRef = useRef();
  const dispatch = useDispatch();

  function showComments() {
    setShowComment((prev) => !prev);
  }

  async function postComment(author, Commented_Video_id) {
    let comment = commentRef.current.value;
    try {
      let resp = await myAxios.post("/api/comment/post", {
        author,
        Commented_Video_id,
        comment,
      });
      if (resp.data.success) {
        let newComment = resp.data.data;
        newComment.commenter = {
          avatar: currUser.avatar || "",
          username: currUser.username,
          _id: currUser._id,
        };
        dispatch(addComment(newComment));
        commentRef.current.value = "";
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteComment(commentId) {
    try {
      let resp1 = await myAxios.delete(`/api/comment/removeComment/${commentId}`);
      if (resp1.data.success) {
        dispatch(remComment({ commentId }));
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function postReply(ParentComment_id, author) {
    let rep_comment = replyRef.current.value;
    if (!rep_comment) return;
    try {
      let resp = await myAxios.post("/api/replyComments/postReply", {
        ParentComment_id,
        rep_comment,
        author,
      });
      if (resp.data.success) {
        dispatch(
          addReply({ commentId: ParentComment_id, reply: resp.data.data })
        );
        setShowRepInp(false);
        setRepButtonId(ParentComment_id);
        setShowReplies(true);
        replyRef.current.value = "";
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function showReplies(commentId) {
    setRepButtonId(commentId);
    setShowReplies((prev) => !prev);
    try {
      let resp = await myAxios.get(`/api/replyComments/getReplies/${commentId}`);
      if (resp.data.success) {
        if (resp.data.data.length) {
          dispatch(addReplies({ commentId, replies: resp.data.data }));
        } else {
          CustomToast(dispatch, "No relplies");
          setShowReplies(false);
        }
      }
    } catch (error) {
      setShowReplies(false);
      console.log(error);
    }
  }

  async function deleteReply(commentId, replyId) {
    try {
      let resp = await myAxios.delete(
        `/api/replyComments/deleteReply/${replyId}`
      );
      if (resp.data.success) {
        dispatch(removeReply({ commentId, replyId }));
      }
    } catch (error) {
      console.log(error);
    }
  }

  function showReplyInput(Comment_id) {
    setShowRepInp((prev) => !prev);
    setCommBoxId(Comment_id);
  }

  return (
    <section
      className={`bg-white bg-opacity-5 rounded-lg  lg:py-8 antialiased lg:max-w-[845px] ${
        showComment ? "" : "h-40"
      } overflow-hidden lg:block lg:h-auto`}
    >
      <div className="max-w-2xl mx-auto ">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg lg:text-2xl font-bold text-white">
            Comments {currVideo?.Comments?.length}
          </h2>
        </div>

        <div className="mb-6">
          <div className="p-2 mb-4 rounded-lg rounded-t-lg border border-gray-500">
            <textarea
              rows="1"
              className="w-full text-sm text-white rounded-md border-0 p-2 focus:ring-0 bg-black bg-opacity-5"
              ref={commentRef}
              placeholder="Write your comment..."
              required
            ></textarea>
          </div>
          <div className="flex justify-between">
            <button
              className="border-b text-white px-1 py-0.5 lg:hidden hover:border-gray-400 hover:text-gray-400"
              onClick={showComments}
            >
              Read Comments
            </button>
            <button
              onClick={() => postComment(currUser._id, currVideo._id)}
              className="bg-blue-600 rounded-lg text-white px-2 py-1 hover:bg-green-400"
            >
              Post comment
            </button>
          </div>
        </div>
        {/* comment */}
        {currVideo?.Comments.map((comment, index) => (
          <div key={comment?._id}>
            <article className="p-6 text-base bg-slate-950 bg-opacity-50 rounded-lg mb-4">
              <footer className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <p className="inline-flex items-center mr-3 text-sm text-white font-semibold">
                    <img
                      className="mr-2 w-6 h-6 rounded-full"
                      src={
                        comment?.commenter?.avatar ||
                        "/src/assets/defaultAvatar.png"
                      }
                      alt="Michael Gough"
                    />
                    {comment?.commenter?.username}
                  </p>
                </div>
                {currUser?._id == comment?.author && (
                  <img
                    src="/src/assets/delete.png"
                    className="h-6 w-6 cursor-pointer"
                    alt=""
                    onClick={() => deleteComment(comment._id, index)}
                  />
                )}
              </footer>

              <p className="text-gray-400">{comment?.comment}</p>
              <div className="flex items-center justify-between mt-4 space-x-4">
                <button
                  onClick={() => showReplyInput(comment._id)}
                  className="flex items-center text-sm text-gray-500  font-medium"
                >
                  <img
                    src="/src/assets/reply.png"
                    alt=""
                    className="w-6 h-6 mr-2"
                  />
                  Reply
                </button>
                <button
                  className="text-purple-400 hover:underline "
                  onClick={() => showReplies(comment._id)}
                >
                  Replies
                </button>
              </div>
              {commBoxId == comment._id && (
                <div
                  className={`w-full  mt-2 flex ${showRepInp ? "" : "hidden"}`}
                >
                  <input
                    type="text"
                    id="comment_text"
                    ref={replyRef}
                    className=" bg-blue-950 bg-opacity-50 rounded-lg w-full  focus:ring-0 text-white border-b-1 border-t-0 border-x-0 pl-1"
                    placeholder=" Reply . . ."
                  />
                  <img
                    src="/src/assets/send.png"
                    className="h-8 w-8 items-center cursor-pointer"
                    alt=""
                    onClick={() => {
                      postReply(comment._id, currUser._id);
                    }}
                  />
                </div>
              )}
            </article>

            {comment?.replies &&
              comment.replies.map((reply) => {
                return (
                  <article
                    key={reply._id}
                    className={`${
                      repButtonId == reply.ParentComment_id && showRepliess
                        ? ""
                        : "hidden "
                    }p-6 mb-3 ml-6 lg:ml-16 text-base bg-white bg-opacity-20 rounded-lg`}
                  >
                    <footer className="flex justify-between items-center mb-2">
                      <p className="inline-flex items-center mr-3 text-sm text-white font-semibold">
                        <img
                          className="mr-2 w-6 h-6 rounded-full"
                          src={
                            reply.replier?.avatar ||
                            "/src/assets/defaultAvatar.png"
                          }
                          alt="Profile"
                        />
                        {reply.replier?.username}
                      </p>

                      {(reply?.author||reply.replier?._id) === currUser._id && (
                        <img
                          src="/src/assets/delete.png"
                          className="h-6 w-6 cursor-pointer"
                          alt=""
                          onClick={() =>
                            deleteReply(reply.ParentComment_id, reply._id)
                          }
                        />
                      )}
                    </footer>

                    <p className="text-slate-200">{reply.rep_comment}</p>
                  </article>
                );
              })}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Comments;
