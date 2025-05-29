async function getData() {
	return await fetch("../data/recipes.json")
		.then(res => res.json())
		.then(res => res.recipes)
		.catch(err => console.log("an error occurs", err))
}

function getIngredients(recipe) {
	if (!recipe || recipe.length === 0) {
		return [];
	}

	//flatMap permet de faire un seul tableau avec le contenu des sous-tableau d'ingrédients
	const allIngredients = recipe.flatMap(recipe => recipe.ingredients.map(ing => ing.ingredient.toLowerCase()));
	//Set permet d'éliminer les doublons
	//les ... transforme le Set en array
	const uniqueIngredients = [...new Set(allIngredients)];
	return uniqueIngredients;
}

function getAppliance(recipe) {
	if (!recipe || recipe.length === 0) {
		return [];
	}

	const allAppliances = recipe.map(recipe => recipe.appliance.toLowerCase());
	const uniqueAppliances = [...new Set(allAppliances)];

	return uniqueAppliances;
}

function getUstensils(recipe) {
	if (!recipe || recipe.length === 0) {
		return [];
	}

	const allUstensils = recipe.flatMap(recipe =>
		recipe.ustensils.map(ustensil => ustensil.toLowerCase())
	);
	const uniqueUstensils = [...new Set(allUstensils)];

	return uniqueUstensils;
}

export { getData, getIngredients, getAppliance, getUstensils }



