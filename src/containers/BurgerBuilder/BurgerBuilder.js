import React, { Component } from 'react';
import Aux from '../../hoc/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BurgerControls/BurgerControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';


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
            ingredients: null,
            totalPrice: 4,
            purchasable: false,
            purchasing: false,
            loading: false,
            error: false
        }
    }

    componentDidMount() {
        axios.get('https://my-burger-shop-app-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json')
            .then(res => this.setState({ ingredients: res.data }))
            .catch(error => this.setState({ error: true }));
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
        // alert('Success');
        this.setState({ loading: true });

        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'Kaloyan Daskalov',
                address: {
                    city: 'Ruse',
                    street: 'Street',
                    zipCode: '7000'
                },
                email: 'test@some.com',
                deliveryMethod: 'fastest'
            }
        }
        axios.post('orders.json', order)
            .then((res) =>
                this.setState({ purchasing: false, loading: false })
            )
            .catch((error) =>
                this.setState({ purchasing: false, loading: false })
            );
    }

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false });
    }

    render() {
        const disableInfo = { ...this.state.ingredients };

        for (const key in disableInfo) {
            disableInfo[key] = disableInfo[key] <= 0;
        }

        let orderSummary = null;
        let burgerState = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;

        if (this.state.ingredients) {
            burgerState = (<Aux>
                <Burger ingredients={this.state.ingredients} />
                <BuildControls
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHandler}
                    disabled={disableInfo}
                    purchasable={this.state.purchasable}
                    ordered={this.purchasingHandler}
                    price={this.state.totalPrice} />
            </Aux>);
            orderSummary = <OrderSummary
                ingredients={this.state.ingredients}
                price={this.state.totalPrice}
                purchaseContinued={this.purchaseContinueHandler}
                purchaseCancelled={this.purchaseCancelHandler} />;
        }

        if (this.state.loading) {
            orderSummary = <Spinner />;
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burgerState}
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);