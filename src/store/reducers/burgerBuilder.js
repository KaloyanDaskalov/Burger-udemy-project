import * as actionType from '../actions/actionTypes';
import { updateObject } from '../utility';
const initialState = {
	ingredients: null,
	totalPrice: 4,
	error: false
};

const INGREDIENT_PRICE = {
	salad: 0.5,
	bacon: 0.7,
	cheese: 0.4,
	meat: 1.3
};

const reducer = (state = initialState, action) => {

	switch (action.type) {
		case actionType.ADD_INGREDIENT:
			const updatedIngredient = { [action.ingredientName]: state.ingredients[action.ingredientName] + 1 };
			const updatedIngredients = updateObject(state.ingredients, updatedIngredient);
			const updatedState = {
				ingredients: updatedIngredients,
				totalPrice: state.totalPrice + INGREDIENT_PRICE[action.ingredientName]
			};
			return updateObject(state, updatedState);
		case actionType.REMOVE_INGREDIENT:
			const removeIngredient = { [action.ingredientName]: state.ingredients[action.ingredientName] - 1 };
			const removeIngredients = updateObject(state.ingredients, removeIngredient);
			const removeUpdatedState = {
				ingredients: removeIngredients,
				totalPrice: state.totalPrice - INGREDIENT_PRICE[action.ingredientName]
			};
			return updateObject(state, removeUpdatedState);
		case actionType.SET_INGREDIENTS:
			return updateObject(state, {
				ingredients: {
					salad: action.ingredients.salad,
					bacon: action.ingredients.bacon,
					cheese: action.ingredients.cheese,
					meat: action.ingredients.meat
				},
				totalPrice: 4,
				error: false
			});
		case actionType.FETCH_INGREDIENTS_FAILED:
			return updateObject(state, { error: true });
		default:
			return state;
	}

}

export default reducer;