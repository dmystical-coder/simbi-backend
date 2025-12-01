import { Request, Response } from "express";
import {
  createNotification,
  getUnreadNotifications,
  markNotificationAsRead,
} from "../services/notifications.services";

export const handleCreateNotification = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, message, type } = req.body;

  if (!userId || !message || !type) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  try {
    const notification = await createNotification(userId, message, type);
    res.status(201).json(notification);
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ error: "Failed to create notification" });
  }
};

export const handleGetUnreadNotifications = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;

  try {
    const notifications = await getUnreadNotifications(Number(userId));
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

export const handleMarkNotificationAsRead = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { notificationId } = req.params;

  try {
    const updated = await markNotificationAsRead(Number(notificationId));
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to mark as read" });
  }
};