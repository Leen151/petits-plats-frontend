import { recipeCard, createTagSelect, createSelectedTag } from "./template.js";
import { getData, getIngredients, getAppliance, getUstensils } from "./Api.js";
import { searchRecipes } from "./search.js";

async function main() {
	const sectionGallery = document.querySelector(".gallery-recipes");
	const inputSearch = document.querySelector(".searchbar");
	const formSearch = document.querySelector(".form-search");

	let selectedIngredients = [];
	let selectedAppliances = [];
	let selectedUstensils = [];

	//récupération des données
	const recipesData = await getData();
	const ingredients = getIngredients(recipesData);
	const appliances = getAppliance(recipesData);
	const ustensils = getUstensils(recipesData);

	//création des listes de filtres
	const tagSelectContainer = document.querySelector(".tag-search");

	const tags = [
		{ type: "ingredients", titre: "Ingrédients", values: ingredients },
		{ type: "appliances", titre: "Appareils", values: appliances },
		{ type: "ustensils", titre: "Ustensiles", values: ustensils }
	];

	tags.forEach(tag => {
		const tagComponent = createTagSelect(tag.type, tag.titre, tag.values);
		tagSelectContainer.appendChild(tagComponent);
	});

	// Récupérer les éléments de liste après leur création
	const listIngredients = document.querySelector(".list-ingredients");
	const listAppliances = document.querySelector(".list-appliances");
	const listUstensils = document.querySelector(".list-ustensils");
	const chevronIcons = document.querySelectorAll(".icone-chevron");


	//primo affichage des recettes
	displayRecipes(recipesData);


	//////// Les events /////////
	/////////////////////////////

	// Event listener pour l'icône cross de la barre de recherche
	const crossSearch = document.querySelector(".cross-search");
	crossSearch.addEventListener("click", () => {
		inputSearch.value = ""; // Réinitialise le champ de recherche
		crossSearch.classList.remove("show"); // Cache l'icône cross

		// Filtrer les recettes en gardant les tags sélectionnés si il y en a
		const filteredRecipes = searchRecipes(
			recipesData,
			"", // mot-clé vide
			selectedIngredients,
			selectedAppliances,
			selectedUstensils
		);

		displayRecipes(filteredRecipes); // Affiche les recettes filtrées
		updateFilters(filteredRecipes); // Met à jour les filtres
	});

	//event de la recherche par mot clé
	inputSearch.addEventListener("input", async () => {
		const keywordInput = escapeHtml(inputSearch.value);
		crossSearch.classList.toggle("show", keywordInput.length > 0);

		if (keywordInput.length > 2) {
			const filteredRecipes = searchRecipes(recipesData, keywordInput, selectedIngredients, selectedAppliances, selectedUstensils);
			displayRecipes(filteredRecipes);
			updateFilters(filteredRecipes);
		}
		//si on ne met pas le else, quand on efface le champs de saisie, la liste de recette ne se réactualise pas (pour moins de 3 caractères)
		else {
			displayRecipes(recipesData);
			updateFilters(recipesData);
		}
	});

	// simule la soumission de l'input de recherche (expérience utilisateur)
	formSearch.addEventListener("submit", (e) => {
		e.preventDefault();
		inputSearch.blur();
	});

	// Gestion de la recherche dans les listes de filtres
	const searchInputs = document.querySelectorAll(".tag input[type=\"text\"]");
	searchInputs.forEach(input => {
		const cross = input.nextElementSibling; // La croix est l'élément suivant l'input

		input.addEventListener("input", async (e) => {
			const searchValue = escapeHtml(e.target.value.toLowerCase());
			const filterList = e.target.closest(".tag").querySelector(".list");
			const filterType = filterList.classList.contains("list-ingredients") ? "ingredient" :
				filterList.classList.contains("list-appliances") ? "appliance" : "ustensil";

			// Afficher/masquer la croix en fonction de la présence de texte
			cross.classList.toggle("show", searchValue.length > 0);

			// Récupérer les recettes filtrées actuelles
			const keywordInput = inputSearch.value;
			const currentFilteredRecipes = searchRecipes(recipesData, keywordInput, selectedIngredients, selectedAppliances, selectedUstensils);

			// Utiliser les valeurs filtrées en fonction du type de filtre
			let originalValues;
			if (filterType === "ingredient") {
				originalValues = getIngredients(currentFilteredRecipes);
			} else if (filterType === "appliance") {
				originalValues = getAppliance(currentFilteredRecipes);
			} else if (filterType === "ustensil") {
				originalValues = getUstensils(currentFilteredRecipes);
			}

			// Filtrer les éléments en fonction de la recherche
			const filteredValues = originalValues.filter(item =>
				item.toLowerCase().includes(searchValue)
			);

			// Mettre à jour l'affichage avec les éléments filtrés
			displayFilters(filteredValues, filterList, filterType);
		});

		// event clic sur la croix
		cross.addEventListener("click", async () => {
			input.value = ""; // Vider le champ
			cross.classList.remove("show"); // Masquer la croix

			// Réinitialiser la liste avec tous les éléments
			const filterList = input.closest(".tag").querySelector(".list");
			const filterType = filterList.classList.contains("list-ingredients") ? "ingredient" :
				filterList.classList.contains("list-appliances") ? "appliance" : "ustensil";

			// Récupérer les recettes filtrées actuelles
			const keywordInput = inputSearch.value;
			const currentFilteredRecipes = searchRecipes(recipesData, keywordInput, selectedIngredients, selectedAppliances, selectedUstensils);

			// Utiliser les valeurs filtrées en fonction du type de filtre
			let originalValues;
			if (filterType === "ingredient") {
				originalValues = getIngredients(currentFilteredRecipes);
			} else if (filterType === "appliance") {
				originalValues = getAppliance(currentFilteredRecipes);
			} else if (filterType === "ustensil") {
				originalValues = getUstensils(currentFilteredRecipes);
			}

			displayFilters(originalValues, filterList, filterType);
		});
	});

	//ouverture des listes de filtres (collapse)
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

	// Ajouter les écouteurs d'événements sur les listes spécifiques
	if (listIngredients) {
		listIngredients.addEventListener("click", (e) => handleFilterClick(e, "ingredient"));
	}
	if (listAppliances) {
		listAppliances.addEventListener("click", (e) => handleFilterClick(e, "appliance"));
	}
	if (listUstensils) {
		listUstensils.addEventListener("click", (e) => handleFilterClick(e, "ustensil"));
	}

	//event de clic sur la croix d'un tag sélectionné
	document.addEventListener("click", (e) => {
		if (e.target.classList.contains("cross-tag")) {
			const tag = e.target.closest("li");
			const value = tag.textContent.trim();
			const type = tag.classList.contains("ingredient-tag") ? "ingredient" :
				tag.classList.contains("appliance-tag") ? "appliance" : "ustensil";

			// Supprimer le tag du tableau correspondant
			if (type === "ingredient") {
				selectedIngredients = selectedIngredients.filter(item => item !== value);
			} else if (type === "appliance") {
				selectedAppliances = selectedAppliances.filter(item => item !== value);
			} else if (type === "ustensil") {
				selectedUstensils = selectedUstensils.filter(item => item !== value);
			}

			// Supprimer le tag de l'affichage
			tag.remove();

			// Mettre à jour l'affichage global (recettes et listes)
			const keywordInput = inputSearch.value;
			const filteredRecipes = searchRecipes(recipesData, keywordInput, selectedIngredients, selectedAppliances, selectedUstensils);
			displayRecipes(filteredRecipes);
			updateFilters(filteredRecipes);
		}
	});

	/////// Partie fonctions ////////
	/////////////////////////////////

	// Fonction pour échapper le HTML et qu'il ne soit pas interprété
	function escapeHtml(str) {
		return str
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}

	//créer la galerie de recettes
	function displayRecipes(recipes) {
		//Efface la galerie de recette prééxistante
		sectionGallery.innerHTML = "";

		//Compteur de recettes
		const nbRecipes = document.querySelector(".nb-recipes");
		nbRecipes.textContent = `${recipes.length} recette${recipes.length > 1 ? "s" : ""}`;

		// Si aucune recette n'est trouvée
		if (recipes.length === 0) {
			sectionGallery.classList.add("empty");
			const noResultMessage = document.createElement("div");
			noResultMessage.classList.add("no-result-message");
			noResultMessage.innerHTML = `
            	<p>Aucune recette ne contient « ${escapeHtml(inputSearch.value)} » </p>
            	<p>Vous pouvez chercher « tarte aux pommes », « poisson », etc.</p>
        	`;
			sectionGallery.appendChild(noResultMessage);
			return;
		}

		// Retirer la classe empty si elle existe (on est sorti du if "pas de recette")
		sectionGallery.classList.remove("empty");

		// créer la nouvelle galerie
		for (let i = 0; i < recipes.length; i++) {
			sectionGallery.appendChild(recipeCard(recipes[i]));
		}
	}

	//créer une liste d'un filtre
	function displayFilters(items, domElement, filterType) {
		//on réinitialise
		domElement.innerHTML = "";

		// correspondance entre type dela liste et le tableau et classe
		const typeInfos = {
			ingredient: {
				array: selectedIngredients,
				tagClass: "ingredient-tag"
			},
			appliance: {
				array: selectedAppliances,
				tagClass: "appliance-tag"
			},
			ustensil: {
				array: selectedUstensils,
				tagClass: "ustensil-tag"
			}
		};

		//on crée la liste
		for (let i = 0; i < items.length; i++) {
			const li = document.createElement("li");
			li.textContent = items[i];
			domElement.appendChild(li);
			li.classList.add("filter");

			// on ajoute la classe yellow si l'élément est en tag-selected (donc dans un des tableaux)
			let isInArray = false;
			for (let j = 0; j < typeInfos[filterType].array.length; j++) {
				if (typeInfos[filterType].array[j] === items[i]) {
					isInArray = true;
					break;
				}
			}
			if (isInArray) {
				li.classList.add("yellow");
			}

			// Ajout de la classe correspondant au type
			li.classList.add(typeInfos[filterType].tagClass);
		}
	}

	function updateFilters(newRecipesList) {
		// Mettre à jour les ingrédients
		const filteredIngredients = getIngredients(newRecipesList);
		displayFilters(filteredIngredients, listIngredients, "ingredient");

		// Mettre à jour les appareils
		const filteredAppliances = getAppliance(newRecipesList);
		displayFilters(filteredAppliances, listAppliances, "appliance");

		// Mettre à jour les ustensiles
		const filteredUstensils = getUstensils(newRecipesList);
		displayFilters(filteredUstensils, listUstensils, "ustensil");
	}

	function handleFilterClick(e, type) {
		const filter = e.target.closest(".filter"); //on récupère le filtre cliqué
		if (!filter) return;

		const filterValue = filter.textContent;

		// Ajouter le filtre au tableau correspondant
		// et créer un tag-selected
		if (type === "ingredient" && !selectedIngredients.includes(filterValue)) {
			selectedIngredients.push(filterValue);
			createSelectedTag(filterValue, "ingredient");
		} else if (type === "appliance" && !selectedAppliances.includes(filterValue)) {
			selectedAppliances.push(filterValue);
			createSelectedTag(filterValue, "appliance");
		} else if (type === "ustensil" && !selectedUstensils.includes(filterValue)) {
			selectedUstensils.push(filterValue);
			createSelectedTag(filterValue, "ustensil");
		}

		const keywordInput = inputSearch.value;
		const filteredRecipes = searchRecipes(recipesData, keywordInput, selectedIngredients, selectedAppliances, selectedUstensils);
		displayRecipes(filteredRecipes);
		updateFilters(filteredRecipes);
	}
}


document.addEventListener("DOMContentLoaded", () => {
	main();
});