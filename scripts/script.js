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

	
	//////// Les events /////////
	/////////////////////////////
	
	// Event listener pour l'icône cross de la barre de recherche
	cross.addEventListener('click', async () => {
		inputSearch.value = ''; // Réinitialise le champ de recherche
		cross.classList.remove('show'); // Cache l'icône cross
		displayRecipes(recipesData); // Réaffiche toutes les recettes
		await updateFilters(recipesData); // Met à jour les filtres
	});
	
	inputSearch.addEventListener('input', async () => {
		const keywordInput = inputSearch.value.toLowerCase();
		cross.classList.toggle('show', keywordInput.length > 0);

		if (keywordInput.length > 2) {
			const filteredRecipes = searchRecipesByKeyword(keywordInput, recipesData);
			displayRecipes(filteredRecipes);
			await updateFilters(filteredRecipes);
		}
		//si on ne met pas le else, quand on eface le champs de saisie, la liste de recette ne se réactualise pas (pour moins de 3 caractères)
		else{			
			displayRecipes(recipesData);
			await updateFilters(recipesData);
		}
	});	

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

	function displayFilters(filter, domElement, filterType){
		//on réinitialise
		domElement.innerHTML = "";
		//on crée la liste
		filter.forEach(object => {
			const li = document.createElement('li');
			li.textContent = object;
			domElement.appendChild(li);
			li.classList.add("filter");

			if (filterType === "ingredient") {
				li.classList.add("ingredient-tag");
			} else if (filterType === "appliance") {
				li.classList.add("appliance-tag");
			} else if (filterType === "ustensil") {
				li.classList.add("ustensil-tag");
			}
		});

		//event
		const filters = document.querySelectorAll(".filter");

		filters.forEach(filter => {
			filter.addEventListener("click", (e) => {
				const filterValue = filter.textContent;
				
				if (filter.classList.contains("ingredient-tag")) {
					addFilter(selectedIngredients, filterValue);
				} else if (filter.classList.contains("appliance-tag")) {
					addFilter(selectedAppliances, filterValue);
				} else if (filter.classList.contains("ustensil-tag")) {
					addFilter(selectedUstensils, filterValue);
				}

				updateFilteredRecipes();
			});
		});
	}

	function addFilter(filterArray, filterValue) {
		if (!filterArray.includes(filterValue)) {
			filterArray.push(filterValue);
		}
	}

	async function updateFilteredRecipes() {
		const filteredRecipes = recipesData.filter(recipe => {
			// Vérifier que tous les ingrédients sélectionnés sont dans la recette
			const ingredientsMatch = selectedIngredients.every(ingredient =>
				recipe.ingredients.some(ing => ing.ingredient.toLowerCase() === ingredient.toLowerCase())
			);

			// Vérifier que l'appareil sélectionné est celui de la recette
			const applianceMatch = selectedAppliances.length === 0 || selectedAppliances.includes(recipe.appliance);

			// Vérifier que tous les ustensiles sélectionnés sont dans la recette
			const ustensilsMatch = selectedUstensils.every(ustensil =>
				recipe.ustensils.includes(ustensil)
			);

			return ingredientsMatch && applianceMatch && ustensilsMatch;
		});

		displayRecipes(filteredRecipes);
		await updateFilters(filteredRecipes);
	}

	async function updateFilters(recipes) {
		// Mettre à jour les ingrédients
		const filteredIngredients = getIngredients(recipes);
		displayFilters(filteredIngredients, listIngredients, "ingredient");

		// Mettre à jour les appareils
		const filteredAppliances = getAppliance(recipes);
		displayFilters(filteredAppliances, listAppliances, "appliance");

		// Mettre à jour les ustensiles
		const filteredUstensils = await getUstensils(recipes);
		displayFilters(filteredUstensils, listUstensils, "ustensil");
	}

}
main();