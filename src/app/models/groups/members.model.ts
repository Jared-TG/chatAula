import * as z from 'zod';
import { Users } from '../users/users.model';

export const Member = Users.omit({
	email: true,
})

export type Member = z.infer<typeof Member>