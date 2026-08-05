import * as z from 'zod';

export const Users = z.object({
	_id: z.string().trim().nonempty().nonoptional(),
	name: z.string().trim().nonempty().nonoptional(),
	email: z.email().nonempty().nonoptional(),
});
