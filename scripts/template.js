function recipeCard(recipe) {

	// balise article (conteneur)
	const wrapper = document.createElement("article");
	wrapper.classList.add("recipe");
	wrapper.classList.add("card");

	//création de la liste des ingrédients
	const ingredientsList = document.createElement("ul");
	ingredientsList.classList.add("ingredients-list");

	recipe.ingredients.forEach(ingredient => {
		const quantityText = ingredient.quantity ? `${ingredient.quantity}` : '';
		const unitText = ingredient.unit ?( ingredient.unit === 'grammes' ? 'gr' : ingredient.unit ) : ""

		const listItem = document.createElement("li");
		listItem.innerHTML = `
			<p class="ingredient">${ingredient.ingredient}</p>
			<p class="quantity">${quantityText} ${unitText}</p>
		`;
		ingredientsList.appendChild(listItem);
	});


	const content =  `

	<img src="/assets/recettes/${recipe.image}" class="card-img-top" alt="${recipe.name}" height="150px" width="150px">

	<div class="card-body">
		<div class="text-recipe-container">
			<h2 class="recipe-title">${recipe.name}</h2>
			<div class="recipe-description">
				<h3>Recette</h3>
				<p>${recipe.description}</p>
			</div>
			<div class="recipe-ingredients">
				<h3>Ingrédients</h3>		
				${ingredientsList.outerHTML}
			</div>			
		</div>

		<div class="time">${recipe.time}min</div>
	</div>
	`;

	wrapper.innerHTML = content
	return wrapper
}



export{recipeCard}