import * as z from 'zod';
import { Users } from '../users/users.model';

export const Message = z.object({
	_id: z.string().trim().nonempty().nonoptional(),
	sent_at: z.date().default(new Date()),
	description: z.string().nonempty().nonoptional(),
	sent_by: Users.omit({ email: true }).nonoptional(),
});
