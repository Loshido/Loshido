import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const dateEurope = z.preprocess((val) => {
    if(typeof val !== 'string') return val

    const match = val.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
    if(!match) return val

    const [, day, month, year] = match

    return new Date(Number(year), Number(month) - 1, Number(day))
}, z.date())

const blog = defineCollection({
	loader: glob({ base: './content', pattern: '**/*.{md,mdx}' }),
	schema: (a) =>
		z.object({
			title: z.string(),
			description: z.string(),
			date: dateEurope,
			updatedDate: dateEurope.optional(),
			image: a.image().or(z.literal("placeholder")),
            private: z.string().optional()
		}),
});
const blog_fr = defineCollection({
	loader: glob({ base: './content', pattern: '**/*.fr.{md,mdx}' }),
	schema: (a) =>
		z.object({
			title: z.string(),
			description: z.string(),
			date: dateEurope,
			updatedDate: dateEurope.optional(),
			image: a.image().or(z.literal("placeholder")),
            private: z.string().optional()
		}),
});

export const collections = { blog, blog_fr };
