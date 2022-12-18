const button = document.getElementById("get-review-form-button");

// Add an event listener to the button to handle the click
button.addEventListener("click", (event) => {
    // Redirect to the /reviewForm route
    let attractionId = window.location.pathname.split("/")[window.location.pathname.split("/").length - 1];
    window.location = "/reviews/form?attractionId=" + attractionId;
});

// try{
// let map;


// function initMap() {
//   map = new google.maps.Map(document.getElementById('map'), {
//     center: { lat: -34.397, lng: 150.644 },
//     zoom: 8,
//     mapId: '2be5762ffd51ea60'
//   });
// }
// }catch(e){
//     console.log(e)
// }

//TO-Do
function initMap() {}

$(() => {
  initMap = function() {
    // your code like...

    var map = new google.maps.Map(document.getElementById('map'), {
        /*your code*/
        map: new google.maps.Map(document.getElementById('map'), {
            center: { lat: -34.397, lng: 150.644 },
            zoom: 8,
            mapId: '2be5762ffd51ea60'
        })
      
    });
    // and other stuff...
    new google.maps.Marker({
        position: { lat: 40.7465371513767, lng: -74.04308962935097},
        map,
        title: "My Map!"
    });
  }
})

initMap();
