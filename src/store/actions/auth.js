import * as actionTypes from './actionTypes';
import axios from 'axios';

export const authStart = () => {
	return {
		type: actionTypes.AUTH_START
	};
};

export const authSuccess = (idToken, userId) => {
	return {
		type: actionTypes.AUTH_SUCCESS,
		idToken,
		userId
	};
};

export const authFail = (error) => {
	return {
		type: actionTypes.AUTH_FAIL,
		error
	};
};

export const logout = () => {
	return {
		type: actionTypes.AUTH_LOGOUT
	};
};

export const checkAuthTimeout = (expirationTime) => {
	return dispatch => {
		setTimeout(() => dispatch(logout()), Number(expirationTime) * 1000);
	};
};

export const auth = (email, password, isSignup) => {
	return dispatch => {
		dispatch(authStart());
		const authData = {
			email,
			password,
			returnSecureToken: true
		};
		const endPoint = isSignup ? 'signUp' : 'signInWithPassword';
		axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:${endPoint}?key=AIzaSyAkibLB5OfKKIulKn--x8HlN8tvfykxJt8`, authData)
			.then(res => {
				dispatch(authSuccess(res.data.idToken, res.data.localId));
				dispatch(checkAuthTimeout(res.data.expiresIn));
			})
			.catch(err => {
				dispatch(authFail(err.response.data.error));
			});
	}
};

export const setAuthRedirectPath = (path) => {
	return {
		type: actionTypes.SET_AUTH_REDIRECT_PATH,
		path
	};
};