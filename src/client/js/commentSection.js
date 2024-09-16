const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtns = document.querySelectorAll("#deleteCommentBtn");

const addComment = (text, commentId) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.className = "video__comment";

  const icon = document.createElement("i");
  icon.className = "fas fa-comment";

  const span = document.createElement("span");
  span.innerText = ` ${text}`;

  const span2 = document.createElement("span");
  span2.innerText = "❌";
  span2.dataset.id = commentId;

  const videoId = videoContainer.dataset.id;
  span2.dataset.videoId = videoId;
  span2.id = "newDeleteCommentBtn";
  span2.className = "video__comment-delete";

  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);
  videoComments.prepend(newComment);

  const newDeleteCommentBtn = document.querySelector("#newDeleteCommentBtn");
  newDeleteCommentBtn.addEventListener("click", handleDelete);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;

  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }

  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

const handleDelete = async (event) => {
  const { id, videoId } = event.target.dataset;

  if (!videoId || !id) {
    console.error("Missing video or comment ID");
    return;
  }

  const response = await fetch(`/api/videos/${videoId}/comment/${id}/delete`, {
    method: "DELETE",
  });

  if (response.status === 200) {
    event.target.parentNode.remove();
  } else {
    console.error("Failed to delete the comment");
  }
};

// Attach delete event listeners to all existing delete buttons
if (deleteBtns) {
  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", handleDelete);
  });
}

// Attach comment submit event
if (form) {
  form.addEventListener("submit", handleSubmit);
}
