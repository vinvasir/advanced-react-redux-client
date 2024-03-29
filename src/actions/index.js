import axios from 'axios';
import { browserHistory } from 'react-router';

import { 
	AUTH_USER,
	UNAUTH_USER,
	AUTH_ERROR
} from './types';

const ROOT_URL = 'http://localhost:3090';

export function signinUser({email, password}) {
	// Normally, action creators return objects,
	// but with redux-thunk, can return a function
	// to get direct access to the Dispatch method
	// so that we can forward stuff to ALL the reducers
	return function(dispatch) {
		// Submit email/password to the server
		axios.post(`${ROOT_URL}/signin`, { email, password })
			.then(response => {
				// If request is good...
				// - UPdate state to indicate user is authenticated
				dispatch({ type: AUTH_USER });

				// - Save the JWT
				localStorage.setItem('token', response.data.token);

				// - redirect to the route '/feature'
				browserHistory.push('/feature');
			})
			.catch(() => {
				// If request is bad...
				// - show an error to the user
				dispatch(authError('Bad Login Info'));
			});
	}
}

export function signupUser({ email, password }) {
	return function(dispatch) {
		axios.post(`${ROOT_URL}/signup`, { email, password })
			.then(response => {
				dispatch({type: AUTH_USER});
				localStorage.setItem('token', response.data.token);
				browserHistory.push('/feature');
			})
			.catch(response => {
				dispatch(authError(response.response.data.error));
			});
	}
}

export function authError(error) {
	return {
		type: AUTH_ERROR,
		payload: error
	};
}

export function signoutUser() {
	localStorage.removeItem('token');

	return {
		type: UNAUTH_USER
	}
}