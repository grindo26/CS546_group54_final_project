$(document).ready(function () {
    $("#commentsForm").on("submit", function (event) {
        event.preventDefault();
        let commentText = $("#commentText").val();
        $.ajax({
            url: `/reviews/comments/`,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                commentText: commentText,
            }),
            success: function (response) {
                let commentData = response;
                $("#commentsList").append(`<li><h3>${commentData.username}</h3><h5>${commentData.comment}</h5></li>`);
            },
        });
    });
});
