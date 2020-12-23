import React, { Component } from 'react';
import Button from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';
import classes from './Auth.module.css';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions/index';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

class Auth extends Component {
    state = {
        controls: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Mail Address'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false
            },
        },
        isSignup: true
    }

    checkValidity(value, rules) {
        let isValid = true;

        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
        }

        if (rules.isEmail) {
            const pattern = /^[\w!#$%&'*+\-=?^_`{|}~]+(\.[\w!#$%&'*+\-=?^_`{|}~]+)*@((([-\w]+\.)+[a-zA-Z]{2,4})|(([0-9]{1,3}\.){3}[0-9]{1,3}))/;
            // console.log(pattern.test(value));
            isValid = pattern.test(value) && isValid;
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
            state.controls[id].value = event.target.value;
            state.controls[id].touched = true;
            state.controls[id].valid = this.checkValidity(event.target.value, state.controls[id].validation);
            return state;
        });
    }

    submitHandler = (event) => {
        event.preventDefault();
        this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignup);
    }

    switchAuthModeHandler = () => {
        this.setState(state => {
            return { isSignup: !state.isSignup };
        })
    }

    render() {
        const formElementsArray = [];
        for (const key in this.state.controls) {
            formElementsArray.push({ id: key, config: this.state.controls[key] });
        }

        const form = formElementsArray.map(formElement =>
        (<Input
            key={formElement.id}
            elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            invalid={!formElement.config.valid}
            shouldValidate={formElement.config.validation.required}
            touched={formElement.config.touched}
            changed={(event) => this.inputChangeHandler(event, formElement.id)} />));

        // if (this.props.loading) {
        //     form = <Spinner />;
        // }

        return (
            <div className={classes.Auth} >
                {this.props.isAuthenticated ? <Redirect to="/" /> : null}
                {this.props.error ? <p style={{ color: 'red', fontWeight: 'bold' }}>{this.props.error.message}</p> : null}
                <form onSubmit={this.submitHandler}>
                    {this.props.loading ? <Spinner /> : form}
                    <Button btnType="Success" >SUBMIT</Button>
                </form>
                <Button btnType='Danger'
                    clicked={this.switchAuthModeHandler}
                >SWITCH TO {this.state.isSignup ? 'SIGN IN' : 'SIGN UP'}</Button>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null
    }
}

const dispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup))
    }
}

export default connect(mapStateToProps, dispatchToProps)(Auth);