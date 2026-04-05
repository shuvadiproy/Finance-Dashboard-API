const mongoose = require('mongoose');
const { RECORD_TYPES, CATEGORIES } = require('../utils/constants');

const financialRecordSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    type: {
      type: String,
      required: [true, 'Type is required'],
      enum: {
        values: Object.values(RECORD_TYPES),
        message: 'Type must be either income or expense',
      },
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: CATEGORIES,
        message: `Category must be one of: ${CATEGORIES.join(', ')}`,
      },
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      validate: {
        validator: function (value) {
          return value <= new Date();
        },
        message: 'Date cannot be in the future',
      },
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Index for efficient querying
financialRecordSchema.index({ type: 1, category: 1, date: -1 });
financialRecordSchema.index({ createdBy: 1 });
financialRecordSchema.index({ isDeleted: 1 });
financialRecordSchema.index({ description: 'text' }); // Text search index

module.exports = mongoose.model('FinancialRecord', financialRecordSchema);
