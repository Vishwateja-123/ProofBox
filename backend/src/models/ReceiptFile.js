import mongoose from 'mongoose';

const receiptFileSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    originalName: {
      type: String,
      required: true
    },
    contentType: {
      type: String,
      required: true,
      default: 'application/octet-stream'
    },
    size: {
      type: Number,
      required: true
    },
    data: {
      type: Buffer,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const ReceiptFile = mongoose.model('ReceiptFile', receiptFileSchema);
export default ReceiptFile;
