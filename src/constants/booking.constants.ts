export type BookingStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export const BookingStatus = {
  Pending: 'PENDING' as BookingStatus,
  Accepted: 'ACCEPTED' as BookingStatus,
  Rejected: 'REJECTED' as BookingStatus,
  Reschedule: 'RESCHEDULE' as BookingStatus,
};

export const BOOKING_STATUS_LIST = [BookingStatus.Pending, BookingStatus.Accepted, BookingStatus.Rejected , BookingStatus.Reschedule];