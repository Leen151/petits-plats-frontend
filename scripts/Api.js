async function getData() {
	return await fetch("../data/recipes.json")
		.then(res => res.json())
		.then(res => res.recipes)
		.catch(err => console.log("an error occurs", err))
}

async function getIngredients(recipe) {
	//flatMap permet de faire un seul tableau avec le contenu des sous-tableau d'ingrédients
	const allIngredients = recipe.flatMap(recipe => recipe.ingredients.map(ing => ing.ingredient));
	//Set permet d'éliminer les doublons
	//les ... transforme le Set en array
	const uniqueIngredients = [...new Set(allIngredients)];
	return uniqueIngredients;
}

async function getAppliance(recipe) {
	const allAppliances = recipe.map(recipe => recipe.appliance);
	const uniqueAppliances = [...new Set(allAppliances)];

	return uniqueAppliances;
}

async function getUstensils(recipe) {
	const allUstensils = recipe.flatMap(recipe => recipe.ustensils);
	const uniqueUstensils = [...new Set(allUstensils)];

	return uniqueUstensils;
}

export {getData, getIngredients, getAppliance, getUstensils}



