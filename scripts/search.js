//on donne une valeur par défaut à keyword pour éviter les erreurs
function searchRecipes(recipes, keyword = "", selectedIngredients = [], selectedAppliances = [], selectedUstensils = []) {
  // Étape 1 : filtrage par mot-clé
  const lowerKeyword = keyword.toLowerCase().trim();
  let filteredByKeyword = recipes;

  if (lowerKeyword.length > 0) {
    filteredByKeyword = filteredByKeyword.filter(recipe =>
      recipe.name.toLowerCase().includes(lowerKeyword) ||
      recipe.description.toLowerCase().includes(lowerKeyword) ||
      recipe.ingredients.some(ing =>
        ing.ingredient.toLowerCase().includes(lowerKeyword)
      )
    );
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
    //on initialise les match à false 
    //(si on initialise à true, la recette resortirai si un des 3 tableau est vide sans qu'il y ai correspondance)
    let matchIngredients = false;
    let matchAppliances = false;
    let matchUstensils = false;

    if (selectedIngredients.length > 0) {
      matchIngredients = selectedIngredients.some(ingredient =>
        recipe.ingredients.some(ing =>
          ing.ingredient.toLowerCase().includes(ingredient.toLowerCase())
        )
      );
    }

    if (selectedAppliances.length > 0) {
      matchAppliances = selectedAppliances.some(appliance =>
        recipe.appliance.toLowerCase().includes(appliance.toLowerCase())
      );
    }

    if (selectedUstensils.length > 0) {
      matchUstensils = selectedUstensils.some(ustensil =>
        recipe.ustensils.some(ust =>
          ust.toLowerCase().includes(ustensil.toLowerCase())
        )
      );
    }

    //Si au moins 1 des cas est vrai, on garde la recette sur laquelle on intère 
    //(return true dans le filter)
    return matchIngredients || matchAppliances || matchUstensils;
  });

  return filteredByTags;
}

export { searchRecipes }