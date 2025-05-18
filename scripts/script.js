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

	// Event listener pour l'icône cross de la barre de recherche
	cross.addEventListener('click', () => {
		inputSearch.value = ''; // Réinitialise le champ de recherche
		cross.classList.remove('show'); // Cache l'icône cross
		displayRecipes(recipesData); // Réaffiche toutes les recettes
	});

	//////// Les events /////////
	/////////////////////////////

	inputSearch.addEventListener('input', () => {
		const keywordInput = inputSearch.value.toLowerCase();
		//console.log(keywordInput)

		// Gestion de l'affichage de l'icône cross
		if (keywordInput.length > 0) {
			cross.classList.add('show');
		} else {
			cross.classList.remove('show');
		}

		if (keywordInput.length > 2) {
			const filteredRecipes = searchRecipesByKeyword(keywordInput, recipesData);
			//recipesData = filteredRecipes;
			displayRecipes(filteredRecipes);
		}
		//si on ne met pas le else, quand on eface le champs de saisie, la liste de recette ne se réactualise pas (pour moins de 3 caractères)
		else{			
			displayRecipes(recipesData);
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
				const containerUL = e.target.closest(".list");
				console.log(containerUL.classList)
			})
		});
	}










	// function displayFilters(filter, domElement, filterType){
  //   domElement.innerHTML = '';
    
  //   filter.forEach(object => {
  //       const li = document.createElement('li');
  //       li.textContent = object;
  //       domElement.appendChild(li);
  //       li.classList.add("filter");

	// 			if (filterType == "ingredient") {
	// 				li.classList.add("ingredient-tag");
	// 			} else if (filterType == "appliance") {
	// 				li.classList.add("appliance-tag");
	// 			} else if (filterType == "ustensil") {
	// 				li.classList.add("ustensil-tag");
	// 			}
  //   });

  //   const filters = document.querySelectorAll(".filter");

  //   filters.forEach(filter => {
	// 		filter.addEventListener("click", () => {
	// 				const filterValue = filter.textContent;
	// 				console.log(filterValue)
	// 				console.log(selectedAppliances);
					
	// 				if (filter.classList.contains("ingredient-tag")) {
	// 						addFilter(selectedIngredients, filterValue);
	// 				} else if (filter.classList.contains("appliance-tag")) {
	// 						addFilter(selectedAppliances, filterValue);
	// 						console.log(selectedAppliances)
	// 				} else if (filter.classList.contains("ustensil-tag")) {
	// 						addFilter(selectedUstensils, filterValue);
	// 				}

	// 				//updateFilteredRecipes();
	// 		});
  //   });
	// }

	// // Fonction pour ajouter un filtre du tableau
	// function addFilter(filterArray, filterValue) {
	// 	filterArray.push(filterValue);
	// }

	// function updateFilteredRecipes() {
  //   const filteredRecipes = recipesData.filter(recipe => {
  //       // Vérifier que tous les ingrédients sélectionnés sont dans la recette
  //       const ingredientsMatch = selectedIngredients.every(ingredient =>
  //           recipe.ingredients.some(ing => ing.ingredient.toLowerCase() === ingredient.toLowerCase())
  //       );

  //       // Vérifier que l'appareil sélectionné est celui de la recette
  //       const applianceMatch = selectedAppliances.length === 0 || selectedAppliances.includes(recipe.appliance);

  //       // Vérifier que tous les ustensiles sélectionnés sont dans la recette
  //       const ustensilsMatch = selectedUstensils.every(ustensil =>
  //           recipe.ustensils.includes(ustensil)
  //       );

  //       return ingredientsMatch && applianceMatch && ustensilsMatch;
  //   });

  //   displayRecipes(filteredRecipes);
	// }

}
main();