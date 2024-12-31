'use server';
import { createAdminClient } from '@/config/appwrite';
import checkAuth from './checkAuth';
import { ID } from 'node-appwrite';
import { revalidatePath } from 'next/cache';

async function createRoom(previousState, formData) {
    // Get databases instance
    const { databases, storage } = await createAdminClient();

    try {
        const { user } = await checkAuth();

        if (!user) {
            return {
                error: 'You must be logged in to create a room.',
            };
        }

        // Uploading image
        let imageID = null;

        const image = formData.get('image');

        if (image && image.size > 0 && image.name !== 'undefined') {
            try {
                // Upload image
                const response = await storage.createFile(
                    process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ROOMS,
                    ID.unique(),
                    image
                );

                imageID = response.$id;
            } catch (error) {
                console.error('Error uploading image:', error);

                return {
                    error: 'Error uploading image.',
                };
            }
        }

        // Create a room
        await databases.createDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS,
            ID.unique(),
            {
                user_id: user.id,
                name: formData.get('name'),
                description: formData.get('description'),
                sqft: formData.get('sqft'),
                capacity: formData.get('capacity'),
                location: formData.get('location'),
                address: formData.get('address'),
                availability: formData.get('availability'),
                price_per_hour: formData.get('price_per_hour'),
                amenities: formData.get('amenities'),
                image: imageID,
            }
        );

        revalidatePath('/', 'layout');

        return {
            success: true,
        };
    } catch (error) {
        return {
            error: error.message,
        };
    }
}

export default createRoom;
