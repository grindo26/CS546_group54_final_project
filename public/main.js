const filter = document.getElementById('filter');
const content = document.querySelector('.content');
const content2 = document.querySelector('.content2')
const nameli = document.getElementById('nameli')
const priceli = document.getElementById('priceli')
const ratingli = document.getElementById('ratingli')
const myul = document.getElementById('results')
let li = document.createElement('li')
const submit = document.getElementById('submit')
const cityContent = document.querySelector('.cityContent');
const attrContent = document.querySelector('.attrContent')


filter.addEventListener('change', function () {
    const selected = this.value;
    const cities = JSON.parse(document.getElementById("cities").innerHTML);
    console.log(cities);
    if (selected === "price") {
        const filteredCities = cities.filter(city => {
            const price = city.price;
            return (price >= minPrice && price <= maxPrice);
        });

        // Clear the city container
        cityContainer.innerHTML = "";

        // Render the filtered cities
        filteredCities.forEach(city => {
            // Compile the city template
            const cityTemplate = Handlebars.compile(document.getElementById("city-template").innerHTML)
            const cityHtml = cityTemplate(city);

            // Append the rendered city to the city container
            cityContainer.innerHTML += cityHtml;
        });
    }


if (selected === 'all') {
    content.style.display = 'block';
    content2.style.display = 'none'
} else if (selected == 'names') {
    content.style.display = 'none'
    li.innerHTML = nameli.innerHTML
    myul.appendChild(li)
}
else if (selected == 'rating') {
    content.style.display = 'none'
    li.innerHTML = ratingli.innerHTML
    myul.appendChild(li)
} else {
    content.style.display = 'none';

}
});


// <!-- HTML code for the webpage -->
// <html>
// <head>
//   <title>City Filter</title>
// </head>
// <body>
//   <!-- Form to enter the price range -->
//   <form id="filter-form">
//     <label for="min-price">Minimum Price:</label>
//     <input type="number" id="min-price" min="0" value="0">
//     <label for="max-price">Maximum Price:</label>
//     <input type="number" id="max-price" min="0" value="0">
//     <button type="submit">Filter</button>
//   </form>

//   <!-- Container for the city elements -->
//   <div id="city-container">
//     <!-- Template for the city elements -->
//     <template id="city-template">
//       <div class="city">
//         <h3 class="city-name">{{name}}</h3>
//         <p class="city-price">{{price}}</p>
//       </div>
//     </template>

//     <!-- Array of cities -->
//     <script id="cities" type="application/json">
//       [
//         { "name": "New York", "price": "expensive" },
//         { "name": "Paris", "price": "expensive" },
//         { "name": "Toronto", "price": "moderate" },
//         { "name": "Sydney", "price": "expensive" },
//         { "name": "Bangkok", "price": "cheap" },
//         { "name": "Istanbul", "price": "cheap" },
//         { "name": "Tokyo", "price": "expensive" },
//         { "name": "Rome", "price": "expensive" },
//         { "name": "Barcelona", "price": "moderate" }
//       ]
//     </script>
//   </div>

//   <!-- JavaScript code to handle the form submission and filter the cities -->
//   <script>
//     // Get the form and city container elements
//     const form = document.getElementById("filter-form");
//     const cityContainer = document.getElementById("city-container");

//     // Add an event listener to the form to handle the submission
//     form.addEventListener("submit", event => {
//       // Prevent the form from submitting
//       event.preventDefault();

//       // Get the minimum and maximum price values from the form
//       const minPrice = form.elements["min-price"].value;
//       const maxPrice = form.elements["max-price"].value;

//       // Get the cities array from the script element
//       const cities = JSON.parse(document.getElementById("cities").innerHTML);

//       // Filter the cities by price
//       const filteredCities = cities.filter(city => {
//         const price = city.price;
//         return (price >= minPrice && price <= maxPrice);
//       });

//       // Clear the city container
//       cityContainer.innerHTML = "";

//       // Render the filtered cities
//       filteredCities.forEach(city => {
//         // Compile the city template
//         const cityTemplate = Handlebars.compile(document.getElementById("city-template").innerHTML


// // Render the city template with the city data
// const cityHtml = cityTemplate(city);

// // Append the rendered city to the city container
// cityContainer.innerHTML += cityHtml;
// });
// });
// </script>
// </body>
// </html>

const dropdowns = document.querySelectorAll(".dropdown");

dropdowns.forEach((dropdown) => {
    const select = dropdown.querySelector(".select");
    const caret = dropdown.querySelector(".caret");
    const menu = dropdown.querySelector(".menu");
    const options = dropdown.querySelectorAll(".menu li");
    const selected = dropdown.querySelector(".selected");

    select.addEventListener("click", () => {
        select.classList.toggle("select-clicked");
        caret.classList.toggle("caret-rotate");
        menu.classList.toggle("menu-open");
    });

    options.forEach((option) => {
        option.addEventListener("click", () => {
            selected.innerText = option.innerText;
            select.classList.remove("select-clicked");
            caret.classList.remove("caret-rotate");
            menu.classList.remove("menu-open");

            options.forEach((option) => {
                option.classList.remove("active");
            });
            option.classList.add("active");
        });
    });
});

