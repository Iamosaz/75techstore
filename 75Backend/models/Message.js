import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    // ── Conversation Participants ───────────────────────
    conversationId: {
      type: String,
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ── Linked Listing ─────────────────────────────────
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },

    // ── Message Content ────────────────────────────────
    text: {
      type: String,
      required: true,
      maxlength: 1000,
    },

    // ── Read Status ────────────────────────────────────
    isRead: {
      type: Boolean,
      default: false,
    },

    // ── Message Type ───────────────────────────────────
    messageType: {
      type: String,
      enum: ["text", "offer", "system"],
      default: "text",
    },

    // ── Offer (if buyer makes price offer) ────────────
    offerAmount: {
      type: Number,
      default: null,
    },
    offerStatus: {
      type: String,
      enum: ["pending", "accepted", "rejected", null],
      default: null,
    },
  },
  { timestamps: true }
);

// ── Generate conversationId ────────────────────────────
// Always sort two user IDs so conversation is unique
messageSchema.statics.generateConversationId = function (
  userId1,
  listingId,
  userId2
) {
  const sorted = [userId1.toString(), userId2.toString()].sort();
  return `${sorted[0]}_${listingId}_${sorted[1]}`;
};

export const Message = mongoose.model("Message", messageSchema);