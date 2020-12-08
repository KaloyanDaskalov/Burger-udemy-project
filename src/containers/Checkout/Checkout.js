import React, { Component } from 'react';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import { Route } from 'react-router-dom';
import ContactData from './ContactData/ContactData';

class Checkout extends Component {

	state = {
		ingredients: null,
		totalPrice: 0
	}

	componentWillMount() {
		const query = new URLSearchParams(this.props.location.search);
		const ingredients = {};
		let price = 0;
		for (let [key, value] of query.entries()) {
			if (key === 'price') {
				price = Math.trunc(Number(value) * 100) / 100;
			} else {
				ingredients[key] = Number(value);
			}
		}
		this.setState({ ingredients: ingredients, totalPrice: price });
	}

	checkoutCancelledHandler = () => {
		this.props.history.goBack();
	}

	checkoutContinuedHandler = () => {
		this.props.history.replace('/checkout/contact-data');
	}

	render() {
		return (<div>
			<CheckoutSummary ingredients={this.state.ingredients}
				checkoutCancelled={this.checkoutCancelledHandler}
				checkoutContinued={this.checkoutContinuedHandler} />
			<Route path={this.props.match.path + '/contact-data'} render={() => <ContactData ingredients={this.state.ingredients}
				price={this.state.totalPrice} {...this.props} />} />
		</div>);
	}
}

export default Checkout;

