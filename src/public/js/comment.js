const commentForm = document.getElementById("commentForm");
const commentInput = document.getElementById("comment");
const deleteIcons = document.querySelectorAll("#deleteComment");
const commentsUl = document.querySelector(".comments-ul");

const handleDeleteComment = async (e) => {
  commentsUl.removeChild(e.target.parentElement.parentElement);
  const commentId = e.target.parentElement.dataset.id;
  await fetch("/videos/api/comment/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ commentId }),
  });
};

commentForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const context = commentInput.value;
  commentInput.value = "";

  const videoId = location.href.split("watch/")[1];
  const response = await fetch("/videos/api/comment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ comment: context, videoId }),
  });
  const data = await response.json();
  const { commentId, comment } = data;

  const li = document.createElement("li");
  li.innerText = comment;
  const span = document.createElement("span");
  span.setAttribute("id", "deleteComment");
  span.setAttribute("data-id", commentId);
  const icon = document.createElement("i");
  icon.classList = "fa-solid fa-delete-left";
  span.appendChild(icon);
  const div = document.createElement("div");
  div.appendChild(li);
  div.appendChild(span);
  commentsUl.prepend(div);
  icon.addEventListener("click", handleDeleteComment);
});

if (deleteIcons) {
  deleteIcons.forEach((deleteIcon) => {
    deleteIcon.addEventListener("click", handleDeleteComment);
  });
}
