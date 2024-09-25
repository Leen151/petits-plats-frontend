import {recipeCard} from "./template.js";
import {getData, getIngredients, getAppliance, getUstensils} from "./Api.js";
import {searchRecipesByKeyword} from "./search.js"

async function main() {
	const sectionGallery = document.querySelector(".gallery-recipes");
	const listIngredients = document.querySelector(".list-ingredients");
	const listAppliances = document.querySelector(".list-appliances");
	const listUstensils = document.querySelector(".list-ustensils");
	const inputSearch = document.querySelector(".searchbar");
	const chevronIcons = document.querySelectorAll(".icone-chevron");
	const cross = document.querySelector(".cross");

	let selectedIngredients = [];
	let selectedAppliances = [];
	let selectedUstensils = [];

	const recipesData = await getData();
	const ingredients = await getIngredients(recipesData);
	const appliances = await getAppliance(recipesData);
	const ustensils = await getUstensils(recipesData);

	let recipe = recipesData;

	displayFilters(ingredients, listIngredients, "ingredient");
	displayFilters(appliances, listAppliances, "appliance");
	displayFilters(ustensils, listUstensils, "ustensil");

	displayRecipes(recipesData);

	const sectionGallery = document.querySelector(".gallery-recipes")

	recipesData.forEach(recipe => {
		sectionGallery.appendChild(recipeCard(recipe));
	//ouverture des liste de filtres
	chevronIcons.forEach(chevron => {
		chevron.addEventListener("click", () => {
				// Trouver la div englobant le filtre concerné par le clic
				const containerDiv = chevron.closest(".tag");
				// on cible la div "collapse" dans cette div englobante
				const collapseDiv = containerDiv.querySelector(".collapse");

				// Ajouter ou supprimer la class "show" pour afficher ou masquer la liste
				collapseDiv.classList.toggle("show");
				chevron.classList.toggle("to-close");
		});
	});




	/////// Partie fonctions ////////
	/////////////////////////////////

	function displayRecipes(recipes) {
		//Efface la galerie de recette prééxistante
		sectionGallery.innerHTML = "";
		//en créer une nouvelle
		recipes.forEach(recipe => {
			sectionGallery.appendChild(recipeCard(recipe));
		});
	}

	function displayFilters(filter, domElement){
		//on réinitialise
		domElement.innerHTML = "";
		//on crée la liste
		filter.forEach(object => {
			const li = document.createElement('li');
			li.textContent = object;
			domElement.appendChild(li);
			li.classList.add("filter");
		});

		//event
		const filters = document.querySelectorAll(".filter");
		console.log(filters)

		filters.forEach(filter => {
			filter.addEventListener("click", (e) => {
				console.log(filter.textContent)

				//ajouter le filter à la liste de filtre selectionnés

				//reactualiser la galerie de recette

			})
		});
	}

}
main();