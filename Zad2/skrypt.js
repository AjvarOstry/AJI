
let recipes = [];

let favourites = JSON.parse(localStorage.getItem("favourites")) || [];

let search, difficulty, cuisine, range, range_val, count, found;

document.addEventListener("DOMContentLoaded", e => {
    fetch("https://dummyjson.com/recipes")
        .then(response => response.json())
        .then(data => {
            recipes = data.recipes;
            
            renderTable(recipes);
            fillSelect("difficulty", recipe => recipe.difficulty);
            fillSelect("cuisine", recipe => recipe.cuisine);
            
        });

    search = document.getElementById("search");
    difficulty = document.getElementById("difficulty");
    cuisine = document.getElementById("cuisine");
    range = document.getElementById("slider");
    range_val = document.getElementById("range_val");
    found = document.getElementById("found");

    range.value = 60;

    search.addEventListener("input", filter);
    difficulty.addEventListener("change", filter);
    cuisine.addEventListener("change", filter);
    range.addEventListener("change", e => {
        range_val.textContent = range.value;
        filter();
    });
    document.getElementById("reset").addEventListener("click", reset)
});


    
function renderTable(data) {
    let table = document.getElementById("tab");
    table.innerHTML = "";
    count = 0;

    data.forEach(element => {
        const r = document.createElement("tr");

        r.innerHTML = `
            <td>${element.name}</td>
            <td>${element.cuisine}</td>
            <td>${element.difficulty}</td>
            <td>${element.prepTimeMinutes}</td>
            <td>${element.rating}</td>
            
        `;

        if(favourites.includes(element.id)) {
            r.innerHTML += `
                <td> <i class="bi bi-heart-fill"></i> </td>
            `;
        } else {
            r.innerHTML += `
                <td> <i class="bi bi-heart"></i> </td>
            `;
        }


        const heart = r.querySelector("i");

        heart.addEventListener("click", e => {
            // co by się details nie otwierało
            e.stopPropagation();

            toggleFav(element.id);
            filter();
            
        })


        r.style.cursor = "pointer";
        r.addEventListener("click", () => {
            showDetailModal(element);
        });

        table.appendChild(r);
        count++;
    });

    found.textContent = count;
}

function fillSelect(id, item) {
    const select = document.getElementById(id);

    const val = new Set(recipes.map(item));

    select.innerHTML = '<option value="all">ALL</option>';

    val.forEach(element => {
        let option = document.createElement("option");
        option.value = element.toLowerCase();
        option.textContent = element.toUpperCase();
        select.appendChild(option);
    });
}

function filter() {
    count = 0

    const fRecipes = recipes.filter( recipe => {
        const name =  recipe.name.toLowerCase().includes(search.value.toLowerCase());

        const diff = (difficulty.value == "all") || recipe.difficulty.toLowerCase().includes(difficulty.value);

        const cus = (cuisine.value == "all") || recipe.cuisine.toLowerCase().includes(cuisine.value);

        const ran = recipe.prepTimeMinutes <= range.value;

        return name && diff && cus && ran;
    });

    renderTable(fRecipes);
}

function reset() {
    search.value = "";
    difficulty.value = "all";
    cuisine.value = "all";
    range.value = 60;
    range_val.textContent = 60;

    renderTable(recipes);
}

function toggleFav(id) {

    if(favourites.includes(id)) {
        favourites = favourites.filter(f => f != id)
    } else {
        favourites.push(id);
    }

    localStorage.setItem("favourites", JSON.stringify(favourites));

}

function showDetailModal(element) {

    document.getElementById("modalTitle").textContent = element.name;

    let content = "<h6>Ingredients</h6><ul>";

    element.ingredients.forEach(i => {
        content += `<li>${i}</li>`;
    });

    content += "</ul><h6>Instructions</h6><ol>";
    element.instructions.forEach(step => {
        content += `<li>${step}</li>`;
    });

    content += "</ol>";

    document.getElementById("modalBody").innerHTML = content;

    bootstrap.Modal.getOrCreateInstance(document.getElementById("recipeModal")).show();
    
}