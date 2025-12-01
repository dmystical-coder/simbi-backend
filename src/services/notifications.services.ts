import prisma from "../database/db";

// Create a new notification in the database
export const createNotification = async (userId: number, message: string, type: string) => {
  return prisma.notification.create({
    data: {
      userId: userId.toString(),
      message,
      type,
    },
  });
};

// Get all unread notifications for a user
export const getUnreadNotifications = async (userId: number) => {
  return prisma.notification.findMany({
    where: { userId: userId.toString(), isRead: false },
    orderBy: { createdAt: 'desc' },
  });
};

// Mark a notification as read
export const markNotificationAsRead = async (notificationId: number) => {
  return prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
};