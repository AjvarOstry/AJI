let recipes = [];

fetch("https://dummyjson.com/recipes")
    .then(response => response.json())
    .then(data => {
        recipes = data.recipes;
        
        renderTable(recipes);
        fillSelect("difficulty", recipe => recipe.difficulty);
        fillSelect("cuisine", recipe => recipe.cuisine);
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
    let search = document.getElementById("search").value.toLowerCase();
    let diffopt = document.getElementById("difficulty").value;
    let cus_opt = document.getElementById("cuisine").value;

    const fRecipes = recipes.filter( recipe => {
        const name =  recipe.name.toLowerCase().includes(search);

        const diff = (diffopt == "all") || recipe.difficulty.toLowerCase().includes(diffopt);

        const cuisine = (cus_opt == "all") || recipe.cuisine.toLowerCase().includes(cus_opt);

        return name && diff && cuisine;
    });

    renderTable(fRecipes);
}

function reset() {
    document.getElementById("search").value = "";
    document.getElementById("difficulty").value = "all";
    document.getElementById("cuisine").value = "all";

    renderTable(recipes);
}