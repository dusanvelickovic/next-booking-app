'use client';
import cancelBooking from '@/app/actions/cancelBooking';
import { toast } from 'react-toastify';

const CancelBookingButton = ({ bookingId }) => {
    const handleCancelBooking = async () => {
        if (!confirm('Are you sure you want to cancel this booking?')) {
            return;
        }

        try {
            const response = await cancelBooking(bookingId);

            if (response.error) {
                return toast.error(response.error);
            }

            toast.success('Booking cancelled successfully.');
        } catch (error) {
            return {
                error: 'Failed to cancel booking.',
            };
        }
    };

    return (
        <button
            onClick={handleCancelBooking}
            className='bg-red-500 text-white px-4 py-2 rounded w-full sm:w-auto text-center hover:bg-red-700'
        >
            Cancel Booking
        </button>
    );
};

export default CancelBookingButton;
