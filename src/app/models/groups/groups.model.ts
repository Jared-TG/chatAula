import * as z from 'zod';
import { UserDTO } from '../users/users.model';

export const GroupDTO = z.object({
	_id: z.string().trim().nonempty().nonoptional(),
	name: z.string().trim().nonempty().nonoptional(),
	description: z.string().nonempty().nonoptional(),
	total_messages: z.int().nonoptional(),
	created_at: z.date().nonoptional(),
	category__id: z.string().trim().nonempty().nonoptional(),
	created_by: UserDTO.nonoptional()
});

export const CreateGroupRequestDTO = z.object({
	name: z.string().trim().nonempty().nonoptional(),
	description: z.string().nonempty().nonoptional(),
	category__id: z.string().trim().nonempty().nonoptional(),
	created_by: UserDTO.nonoptional()
});

export type GroupDTO = z.infer<typeof GroupDTO>;
export type CreateGroupRequestDTO = z.infer<typeof CreateGroupRequestDTO>;