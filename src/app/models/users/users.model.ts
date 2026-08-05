import * as z from 'zod';

export const CreateUserEmail_PasswordRequestDTO = z.object({
	email: z.email().nonempty().nonoptional(),
	password: z.string().trim().nonempty().nonoptional(),
});

export const InsertUserRequestDTO = z.object({
	email: z.email().nonempty().nonoptional(),
	username: z.string().nonempty().nonoptional()
});

export const UserDTO = z.object({
	_id: z.string().nonempty().nonoptional(),
	email: z.email().nonempty().nonoptional(),
	username: z.string().nonempty().nonoptional()
});

export type CreateUserEmail_PasswordRequestDTO = z.infer<typeof CreateUserEmail_PasswordRequestDTO>;
export type InsertUserRequestDTO = z.infer<typeof InsertUserRequestDTO>;
export type UserDTO = z.infer<typeof UserDTO>;
