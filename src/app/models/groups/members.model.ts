import { Users } from '../users/users.model';

export const Member = Users.omit({
	email: true,
})
