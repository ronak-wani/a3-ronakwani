
/**
 * This function is called when the user clicks the submit button.
 * It will take the values from the form fields and send them to the server.
 * It sends a POST request to the server with the form data.
 * @param event The submit event.
 * @returns {Promise<void>}
 */
const submit = async function(event) {
    // stop form submission from trying to load
    // a new .html page for displaying results...
    // this was the original browser behavior and still
    // remains to this day
    event.preventDefault();
    let emptyField = null;
    if(!(document.querySelector("#SuperSpicy"))){
        emptyField = document.querySelector("#SuperSpicy");
    }
    else if(!(document.querySelector("#MediumSpicy"))){
        emptyField = document.querySelector("#MediumSpicy");
    }
    else if(!(document.querySelector("#Sour"))){
        emptyField = document.querySelector("#Sour");
    }
    else if(!(document.querySelector("#Sweet"))){
        emptyField = document.querySelector("#Sweet");
    }
    else{
        emptyField = document.querySelector("#Salty");
    }
    const recipe_name = document.querySelector("#RecipeName"),
        recipe_ingredients = document.querySelector("#Ingredients"),
        recipe_description = document.querySelector("#recipeDescription"),
        dietary_restriction = document.querySelector("#allergen");

    const json = {
        recipe_name: recipe_name.value,
        recipe_ingredients: recipe_ingredients.value,
        recipe_description: recipe_description.value,
        recipe_taste: emptyField.value,
        dietary_restriction: dietary_restriction.value
    };

    const body = JSON.stringify(json); // Explicitly declare the body variable

    console.log("Request body:", body);

    const response = await fetch("/CreateRecipes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body// Pass the body variable here
    });
    if(response.status === 200){
        const response1 = await fetch("/GetRecipe", {
            method: "GET",
        });
        const text = await response1.text();
        await display(JSON.parse(text));
    }
    console.log("Response: ", response);

    const text = await response.text();

    console.log("Response text:", text);

    try {
        const parsedResponse = JSON.parse(text);
        console.log("Parsed response:", parsedResponse);
        await display(parsedResponse); // Await the display function call
    } catch (error) {
        console.error("Error parsing JSON:", error);
        // Handle parsing error, e.g., display an error message to the user
    }
};


/**
 * This function is called when the user clicks the delete button.
 * It sends a DELETE request to the server with the uid of the item to delete.
 * @param uid Unique ID of the item to delete.
 * @returns {Promise<void>}
 */
async function del(uid){
    console.log(uid)
    const response = await fetch( "/DeleteRecipes", {
        method:"DELETE",
        body: JSON.stringify({id:uid}),
        headers:{
                "Content-type": "application/json"
        }
    });
    const text = await response.json();
    console.log(text);
    await display(text);
}

/**
 * This function is called when the user clicks the update button.
 * @param uid Unique ID of the item to update.
 * @returns {Promise<void>}
 */
async function modify(uid) {
    console.log("hello" + document.getElementById("recipe_taste_attribute"));
    document.getElementById("recipe_taste").value = uid.getAttribute("recipe_taste_attribute");
    document.getElementById("StartLocation").value = uid.getAttribute("start_attribute");
    document.getElementById("Destination").value = uid.getAttribute("dest_attribute");
    document.getElementById("Confirm").style.display="block";
}

/**
 * This function gets the newData from the form fields and sends it to the display function.
 * @returns {Promise<void>}
 * @constructor
 */
// async function NewData(){
//     const recipe_name = document.querySelector( "#recipe_name" ),
//         recipe_ingredients = document.querySelector( "#recipe_ingredients" ),
//         recipe_description = document.querySelector( "#recipe_description" ),
//         recipe_taste = document.querySelector( "#recipe_taste" ),
//         StartLocation = document.querySelector( "#StartLocation" ),
//         Destination = document.querySelector( "#Destination" ),
//         Transport =document.querySelector("#transport-mode")
//     const json = {
//         recipe_name: recipe_name.value,
//         recipe_ingredients: recipe_ingredients.value,
//         recipe_description: recipe_description.value,
//         recipe_taste: recipe_taste.value,
//         StartLocation: StartLocation.value,
//         Destination: Destination.value,
//         Transport: Transport.value,
//     }
//         body = JSON.stringify( json )
//     const response = await fetch("/submit", {
//         method: "PUT",
//         body
//     });
//     const text = await response.text();
//     document.getElementById("Confirm").style.display="none";
//     display(JSON.parse(text));
//     console.log("updated here for NewData"+JSON.stringify(text))
// }

/**
 * This function displays the data in the table.
 * @param object The object to display in the table.
 * @returns {Promise<void>}
 */
async function display(object){
    console.log("updated here for display"+JSON.stringify(object));
    let table = document.querySelector("#data_body");
    let elements=""
    table.innerHTML=" "
    for(let i=0; i<object.length;i++){
        elements=`<td>${i}</td> <td>${object[i].recipe_name}</td> <td>${object[i].recipe_ingredients}</td>
        <td>${object[i].recipe_description}</td> <td >${object[i].recipe_taste}</td><td>${object[i].dietary_restriction}</td>
         <td><input type="button" class="" value="update" onclick="modify(this)" id="update" 
        ${object[i].recipe_taste ? `recipe_taste_attribute="${object[i].recipe_taste}"` : ''}
        ${object[i].recipe_name ? `recipe_name_attribute="${object[i].recipe_name}"` : ''}
        ${object[i].recipe_ingredients ? `recipe_ingredients_attribute="${object[i].recipe_ingredients}"` : ''}
        ${object[i].recipe_description ? `recipe_description_attribute="${object[i].recipe_description}"` : ''}
        ${object[i].dietary_restriction ? `dietary_restriction_attribute="${object[i].dietary_restriction}"` : ''}
        ></input></td>
         <td><input type="button" value="Delete" del_attribute=${i} onclick="del(123)" id="delete" class="btn btn-blue"></input></td>`
        let entries = `<tr>${elements}</tr>`
        table.innerHTML += entries;
    }
}

/**
 * This function is called when the window loads.
 * It send a GET request to the server to get the data to display.
 * @returns {Promise<void>}
 */
window.onload = async function() {
    const button = document.querySelector("#Submit");
    button.onclick = submit;
    //`/GetRecipe?id=${req.params.id}`
    const response = await fetch("/GetRecipe?id=123", {
        method: "GET",
    });
    const text = await response.text();
    display(JSON.parse(text));
}