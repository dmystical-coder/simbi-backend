import express from "express";
import {
  handleCreateNotification,
  handleGetUnreadNotifications,
  handleMarkNotificationAsRead,
} from "../controllers/notifications.controllers";

const router = express.Router();

router.post("/", handleCreateNotification);
router.get("/unread/:userId", handleGetUnreadNotifications);
router.patch("/read/:notificationId", handleMarkNotificationAsRead);

export default router;
