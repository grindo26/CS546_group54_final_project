// let main = async () => {
//     $("#reviewForm").submit(function (event) {
//         event.preventDefault();

//         let reviewText = $("#reviewTxt").val();
//         let rating = $("#ratingTxt").val();
//         let attractionId = window.location.pathname.split("/")[window.location.pathname.split("/").length - 1];

//         // Make an AJAX request to get the review data

//         $.ajax({
//             url: `/reviews/${attractionId}`,
//             type: "POST",
//             data: JSON.stringify({
//                 reviewText: reviewText,
//                 rating: rating,
//             }),
//             success: function (response) {
//                 // Parse the JSON response
//                 alert("here");
//                 var reviewData = JSON.parse(response);

//                 // Append the new review information to the list of reviews
//                 $("#reviewList").append("<li>" + reviewData.reviewText + ": " + reviewData.rating + "</li>");
//             },
//         });
//     });
// };

// (function ($) {
//     // Let's start writing AJAX calls!

// $("#reviewForm").submit(function (event) {
//     event.preventDefault();
//     let reviewText = $("#reviewTxt").val();
//     let rating = $("#ratingTxt").val();
//     let attractionId = window.location.pathname.split("/")[window.location.pathname.split("/").length - 1];

//     let requestConfig = {
//         method: "POST",
//         url: `/reviews/${attractionId}`,
//         contentType: "application/json",
//         data: JSON.stringify({
//             reviewText: reviewText,
//             rating: rating,
//         }),
//         dataType: "json",
//     };

//     $.ajax(requestConfig)
//         .done(function (response) {
//             let reviewData = JSON.parse(response);
//             console.log(JSON.stringify(reviewData));

//             // Append the new review information to the list of reviews
//             $("#reviewList").append("<li>" + reviewData.reviewText + ": " + reviewData.rating + "</li>");
//         })
//         .fail(function (error) {
//             console.log(error);
//         });
// });
// })(window.jQuery);

// // await main();

$(document).ready(function () {
    $("#reviewForm").on("submit", function (event) {
        event.preventDefault();
        let reviewText = $("#reviewTxt").val();
        let rating = $("#ratingTxt").val();
        let attractionId = window.location.pathname.split("/")[window.location.pathname.split("/").length - 1];

        $.ajax({
            url: `/reviews/${attractionId}`,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                reviewText: reviewText,
                rating: rating,
            }),
            success: function (response) {
                let reviewData = response;
                // console.log(JSON.stringify(reviewData));
                // Append the new review information to the list of reviews
                $("#reviewList").append("<li>" + reviewData.review + ": " + reviewData.rating + "</li>");
            },
        });
    });
});
