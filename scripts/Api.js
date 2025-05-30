async function getData() {
	return await fetch("../data/recipes.json")
		.then(res => res.json())
		.then(res => res.recipes)
		.catch(err => console.log("an error occurs", err));
}

function getIngredients(recipe) {
	if (!recipe || recipe.length === 0) {
		return [];
	}

	// Création d'un tableau pour stocker tous les ingrédients
	let allIngredients = [];
	let allIngredientsIndex = 0;

	// Parcourir toutes les recettes
	for (let i = 0; i < recipe.length; i++) {
		// Parcourir les ingrédients de chaque recette
		for (let j = 0; j < recipe[i].ingredients.length; j++) {
			// Ajouter l'ingrédient en minuscules
			allIngredients[allIngredientsIndex] = recipe[i].ingredients[j].ingredient.toLowerCase();
			allIngredientsIndex++;
		}
	}

	// Création d'un tableau pour les ingrédients uniques
	let uniqueIngredients = [];
	let uniqueIndex = 0;

	// Parcourir tous les ingrédients
	for (let i = 0; i < allIngredients.length; i++) {
		let isDuplicate = false;

		// Vérifier si l'ingrédient existe déjà dans uniqueIngredients
		for (let j = 0; j < uniqueIngredients.length; j++) {
			if (allIngredients[i] === uniqueIngredients[j]) {
				isDuplicate = true;
				break;
			}
		}

		// Si ce n'est pas un doublon, l'ajouter
		if (!isDuplicate) {
			uniqueIngredients[uniqueIndex] = allIngredients[i];
			uniqueIndex++;
		}
	}

	return uniqueIngredients;
}

function getAppliance(recipe) {
	if (!recipe || recipe.length === 0) {
		return [];
	}

	let allAppliances = [];
	let allAppliancesIndex = 0;

	for (let i = 0; i < recipe.length; i++) {
		allAppliances[allAppliancesIndex] = recipe[i].appliance.toLowerCase();
		allAppliancesIndex++;
	}

	let uniqueAppliances = [];
	let uniqueIndex = 0;

	for (let i = 0; i < allAppliances.length; i++) {
		let isDuplicate = false;

		for (let j = 0; j < uniqueAppliances.length; j++) {
			if (allAppliances[i] === uniqueAppliances[j]) {
				isDuplicate = true;
				break;
			}
		}

		if (!isDuplicate) {
			uniqueAppliances[uniqueIndex] = allAppliances[i];
			uniqueIndex++;
		}
	}

	return uniqueAppliances;
}

function getUstensils(recipe) {
	if (!recipe || recipe.length === 0) {
		return [];
	}

	let allUstensils = [];
	let allUstensilsIndex = 0;

	for (let i = 0; i < recipe.length; i++) {
		for (let j = 0; j < recipe[i].ustensils.length; j++) {
			allUstensils[allUstensilsIndex] = recipe[i].ustensils[j].toLowerCase();
			allUstensilsIndex++;
		}
	}

	let uniqueUstensils = [];
	let uniqueIndex = 0;

	for (let i = 0; i < allUstensils.length; i++) {
		let isDuplicate = false;

		for (let j = 0; j < uniqueUstensils.length; j++) {
			if (allUstensils[i] === uniqueUstensils[j]) {
				isDuplicate = true;
				break;
			}
		}

		if (!isDuplicate) {
			uniqueUstensils[uniqueIndex] = allUstensils[i];
			uniqueIndex++;
		}
	}

	return uniqueUstensils;
}

export { getData, getIngredients, getAppliance, getUstensils };



