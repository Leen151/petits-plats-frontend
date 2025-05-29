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
		const unitText = ingredient.unit ? (ingredient.unit === 'grammes' ? 'gr' : ingredient.unit) : ""

		const listItem = document.createElement("li");
		listItem.innerHTML = `
			<p class="ingredient">${ingredient.ingredient}</p>
			<p class="quantity">${quantityText} ${unitText}</p>
		`;
		ingredientsList.appendChild(listItem);
	});

	const content = `
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

function createTagSelect(type, title, filterValues = []) {
	// Conteneur
	const tagContainer = document.createElement('div');
	tagContainer.classList.add('tag', `tag-${type}`);

	// Création du titre et de la structure
	//(le .join transforme un tableau de <li> en string pour avoir 1 seule chaine html)
	const content = `        
		<div class="tag-title">${title} <i class="fa-solid fa-chevron-down icone-chevron"></i></div>
		<div class="collapse">
				<div class="zone-input">
						<input type="text"/>
						<i class="fa-solid fa-xmark cross-list cross"></i> 
						<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
								<circle cx="5" cy="5" r="4.75" stroke="#7A7A7A" stroke-width="0.6"/>
								<line x1="9.17678" y1="9.32322" x2="13.6768" y2="13.8232" stroke="#7A7A7A" stroke-width="0.6"/>
						</svg> 
				</div>
				<ul class="list list-${type} list-filters">
						${filterValues.map(value => `
							<li class="filter ${type}-tag">${value}</li>
						`).join('')}
				</ul>
		</div>        
  `;

	tagContainer.innerHTML = content;
	return tagContainer;
}


export { recipeCard, createTagSelect }