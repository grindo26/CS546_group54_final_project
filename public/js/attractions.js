const button = document.getElementById("get-review-form-button");

// Add an event listener to the button to handle the click
button.addEventListener("click", (event) => {
    // Redirect to the /reviewForm route
    let attractionId = window.location.pathname.split("/")[window.location.pathname.split("/").length - 1];
    window.location = "/reviews/form?attractionId=" + attractionId;
});
