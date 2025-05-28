// Fonction de recherche
function searchRecipesByKeyword(keyword, recipes) {
  const lowerKeyword = keyword.toLowerCase().trim();
  console.log(keyword)
  const filteredRecipes = recipes.filter(recipe => 
      recipe.name.toLowerCase().includes(lowerKeyword) || 
      recipe.description.toLowerCase().includes(lowerKeyword) ||
      // some - vérifie si au moins 1 ingrédient contient le keyword
      recipe.ingredients.some(ing => 
          ing.ingredient.toLowerCase().includes(lowerKeyword)
      )
  );

  return filteredRecipes;
}

function searchRecipesByTags(recipes, selectedIngredients = [], selectedAppliances = [], selectedUstensils = []) {
    // Si les tableaux sont vides (aucuns tags) --> retourner toutes les recettes
    if (selectedIngredients.length === 0 && 
        selectedAppliances.length === 0 && 
        selectedUstensils.length === 0) {
        return recipes;
    }

    // Filtrer les recettes selon les tags
    const filteredRecipes = recipes.filter(recipe => {
    //on initialise les match à false 
    //(si on initialise à true, la recette resortirai si un des 3 tableau est vide sans qu'il y ai correspondance)
    let matchIngredients = false;
    let matchAppliances = false;
    let matchUstensils = false;

    //Si le tableau n'est pas vide, on vérifie que la recette sur laquelle on intère contient le ou les ingrédients
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

    //si au moins 1 des cas est vrai, on garde la recette sur laquelle on intère 
    //(return true dans le filter)
    return matchIngredients || matchAppliances || matchUstensils;
  });

  return filteredRecipes;
}

export{searchRecipesByKeyword, searchRecipesByTags as searchByTags}