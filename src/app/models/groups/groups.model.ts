import * as z from 'zod';
import { Users } from '../users/users.model';

export const Group = z.object({
	_id: z.string().trim().nonempty().nonoptional(),
	name: z.string().trim().nonempty().nonoptional(),
	description: z.string().nonempty().nonoptional(),
	total_messages: z.int().default(0),
	created_at: z.date().default(new Date()),
	category__id: z.string().trim().nonempty().nonoptional(),
	created_by: Users.nonoptional()
});
