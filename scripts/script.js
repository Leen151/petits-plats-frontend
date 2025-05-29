import { recipeCard, createTagSelect } from "./template.js";
import { getData, getIngredients, getAppliance, getUstensils } from "./Api.js";
import { searchRecipes } from "./search.js"

async function main() {
	const sectionGallery = document.querySelector(".gallery-recipes");

	const inputSearch = document.querySelector(".searchbar");
	const cross = document.querySelector(".cross");
	const tagSelectContainer = document.querySelector('.tag-search');

	let selectedIngredients = [];
	let selectedAppliances = [];
	let selectedUstensils = [];

	const recipesData = await getData();
	const ingredients = await getIngredients(recipesData);
	const appliances = await getAppliance(recipesData);
	const ustensils = await getUstensils(recipesData);

	const tags = [
		{ type: "ingredients", titre: "Ingrédients", values: ingredients },
		{ type: "appliances", titre: "Appareils", values: appliances },
		{ type: "ustensils", titre: "Ustensiles", values: ustensils }
	];

	tags.forEach(tag => {
		const tagComponent = createTagSelect(tag.type, tag.titre, tag.values);
		tagSelectContainer.appendChild(tagComponent);
	});

	let recipe = recipesData;

	// Récupérer les éléments de liste après leur création
	const listIngredients = document.querySelector(".list-ingredients");
	const listAppliances = document.querySelector(".list-appliances");
	const listUstensils = document.querySelector(".list-ustensils");


	const chevronIcons = document.querySelectorAll(".icone-chevron");

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
		const keywordInput = inputSearch.value;
		cross.classList.toggle('show', keywordInput.length > 0);

		if (keywordInput.length > 2) {
			const filteredRecipes = searchRecipes(recipesData, keywordInput, [], [], []);
			displayRecipes(filteredRecipes);
			await updateFilters(filteredRecipes);
		}
		//si on ne met pas le else, quand on eface le champs de saisie, la liste de recette ne se réactualise pas (pour moins de 3 caractères)
		else {
			displayRecipes(recipesData);
			await updateFilters(recipesData);
		}
	});

	// Gestion de la recherche dans les listes de filtres
	const searchInputs = document.querySelectorAll('.tag input[type="text"]');
	searchInputs.forEach(input => {
		const cross = input.nextElementSibling; // La croix est l'élément suivant l'input

		input.addEventListener('input', async (e) => {
			const searchValue = e.target.value.toLowerCase();
			const filterList = e.target.closest('.tag').querySelector('.list');
			const filterType = e.target.closest('.tag').classList.contains('ingredients') ? 'ingredient' :
							  e.target.closest('.tag').classList.contains('appliances') ? 'appliance' : 'ustensil';

			// Afficher/masquer la croix en fonction de la présence de texte
			cross.classList.toggle('show', searchValue.length > 0);

			// Filtrer les éléments en fonction de la recherche
			const filteredItems = filterList.querySelectorAll('li');
			const filteredValues = Array.from(filteredItems)
				.map(item => item.textContent)
				.filter(text => text.toLowerCase().includes(searchValue));

			// Mettre à jour l'affichage avec les éléments filtrés
			displayFilters(filteredValues, filterList, filterType);
		});

		// event clic sur la croix
		cross.addEventListener('click', async () => {
			input.value = ''; // Vider le champ
			cross.classList.remove('show'); // Masquer la croix
			
			// Réinitialiser la liste avec tous les éléments
			const filterList = input.closest('.tag').querySelector('.list');
			const filterType = input.closest('.tag').classList.contains('ingredients') ? 'ingredient' :
							  input.closest('.tag').classList.contains('appliances') ? 'appliance' : 'ustensil';
			
			// Récupérer les valeurs originales en fonction du type de filtre
			let originalValues;
			if (filterType === 'ingredient') {
				originalValues = await getIngredients(recipesData);
			} else if (filterType === 'appliance') {
				originalValues = await getAppliance(recipesData);
			} else {
				originalValues = await getUstensils(recipesData);
			}

			displayFilters(originalValues, filterList, filterType);
		});
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

		//Compteur de recettes
		const nbRecipes = document.querySelector('.nb-recipes');
		nbRecipes.textContent = `${recipes.length} recette${recipes.length > 1 ? 's' : ''}`;

		// Si aucune recette n'est trouvée
		if (recipes.length === 0) {
			sectionGallery.classList.add('empty');
			const noResultMessage = document.createElement('div');
			noResultMessage.classList.add('no-result-message');
			noResultMessage.innerHTML = `
            <p>Aucune recette ne contient « ${inputSearch.value} » </p>
            <p>Vous pouvez chercher « tarte aux pommes », « poisson », etc.</p>
        `;
			sectionGallery.appendChild(noResultMessage);
			return;
		}

		// Retirer la classe empty si elle existe
		sectionGallery.classList.remove('empty');

		//sinon créer la nouvelle galerie
		recipes.forEach(recipe => {
			sectionGallery.appendChild(recipeCard(recipe));
		});
	}

	function displayFilters(items, domElement, filterType) {
		//console.log(items)
		//console.log(domElement)
		//console.log(filterType)
		//on réinitialise
		domElement.innerHTML = "";
		//on crée la liste
		items.forEach(object => {
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


document.addEventListener('DOMContentLoaded', () => {
	main();
});