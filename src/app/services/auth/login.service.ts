import {
	Auth,
	createUserWithEmailAndPassword,
	GoogleAuthProvider,
	signInWithPopup,
	user,
	signInWithEmailAndPassword } from '@angular/fire/auth'
import { Users } from '../../models/users/users.model';
import { inject } from '@angular/core';

export class LoginService {
	private auth = inject(Auth);
	private google = inject(GoogleAuthProvider);

	public async loginEmail_Password(user: Users) {
		try {
			Users.parse(user);
			return signInWithEmailAndPassword(this.auth, user.email, user.password);
		} catch (err) {
			console.log(`Login with Email and Password fail. Error: ${err}`)
			return
		}
	}

	public async loginGoogle() {
		try {
			return signInWithPopup(this.auth, this.google)
		} catch (err) {
			console.log(`Login with Google fail. Error: ${err}`);
			return
		}
	}
}

export class CreateUserService {
	private auth = inject(Auth);

	public async createEmail_Password(user: Users) {
		try {
			Users.parse(user);
			return createUserWithEmailAndPassword(this.auth, user.email, user.password);
		} catch (err) {
			console.log(err)
			return
		}
	}
}
