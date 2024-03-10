function recipeCard(recipe) {

	const wrapper = document.createElement("article");
	wrapper.classList.add("recipe");


	const content =  `
	<div>		
		${recipe.name}
	</div>
	`;

	wrapper.innerHTML = content
	return wrapper


}
export{recipeCard}