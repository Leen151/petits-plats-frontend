import { recipeCard, createTagSelect } from "./template.js";
import { getData, getIngredients, getAppliance, getUstensils } from "./Api.js";
import { searchRecipes } from "./search.js"

async function main() {
	const sectionGallery = document.querySelector(".gallery-recipes");

	const inputSearch = document.querySelector(".searchbar");
	const cross = document.querySelector(".cross");
	const tagSelectContainer = document.querySelector('.tag-search');
	const formSearch = document.querySelector('.form-search');

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

		// Filtrer les recettes en gardant les tags sélectionnés si il y en a
		const filteredRecipes = searchRecipes(
			recipesData,
			'', // mot-clé vide
			selectedIngredients,
			selectedAppliances,
			selectedUstensils
		);

		displayRecipes(filteredRecipes); // Affiche les recettes filtrées
		await updateFilters(filteredRecipes); // Met à jour les filtres
	});

	//event de la recherche par mot clé
	inputSearch.addEventListener('input', async () => {
		const keywordInput = escapeHtml(inputSearch.value);
		cross.classList.toggle('show', keywordInput.length > 0);

		if (keywordInput.length > 2) {
			const filteredRecipes = searchRecipes(recipesData, keywordInput, selectedIngredients, selectedAppliances, selectedUstensils);
			displayRecipes(filteredRecipes);
			await updateFilters(filteredRecipes);
		}
		//si on ne met pas le else, quand on efface le champs de saisie, la liste de recette ne se réactualise pas (pour moins de 3 caractères)
		else {
			displayRecipes(recipesData);
			await updateFilters(recipesData);
		}
	});

	// simule la soumission de l'input de recherche
	formSearch.addEventListener('submit', (e) => {
		e.preventDefault();
		inputSearch.blur();
	});

	// Gestion de la recherche dans les listes de filtres
	const searchInputs = document.querySelectorAll('.tag input[type="text"]');
	searchInputs.forEach(input => {
		const cross = input.nextElementSibling; // La croix est l'élément suivant l'input

		input.addEventListener('input', async (e) => {
			const searchValue = escapeHtml(e.target.value.toLowerCase());
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
		listIngredients.addEventListener('click', (e) => handleFilterClick(e, 'ingredient'));
	}
	if (listAppliances) {
		listAppliances.addEventListener('click', (e) => handleFilterClick(e, 'appliance'));
	}
	if (listUstensils) {
		listUstensils.addEventListener('click', (e) => handleFilterClick(e, 'ustensil'));
	}

	//event de clic sur la croix d'un tag sélectionné
	document.addEventListener('click', (e) => {
		if (e.target.classList.contains('cross-tag')) {
			const tag = e.target.closest('li');
			const value = tag.textContent.trim();
			const type = tag.classList.contains('ingredient-tag') ? 'ingredient' :
						 tag.classList.contains('appliance-tag') ? 'appliance' : 'ustensil';

			// Supprimer le tag du tableau correspondant
			if (type === 'ingredient') {
				selectedIngredients = selectedIngredients.filter(item => item !== value);
			} else if (type === 'appliance') {
				selectedAppliances = selectedAppliances.filter(item => item !== value);
			} else if (type === 'ustensil') {
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
	function escapeHtml(unsafe) {
		return unsafe
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}

	//créer un tag-selected
	function createSelectedTag(value, type) {
		const tagSelected = document.querySelector('.tag-selected ul');
		const li = document.createElement('li');

		// ajout du texte du tag
		li.textContent = value;

		// icône de croix
		const cross = document.createElement('i');
		cross.classList.add('fa-solid', 'fa-xmark', 'cross-tag');
		li.appendChild(cross);

		// ajout de la classe correspondant au type de tag (utile pour la suppression)
		li.classList.add(`${type}-tag`);
		tagSelected.appendChild(li);
	}

	//créer la galerie de recettes
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
		items.forEach(item => {
			const li = document.createElement('li');
			li.textContent = item;
			domElement.appendChild(li);
			li.classList.add("filter");

			// on ajoute la classe yellow si l'élément est en tag-selected (donc dans un des tableaux)
			if (typeInfos[filterType].array.includes(item)) {
				li.classList.add("yellow");
			}

			// Ajout de la classe correspondant au type
			li.classList.add(typeInfos[filterType].tagClass);
		});
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

	function handleFilterClick(e, type) {
		const filter = e.target.closest('.filter');
		if (!filter) return;

		const filterValue = filter.textContent;

		// Ajouter le filtre au tableau correspondant
		// et créer un tag-selected
		if (type === 'ingredient' && !selectedIngredients.includes(filterValue)) {
			selectedIngredients.push(filterValue);
			createSelectedTag(filterValue, 'ingredient');
		} else if (type === 'appliance' && !selectedAppliances.includes(filterValue)) {
			selectedAppliances.push(filterValue);
			createSelectedTag(filterValue, 'appliance');
		} else if (type === 'ustensil' && !selectedUstensils.includes(filterValue)) {
			selectedUstensils.push(filterValue);
			createSelectedTag(filterValue, 'ustensil');
		}

		const keywordInput = inputSearch.value;
		const filteredRecipes = searchRecipes(recipesData, keywordInput, selectedIngredients, selectedAppliances, selectedUstensils);
		displayRecipes(filteredRecipes);
		updateFilters(filteredRecipes);
	}
}


document.addEventListener('DOMContentLoaded', () => {
	main();
});