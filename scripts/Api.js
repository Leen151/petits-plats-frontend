async function getData() {
	return await fetch("../data/recipes.json")
		.then(res => res.json())
		.then(res => res.recipes)
		.catch(err => console.log("an error occurs", err))
}

export {getData}



