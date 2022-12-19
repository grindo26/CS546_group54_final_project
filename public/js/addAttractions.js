// client.js

$(document).ready(function () {
    function getCities() {
        return $.ajax({
            type: "GET",
            url: "/cities",
            dataType: "json",
        });
    }

    function populateDropdown(items) {
        items.forEach(function (item) {
            $("#cityInput").append(`<option value="${item._id}">${item.name}, ${item.state}</option>`);
        });
    }

    getCities().then(populateDropdown);

    //location code google maps ..
});
