import React, { Component } from 'react';
import Aux from '../../hoc/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BurgerControls/BurgerControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';

const INGREDIENT_PRICE = {
    salad: 0.5,
    bacon: 0.7,
    cheese: 0.4,
    meat: 1.3
}

class BurgerBuilder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ingredients: {
                salad: 0,
                bacon: 0,
                cheese: 0,
                meat: 0
            },
            totalPrice: 4,
            purchasable: false,
            purchasing: false
        }
    }

    updatePurchaseState = (ingredients) => {
        const totalIngredients = Object.values(ingredients).reduce((a, b) => a + b, 0);
        this.setState({ purchasable: totalIngredients > 0 });
    }

    addIngredientHandler = (type) => {
        const ingredients = { ...this.state.ingredients };
        ingredients[type]++;
        const totalPrice = this.state.totalPrice + INGREDIENT_PRICE[type];
        this.setState({ ingredients, totalPrice });
        this.updatePurchaseState(ingredients);
    }

    removeIngredientHandler = (type) => {
        if (this.state.ingredients[type] > 0) {
            const ingredients = { ...this.state.ingredients };
            ingredients[type]--;
            const totalPrice = this.state.totalPrice - INGREDIENT_PRICE[type];
            this.setState({ ingredients, totalPrice });
            this.updatePurchaseState(ingredients);
        }
    }

    purchasingHandler = () => {
        this.setState({ purchasing: true });
    }

    purchaseContinueHandler = () => {
        alert('Success');
    }

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false });
    }

    render() {
        const disableInfo = { ...this.state.ingredients };

        for (const key in disableInfo) {
            disableInfo[key] = disableInfo[key] <= 0;
        }
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    <OrderSummary
                        ingredients={this.state.ingredients}
                        price={this.state.totalPrice}
                        purchaseContinued={this.purchaseContinueHandler}
                        purchaseCancelled={this.purchaseCancelHandler} />
                </Modal>
                <Burger ingredients={this.state.ingredients} />
                <BuildControls
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHandler}
                    disabled={disableInfo}
                    purchasable={this.state.purchasable}
                    ordered={this.purchasingHandler}
                    price={this.state.totalPrice} />
            </Aux>
        );
    }
}

export default BurgerBuilder;