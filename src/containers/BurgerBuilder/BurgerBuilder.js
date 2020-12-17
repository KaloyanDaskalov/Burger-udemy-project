import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as burgerBuilderActions from '../../store/actions/index';
import Aux from '../../hoc/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BurgerControls/BurgerControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';

class BurgerBuilder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            purchasing: false,
        }
    }

    componentDidMount() {
        this.props.onInitIngredients();
        //     axios.get('https://my-burger-shop-app-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json')
        //         .then(res => this.setState({ ingredients: res.data }))
        //         .catch(error => this.setState({ error: true }));
    }

    updatePurchaseState = (ingredients) => {
        const totalIngredients = Object.values(ingredients).reduce((a, b) => a + b, 0);
        return totalIngredients > 0;
    }

    purchasingHandler = () => {
        this.setState({ purchasing: true });
    }

    purchaseContinueHandler = () => {
        //make query params!!!
        // let queryParams = Object.entries(this.state.ingredients)
        //     .reduce((acc, [key, value]) => acc += `${encodeURIComponent(key)}=${encodeURIComponent(value)}&`, '?');
        // queryParams += `price=${this.state.totalPrice}`;
        // this.props.history.push({
        //     pathname: '/checkout',
        //     search: queryParams
        // });
        this.props.history.push('/checkout');
    }

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false });
    }

    render() {
        const disableInfo = { ...this.props.ings };

        for (const key in disableInfo) {
            disableInfo[key] = disableInfo[key] <= 0;
        }

        let orderSummary = null;
        let burgerState = this.props.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;

        if (this.props.ings) {
            burgerState = (<Aux>
                <Burger ingredients={this.props.ings} />
                <BuildControls
                    ingredientAdded={this.props.onIngredientAdded}
                    ingredientRemoved={this.props.onIngredientRemoved}
                    disabled={disableInfo}
                    purchasable={this.updatePurchaseState(this.props.ings)}
                    ordered={this.purchasingHandler}
                    price={this.props.price} />
            </Aux>);
            orderSummary = <OrderSummary
                ingredients={this.props.ings}
                price={this.props.price}
                purchaseContinued={this.purchaseContinueHandler}
                purchaseCancelled={this.purchaseCancelHandler} />;
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

const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        price: state.totalPrice,
        error: state.error
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(burgerBuilderActions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(burgerBuilderActions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(burgerBuilderActions.initIngredients())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));