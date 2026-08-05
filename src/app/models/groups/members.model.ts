import * as z from 'zod';
import { UserDTO } from '../users/users.model';

export const MemberDTO = UserDTO.omit({
	email: true,
});

export const CreateMemberRequestDTO = UserDTO.omit({
	_id: true,
	email: true,
})

export type MemberDTO = z.infer<typeof MemberDTO>
export type CreateMemberRequestDTO = z.infer<typeof CreateMemberRequestDTO>;