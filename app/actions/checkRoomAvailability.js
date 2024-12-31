'use server';
import { createSessionClient } from '@/config/appwrite';
import { cookies } from 'next/headers';
import { Query } from 'node-appwrite';
import { redirect } from 'next/navigation';
import { DateTime } from 'luxon';

// Convert a date string to a Luxon DateTime object in UTC
function toUTCDateTime(dateSring) {
    return DateTime.fromISO(dateSring, { zone: 'utc' }).toUTC();
}

// Check for overall date ranges
function dateRangesOverlap(checkInA, checkOutA, checkInB, checkOutB) {
    return checkInA < checkOutB && checkOutA > checkInB;
}

async function checkRoomAvailability(roomId, checkIn, checkOut) {
    const sessionCookie = cookies().get('appwrite-session');

    if (!sessionCookie) {
        redirect('/login');
    }

    try {
        const { databases } = await createSessionClient(sessionCookie.value);

        // Fetch all bookings for a given room
        const { documents: bookings } = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS,
            [Query.equal('room_id', roomId)]
        );

        const checkInDateTime = toUTCDateTime(checkIn);
        const checkOutDateTime = toUTCDateTime(checkOut);

        // Loop over all bookings and check if the room is available
        for (const booking of bookings) {
            const bookingCheckInDateTime = toUTCDateTime(booking.check_in);
            const bookingCheckOutDateTime = toUTCDateTime(booking.check_out);

            if (
                dateRangesOverlap(
                    checkInDateTime,
                    checkOutDateTime,
                    bookingCheckInDateTime,
                    bookingCheckOutDateTime
                )
            ) {
                return false;
            }
        }

        return true;
    } catch (error) {
        return {
            error: 'An error occurred while checking room availability.',
        };
    }
}

export default checkRoomAvailability;
