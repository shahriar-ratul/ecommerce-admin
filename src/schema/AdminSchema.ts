import { z } from 'zod';

export const Admin = z.object({
    id: z.number(),
    firstName: z.null(),
    lastName: z.null(),
    dob: z.null(),
    username: z.string(),
    email: z.string(),
    phone: z.string(),
    isVerified: z.boolean(),
    isActive: z.boolean(),
    photo: z.null(),
    verifiedAt: z.null(),
    createdAt: z.string(),
    updatedAt: z.string(),
    telegramName: z.null(),
    addressLine1: z.null(),
    addressLine2: z.null(),
    city: z.null(),
    state: z.null(),
    nationality: z.null(),
    zipCode: z.null(),
    documentType: z.null(),
    walletBalance: z.number(),
    deleted: z.boolean(),
    deletedBy: z.null(),
    deletedAt: z.null(),
    roles: z.array(
        z.object({
            roleId: z.number(),
            adminId: z.number(),
            createdAt: z.string(),
            updatedAt: z.string(),
            role: z.object({
                id: z.number(),
                name: z.string(),
                slug: z.string(),
                description: z.string(),
                isActive: z.boolean(),
                createdAt: z.string(),
                updatedAt: z.string()
            })
        })
    ),
    uploads: z.array(
        z.object({
            id: z.number(),
            adminId: z.number(),
            documentType: z.string(),
            fileName: z.string(),
            type: z.string(),
            url: z.string(),
            size: z.number(),
            createdAt: z.string(),
            updatedAt: z.string()
        })
    )

});

export const AdminData = z.object({
    items: z.array(
        z.object({
            id: z.number(),
            firstName: z.null(),
            lastName: z.null(),
            dob: z.null(),
            username: z.string(),
            email: z.string(),
            phone: z.string(),
            isVerified: z.boolean(),
            isActive: z.boolean(),
            photo: z.null(),
            verifiedAt: z.null(),
            createdAt: z.string(),
            updatedAt: z.string(),
            telegramName: z.null(),
            addressLine1: z.null(),
            addressLine2: z.null(),
            city: z.null(),
            state: z.null(),
            nationality: z.null(),
            zipCode: z.null(),
            documentType: z.null(),
            walletBalance: z.number(),
            deleted: z.boolean(),
            deletedBy: z.null(),
            deletedAt: z.null(),
            roles: z.array(
                z.object({
                    roleId: z.number(),
                    adminId: z.number(),
                    createdAt: z.string(),
                    updatedAt: z.string(),
                    role: z.object({
                        id: z.number(),
                        name: z.string(),
                        slug: z.string(),
                        description: z.string(),
                        isActive: z.boolean(),
                        createdAt: z.string(),
                        updatedAt: z.string()
                    })
                })
            )
        })
    ),
    meta: z.object({
        page: z.number(),
        limit: z.number(),
        total: z.number(),
        pageCount: z.number(),
        hasPreviousPage: z.boolean(),
        hasNextPage: z.boolean()
    })
})




export type AdminModel = z.infer<typeof Admin>;
