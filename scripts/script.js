import {recipeCard} from "./template.js";
import {getData} from "./Api.js";

async function main() {
	const recipesData = await getData();
	console.log(recipesData)

	const sectionGallery = document.querySelector(".gallery-recipes")

	recipesData.forEach(recipe => {
		sectionGallery.appendChild(recipeCard(recipe));
	});

}
main();