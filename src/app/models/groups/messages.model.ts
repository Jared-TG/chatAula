import * as z from 'zod';
import { UserDTO } from '../users/users.model';

export const MessageDTO = z.object({
	_id: z.string().trim().nonempty().nonoptional(),
	sent_at: z.date().default(new Date()),
	description: z.string().nonempty().nonoptional(),
	sent_by: UserDTO.omit({ email: true, user_type: true }).nonoptional(),
});

export type MessageDTO = z.infer<typeof MessageDTO>;
