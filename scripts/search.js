//on donne une valeur par défaut aux paramètres pour éviter les erreurs
function searchRecipes(recipes, keyword = "", selectedIngredients = [], selectedAppliances = [], selectedUstensils = []) {
	// Étape 1 : filtrage par mot-clé
	const lowerKeyword = keyword.toLowerCase().trim();
	let filteredByKeyword = recipes;

	if (lowerKeyword.length > 2) {
		filteredByKeyword = filteredByKeyword.filter(recipe =>
			recipe.name.toLowerCase().includes(lowerKeyword) ||
			recipe.description.toLowerCase().includes(lowerKeyword) ||
			recipe.ingredients.some(ing => ing.ingredient.toLowerCase().includes(lowerKeyword))
		);
	}
	else {
		filteredByKeyword = recipes;
	}

	// Étape 2 : filtrage par tags    
	// Si aucun tag selectionné → on retourne le résultat du filtrage par mot clé
	if (
		selectedIngredients.length === 0 &&
		selectedAppliances.length === 0 &&
		selectedUstensils.length === 0
	) {
		return filteredByKeyword; //vaut recipes si il n'y avait pas de mot clé
	}

	//ici on repart du résultat du filtrage par mot clé
	const filteredByTags = filteredByKeyword.filter(recipe => {
		//on initialise les match à true car on veut que tous les critères soient respectés
		let matchIngredients = true;
		let matchAppliances = true;
		let matchUstensils = true;

		if (selectedIngredients.length > 0) {
			matchIngredients = selectedIngredients.every(ingredient =>
				recipe.ingredients.some(ing =>
					ing.ingredient.toLowerCase().includes(ingredient.toLowerCase())
				)
			);
		}

		if (selectedAppliances.length > 0) {
			matchAppliances = selectedAppliances.every(appliance =>
				recipe.appliance.toLowerCase().includes(appliance.toLowerCase())
			);
		}

		if (selectedUstensils.length > 0) {
			matchUstensils = selectedUstensils.every(ustensil =>
				recipe.ustensils.some(ust =>
					ust.toLowerCase().includes(ustensil.toLowerCase())
				)
			);
		}

		//On garde la recette seulement si TOUS les critères sont respectés
		return matchIngredients && matchAppliances && matchUstensils;
	});

	return filteredByTags;
}

export { searchRecipes };