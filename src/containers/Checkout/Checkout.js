import React, { Component } from 'react';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import { Route } from 'react-router-dom';
import ContactData from './ContactData/ContactData';
import { connect } from 'react-redux';

class Checkout extends Component {

	//getting decoding query search params from URL
	// const query = new URLSearchParams(this.props.location.search);
	// const ingredients = {};
	// let price = 0;
	// for (let [key, value] of query.entries()) {
	// 	if (key === 'price') {
	// 		price = Math.trunc(Number(value) * 100) / 100;
	// 	} else {
	// 		ingredients[key] = Number(value);
	// 	}
	// }

	checkoutCancelledHandler = () => {
		this.props.history.goBack();
	}

	checkoutContinuedHandler = () => {
		this.props.history.replace('/checkout/contact-data');
	}

	render() {
		return (<div>
			<CheckoutSummary ingredients={this.props.ingr}
				checkoutCancelled={this.checkoutCancelledHandler}
				checkoutContinued={this.checkoutContinuedHandler} />
			<Route path={this.props.match.path + '/contact-data'} component={ContactData} />
		</div>);
	}
}

const mapStateToProps = state => {
	return {
		ingr: state.ingredients
	}
}

export default connect(mapStateToProps)(Checkout);

