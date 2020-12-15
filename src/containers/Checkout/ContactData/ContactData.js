import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.module.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input'
import { connect } from 'react-redux';

class ContactData extends Component {
	state = {
		orderForm: {
			name: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'Your Name'
				},
				value: '',
				validation: {
					required: true
				},
				valid: false,
				touched: false
			},
			street: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'Street'
				},
				value: '',
				validation: {
					required: true
				},
				valid: false,
				touched: false
			},
			zipCode: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'ZIP Code'
				},
				value: '',
				validation: {
					required: true,
					minLength: 5,
					maxLength: 5
				},
				valid: false,
				touched: false
			},
			country: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'Country'
				},
				value: '',
				validation: {
					required: true
				},
				valid: false,
				touched: false
			},
			email: {
				elementType: 'input',
				elementConfig: {
					type: 'email',
					placeholder: 'Your E-Mail'
				},
				value: '',
				validation: {
					required: true
				},
				valid: false,
				touched: false
			},
			deliveryMethod: {
				elementType: 'select',
				elementConfig: {
					options: [
						{ value: 'fast', displayValue: 'Fast' },
						{ value: 'normal', displayValue: 'Normal' }
					]
				},
				value: 'fast',
				validation: {
					required: false
				},
				valid: true,
				touched: false
			}
		},
		formIsValid: false,
		loading: false
	}

	orderHandler = (event) => {
		event.preventDefault();
		this.setState({ loading: true });

		const orderData = {};
		for (const key in this.state.orderForm) {
			orderData[key] = this.state.orderForm[key].value;
		}

		const order = {
			ingredients: this.props.ingr,
			price: this.props.price,
			orderData
		}
		axios.post('orders.json', order)
			.then((res) => {
				this.setState({ loading: false });
				this.props.history.push('/');
			})
			.catch((error) =>
				this.setState({ loading: false })
			);
	}

	checkValidity(value, rules) {
		let isValid = true;

		if (rules.required) {
			isValid = value.trim() !== '' && isValid;
		}

		if (rules.minLength) {
			isValid = value.length >= rules.minLength && isValid;
		}

		if (rules.maxLength) {
			isValid = value.length <= rules.maxLength && isValid;
		}

		return isValid;
	}

	inputChangeHandler = (event, id) => {
		this.setState((state) => {
			state.orderForm[id].value = event.target.value;
			state.orderForm[id].touched = true;
			state.orderForm[id].valid = this.checkValidity(event.target.value, state.orderForm[id].validation);
			let check = true;
			for (const isValid in state.orderForm) {
				check = state.orderForm[isValid].valid && check;
			}
			state.formIsValid = check;
			// console.log(state.orderForm[id].valid);
			return state;
		});
	}

	render() {
		const formElementsArray = [];
		for (const key in this.state.orderForm) {
			formElementsArray.push({ id: key, config: this.state.orderForm[key] });
		}

		let form = (<form onSubmit={this.orderHandler}>
			{formElementsArray.map(formElement =>
			(<Input
				key={formElement.id}
				elementType={formElement.config.elementType}
				elementConfig={formElement.config.elementConfig}
				value={formElement.config.value}
				invalid={!formElement.config.valid}
				shouldValidate={formElement.config.validation.required}
				touched={formElement.config.touched}
				changed={(event) => this.inputChangeHandler(event, formElement.id)} />)
			)}
			<Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
		</form>);
		if (this.state.loading) {
			form = <Spinner />;
		}

		return (
			<div className={classes.ContactData}>
				<h4>Enter your Contact Data</h4>
				{form}
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		ingr: state.ingredients,
		price: state.totalPrice
	}
}

export default connect(mapStateToProps)(ContactData);