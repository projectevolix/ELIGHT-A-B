export type BookingStatus = "pending" | "accepted" | "rejected";

export const BookingStatus = {
  Pending: 'pending' as BookingStatus,
  Accepted: 'accepted' as BookingStatus,
  Therapist: 'rejected' as BookingStatus
};

export const BOOKING_STATUS_LIST = [BookingStatus.Pending, BookingStatus.Accepted, BookingStatus.Therapist];