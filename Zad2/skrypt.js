let recipes = [];
let search, difficulty, cuisine;

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

    search.addEventListener("input", filter);
    difficulty.addEventListener("change", filter);
    cuisine.addEventListener("change", filter);
});


    
function renderTable(data) {
    let table = document.getElementById("tab");
    table.innerHTML = "";

    data.forEach(element => {
        const r = document.createElement("tr");

        r.innerHTML = `
            <td>${element.name}</td>
            <td>${element.cuisine}</td>
            <td>${element.difficulty}</td>
            <td>${element.prepTimeMinutes}</td>
            <td>${element.rating}</td>
        `;
        table.appendChild(r);
    });
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

    const fRecipes = recipes.filter( recipe => {
        const name =  recipe.name.toLowerCase().includes(search.value.toLowerCase());

        const diff = (difficulty.value == "all") || recipe.difficulty.toLowerCase().includes(difficulty.value);

        const cus = (cuisine.value == "all") || recipe.cuisine.toLowerCase().includes(cuisine.value);

        return name && diff && cus;
    });

    renderTable(fRecipes);
}

function reset() {
    document.getElementById("search").value = "";
    document.getElementById("difficulty").value = "all";
    document.getElementById("cuisine").value = "all";

    renderTable(recipes);
}