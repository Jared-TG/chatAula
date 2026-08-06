import * as z from 'zod';
import { UserDTO } from '../users/users.model';

export const Member = UserDTO.omit({
	email: true,
})

export type Member = z.infer<typeof Member>