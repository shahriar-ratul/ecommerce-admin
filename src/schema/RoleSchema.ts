import { z } from "zod"

export const Role = z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string(),
    description: z.string(),
    isActive: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string()
})

export type RoleModel = z.infer<typeof Role>;