import * as z from 'zod'

export const UserType = z.object({
	name: z.string().trim().nonempty().nonoptional()
});

export type UserType = z.infer<typeof UserType>
