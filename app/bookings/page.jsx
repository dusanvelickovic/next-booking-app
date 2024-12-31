import Heading from '@/components/Heading';
import getMyBookings from '../actions/getMyBookings';
import BookedRoomCard from '@/components/BookedRoomCard';

const BookingsPage = async () => {
    const bookings = await getMyBookings();

    return <>
        <Heading title='My Booking' />
        { bookings.length === 0 ? (
            <p className='text-gray-600 mt-4'>You have no bookings.</p>
        ) : (
            bookings.map((booking) => 
                // <h3>{ booking.room_id.name }</h3>
                <BookedRoomCard key={booking.$id} booking={booking} />
            )
        )}
    </>;
};

export default BookingsPage;
