import express from "express";
import User from "../models/user.model.js";
import { verifyWebhook } from "@clerk/backend/webhooks";

const router = express.Router();

router.post("/", async (req, res) => {
  const signingSecret = process.env.CLERK_WEBHOOKS_SIGNING_SECRET;
  if (!signingSecret) {
    res.status(503).json({
      message: "Webhooks secret are not provided",
    });
    return;
  }

  try {
    const payload = Buffer.isBuffer(req.body)
      ? req.body.toString("utf8")
      : String(req.body);

    const request = new Request("http://internal/webhooks/clerk", {
      method: "POST",
      headers: new Headers(req.headers),
      body: payload,
    });
    const evt = await verifyWebhook(request, { signingSecret });

    if (evt.type === "user.created" || evt.type === "user.updated") {
      const u = evt.data;

      const email =
        u.email_addresses?.find((e) => e.id === u.primary_email_address_id)
          ?.email_address ??
        u.email_addresses?.[0]?.email_address;

      const fullName =
        [u.first_name, u.last_name].filter(Boolean).join(" ") ||
        u.username ||
        email?.split("@")[0];

      await User.findOneAndUpdate(
        { clerk: u.id },
        {
          clerk: u.id,
          email,
          fullName,
          profilepic: u.image_url,
        },
        {
          upsert: true,
          new: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        }
      );
    }

    if (evt.type === "user.deleted" && evt.data.id) {
      await User.findOneAndDelete({ clerk: evt.data.id });
    }

    return res.status(200).json({
      received: true,
    });
  } catch (error) {
    console.error("Clerk webhook processing failed:", error);
    return res.status(500).json({
      success: false,
      message: "Webhook processing failed",
    });
  }
});

export default router;
