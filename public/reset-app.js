// Reset App Script
// This script will clear localStorage data for the Kaku app,
// forcing it to use the latest greeting messages

// Clear all conversations
localStorage.removeItem('conversations');

// Clear demo mode flag
localStorage.removeItem('kaku_demo_mode');

// Reset other storage items if needed
localStorage.removeItem('userSettings');

// Reload the page to start fresh
window.location.reload();

// Add log messages to confirm reset
console.log('Kaku app data has been reset.');
console.log('You should now see the updated greeting message.'); 