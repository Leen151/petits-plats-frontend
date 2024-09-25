// Fonction de recherche
function searchRecipesByKeyword(keyword, recipes) {
  console.log("toto")
  console.log(keyword)
  const filteredRecipes = recipes.filter(recipe => 
      recipe.name.toLowerCase().includes(keyword) || 
      recipe.description.toLowerCase().includes(keyword)
  );

  return filteredRecipes;
}

function searchByIngredients(){

}

function searchByAppliances(){
  
}

function searchByUstensils(){
  
}

export{searchRecipesByKeyword}