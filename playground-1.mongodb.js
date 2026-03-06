/* global use, db */
// MongoDB Playground
// Use Ctrl+Alt+P (Windows/Linux) or Cmd+Shift+P (macOS) and select "MongoDB: Connect" first

// Select the database to use.
use('ric-sau');

// Test connection by listing collections
db.getCollectionNames();

// Try to count documents in a collection (example: users)
db.users.countDocuments();

// Show database stats
db.stats();
