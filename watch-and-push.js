#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const WATCH_INTERVAL = 30000; // Check every 30 seconds
const PROJECT_DIR = __dirname;

console.log('🚀 Starting GitHub auto-push watcher for KASHTEC Construction Management System');
console.log(`📁 Watching directory: ${PROJECT_DIR}`);
console.log(`⏰ Check interval: ${WATCH_INTERVAL / 1000} seconds`);

function hasChanges() {
    try {
        const status = execSync('git status --porcelain', { 
                encoding: 'utf8', 
                cwd: PROJECT_DIR,
                stdio: 'pipe' 
        });
        return status.trim().length > 0;
    } catch (error) {
        console.error('Error checking git status:', error.message);
        return false;
    }
}

function commitAndPush() {
    try {
        console.log('📝 Changes detected, committing...');
        
        // Add all changes
        execSync('git add .', { cwd: PROJECT_DIR, stdio: 'inherit' });
        
        // Create timestamp commit message
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
        const commitMsg = `Auto-commit: Changes at ${timestamp}`;
        
        // Commit changes
        execSync(`git commit -m "${commitMsg}"`, { 
                cwd: PROJECT_DIR, 
                stdio: 'inherit' 
        });
        
        console.log('📤 Pushing to GitHub...');
        
        // Push to main branch
        execSync('git push origin main', { 
                cwd: PROJECT_DIR, 
                stdio: 'inherit' 
        });
        
        console.log(`✅ Successfully pushed to GitHub at ${timestamp}`);
        
    } catch (error) {
        console.error('❌ Error during git operations:', error.message);
    }
}

// Watch for changes
setInterval(() => {
    if (hasChanges()) {
        commitAndPush();
    } else {
        process.stdout.write('.');
    }
}, WATCH_INTERVAL);

console.log('👀 Auto-push watcher is running. Press Ctrl+C to stop.');

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Stopping auto-push watcher...');
    process.exit(0);
});
