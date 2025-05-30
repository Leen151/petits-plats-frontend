//on donne une valeur par défaut aux paramètres pour éviter les erreurs
function searchRecipes(recipes, keyword = "", selectedIngredients = [], selectedAppliances = [], selectedUstensils = []) {
	// Étape 1 : filtrage par mot-clé
	const lowerKeyword = keyword.toLowerCase().trim();
	let filteredByKeyword = recipes;

	if (lowerKeyword.length > 2) {
		let newFilteredRecipes = [];
		let newIndex = 0;
		
		//on boucle sur toutes les recettes
		for (let i = 0; i < recipes.length; i++) {
			const recipe = recipes[i];
			
			// Vérification de correspondance dans le titre
			let nameMatch = false;
			let nameLower = recipe.name.toLowerCase();
			for (let j = 0; j <= nameLower.length - lowerKeyword.length; j++) {
				let match = true;
				for (let k = 0; k < lowerKeyword.length; k++) {
					if (nameLower[j + k] !== lowerKeyword[k]) {
						match = false;
						break; //on sort de la boucle k si pas de correspondance
					}
				}
				if (match) {
					nameMatch = true;
					break; //on sort de la boucle j si correspondance
				}
			}
			if (nameMatch) {
				newFilteredRecipes[newIndex] = recipe;
				newIndex++;
				continue;  // on passe à la recette suivante
			}
			
			// Vérification de correspondance dans la description
			let descriptionMatch = false;
			let descriptionLower = recipe.description.toLowerCase();
			for (let j = 0; j <= descriptionLower.length - lowerKeyword.length; j++) {
				let match = true;
				for (let k = 0; k < lowerKeyword.length; k++) {
					if (descriptionLower[j + k] !== lowerKeyword[k]) {
						match = false;
						break;
					}
				}
				if (match) {
					descriptionMatch = true;
					break;
				}
			}
			if (descriptionMatch) {
				newFilteredRecipes[newIndex] = recipe;
				newIndex++;
				continue;  // On passe directement à la recette suivante
			}
			
			// Vérification de correspondance dans les ingrédients
			for (let j = 0; j < recipe.ingredients.length; j++) {
				const ingredient = recipe.ingredients[j];
				let ingredientMatch = false;
				let ingredientLower = ingredient.ingredient.toLowerCase();
				
				for (let k = 0; k <= ingredientLower.length - lowerKeyword.length; k++) {
					let match = true;
					for (let l = 0; l < lowerKeyword.length; l++) {
						if (ingredientLower[k + l] !== lowerKeyword[l]) {
							match = false;
							break;
						}
					}
					if (match) {
						ingredientMatch = true;
						break;
					}
				}
				
				if (ingredientMatch) {
					newFilteredRecipes[newIndex] = recipe;
					newIndex++;
					break;  // On sort de la boucle des ingrédients
				}
			}
		}
		
		filteredByKeyword = newFilteredRecipes;
	}
	
	// Si aucun tag selectionné → on retourne le résultat du filtrage par mot clé
	if (
		selectedIngredients.length === 0 &&
		selectedAppliances.length === 0 &&
		selectedUstensils.length === 0
	) {
		return filteredByKeyword; //vaut recipes si il n'y avait pas de mot clé
	}


	// Étape 2 : filtrage par tags
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