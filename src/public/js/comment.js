const commentForm = document.getElementById("commentForm");
const commentInput = document.getElementById("comment");
const deleteIcons = document.querySelectorAll("#deleteComment");
const commentsUl = document.getElementById("commentsUl");
const commentsLengthDOM = document.getElementById("commentsLength");
const commentsLengthSectionDOM = document.getElementById(
  "commentsLengthSection"
);

const commentOrComments = (lengthDOM, sectionDOM) => {
  const count = Number(lengthDOM.innerText);
  sectionDOM.innerText = count === 1 ? `${count} Comment` : `${count} Comments`;
};

const handleDeleteComment = async (e) => {
  commentsUl.removeChild(e.target.parentElement.parentElement);
  const commentId = e.target.parentElement.dataset.id;
  commentsLengthDOM.innerText = Number(commentsLengthDOM.innerText) - 1;
  commentOrComments(commentsLengthDOM, commentsLengthSectionDOM);
  try {
    await fetch("/videos/api/comment/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ commentId }),
    });
  } catch (err) {
    console.log(err);
  }
};

if (commentForm) {
  commentForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const context = commentInput.value;
    commentInput.value = "";
    if (!context) return;

    const videoId = location.href.split("watch/")[1];
    try {
      const response = await fetch("/videos/api/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ context, videoId }),
      });
      const data = await response.json();
      const { commentId, comment, userName } = data;

      const li = document.createElement("li");
      li.innerText = `${userName}: ${comment}`;
      const userNameSpan = document.createElement("span");
      userNameSpan.innerText = userName;
      const commentIdSpan = document.createElement("span");
      commentIdSpan.setAttribute("id", "deleteComment");
      commentIdSpan.setAttribute("data-id", commentId);
      const icon = document.createElement("i");
      icon.classList = "fa-solid fa-delete-left";
      commentIdSpan.appendChild(icon);
      const div = document.createElement("div");
      div.classList.add("watch-container-metadata-comments-info-ul-list");
      div.appendChild(li);
      div.appendChild(commentIdSpan);
      commentsUl.prepend(div);
      commentsLengthDOM.innerText = Number(commentsLengthDOM.innerText) + 1;
      commentOrComments(commentsLengthDOM, commentsLengthSectionDOM);
      commentIdSpan.addEventListener("click", handleDeleteComment);
    } catch (err) {
      console.log(err);
    }
  });
}

if (deleteIcons) {
  deleteIcons.forEach((deleteIcon) => {
    deleteIcon.addEventListener("click", handleDeleteComment);
  });
}

commentOrComments(commentsLengthDOM, commentsLengthSectionDOM);
