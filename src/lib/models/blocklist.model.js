import mongoose from "mongoose";

const blocklistTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

blocklistTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const BlocklistToken = mongoose.models.BlocklistToken || mongoose.model("BlocklistToken", blocklistTokenSchema);

export default BlocklistToken;
