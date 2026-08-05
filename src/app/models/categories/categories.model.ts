import * as z from 'zod';

export const Category = z.object({
	_id: z.string().trim().nonempty().nonoptional(),
	name: z.string().trim().nonempty().nonoptional()
});

