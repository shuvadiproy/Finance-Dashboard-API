const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/env');
const User = require('../models/User');
const FinancialRecord = require('../models/FinancialRecord');

const seedData = async () => {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('✅ Connected to MongoDB for seeding\n');

    // Clear existing data
    await User.deleteMany({});
    await FinancialRecord.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // ─── Create Users ────────────────────────────────────────

    const users = await User.create([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        isActive: true,
      },
      {
        name: 'Analyst User',
        email: 'analyst@example.com',
        password: 'analyst123',
        role: 'analyst',
        isActive: true,
      },
      {
        name: 'Viewer User',
        email: 'viewer@example.com',
        password: 'viewer123',
        role: 'viewer',
        isActive: true,
      },
    ]);

    const admin = users[0];
    console.log('👤 Created 3 users (admin, analyst, viewer)');

    // ─── Create Financial Records ────────────────────────────

    // Helper: generate a date N months ago from today, on a specific day
    const monthsAgo = (months, day) => {
      const d = new Date();
      d.setMonth(d.getMonth() - months);
      d.setDate(Math.min(day, new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()));
      d.setHours(12, 0, 0, 0);
      return d;
    };

    const records = [
      // Income records (spread over the last 3 months)
      { amount: 75000, type: 'income', category: 'Salary', date: monthsAgo(3, 15), description: 'Monthly salary', createdBy: admin._id },
      { amount: 75000, type: 'income', category: 'Salary', date: monthsAgo(2, 15), description: 'Monthly salary', createdBy: admin._id },
      { amount: 75000, type: 'income', category: 'Salary', date: monthsAgo(1, 15), description: 'Monthly salary', createdBy: admin._id },
      { amount: 15000, type: 'income', category: 'Freelance', date: monthsAgo(3, 20), description: 'Freelance web development project', createdBy: admin._id },
      { amount: 8000, type: 'income', category: 'Freelance', date: monthsAgo(2, 25), description: 'Logo design freelance', createdBy: admin._id },
      { amount: 5000, type: 'income', category: 'Investment', date: monthsAgo(1, 1), description: 'Stock dividends Q1', createdBy: admin._id },
      { amount: 12000, type: 'income', category: 'Investment', date: monthsAgo(3, 10), description: 'Mutual fund returns', createdBy: admin._id },

      // Expense records (spread over the last 3 months)
      { amount: 25000, type: 'expense', category: 'Rent', date: monthsAgo(3, 5), description: 'Monthly house rent', createdBy: admin._id },
      { amount: 25000, type: 'expense', category: 'Rent', date: monthsAgo(2, 5), description: 'Monthly house rent', createdBy: admin._id },
      { amount: 25000, type: 'expense', category: 'Rent', date: monthsAgo(1, 5), description: 'Monthly house rent', createdBy: admin._id },
      { amount: 3500, type: 'expense', category: 'Utilities', date: monthsAgo(3, 10), description: 'Electricity bill', createdBy: admin._id },
      { amount: 2800, type: 'expense', category: 'Utilities', date: monthsAgo(2, 10), description: 'Electricity + water bill', createdBy: admin._id },
      { amount: 3200, type: 'expense', category: 'Utilities', date: monthsAgo(1, 10), description: 'Electricity + internet bill', createdBy: admin._id },
      { amount: 6000, type: 'expense', category: 'Food', date: monthsAgo(3, 28), description: 'Monthly groceries', createdBy: admin._id },
      { amount: 5500, type: 'expense', category: 'Food', date: monthsAgo(2, 28), description: 'Monthly groceries', createdBy: admin._id },
      { amount: 7000, type: 'expense', category: 'Food', date: monthsAgo(1, 28), description: 'Monthly groceries', createdBy: admin._id },
      { amount: 2000, type: 'expense', category: 'Transport', date: monthsAgo(3, 15), description: 'Monthly metro pass', createdBy: admin._id },
      { amount: 2000, type: 'expense', category: 'Transport', date: monthsAgo(2, 15), description: 'Monthly metro pass', createdBy: admin._id },
      { amount: 4500, type: 'expense', category: 'Healthcare', date: monthsAgo(2, 20), description: 'Doctor visit and medicines', createdBy: admin._id },
      { amount: 3000, type: 'expense', category: 'Entertainment', date: monthsAgo(3, 25), description: 'Movie and dinner', createdBy: admin._id },
      { amount: 15000, type: 'expense', category: 'Shopping', date: monthsAgo(1, 20), description: 'New laptop accessories', createdBy: admin._id },
      { amount: 8000, type: 'expense', category: 'Education', date: monthsAgo(2, 1), description: 'Online course subscription', createdBy: admin._id },
      { amount: 12000, type: 'expense', category: 'Travel', date: monthsAgo(1, 25), description: 'Weekend trip to hills', createdBy: admin._id },
      { amount: 5000, type: 'expense', category: 'Insurance', date: monthsAgo(3, 1), description: 'Term insurance premium', createdBy: admin._id },
      { amount: 10000, type: 'expense', category: 'Savings', date: monthsAgo(1, 28), description: 'Monthly SIP investment', createdBy: admin._id },
    ];

    await FinancialRecord.create(records);
    console.log(`💰 Created ${records.length} financial records\n`);

    // ─── Summary ─────────────────────────────────────────────

    console.log('═══════════════════════════════════════════');
    console.log('  🌱 SEED DATA CREATED SUCCESSFULLY!');
    console.log('═══════════════════════════════════════════');
    console.log('');
    console.log('  Login Credentials:');
    console.log('  ─────────────────────────────────────────');
    console.log('  Admin:   admin@example.com   / admin123');
    console.log('  Analyst: analyst@example.com / analyst123');
    console.log('  Viewer:  viewer@example.com  / viewer123');
    console.log('');
    console.log('═══════════════════════════════════════════\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedData();
