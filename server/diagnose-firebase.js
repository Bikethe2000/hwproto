#!/usr/bin/env node
/**
 * Diagnostic script to verify Firebase credentials and connectivity
 */
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

console.log('\n=== Firebase Credentials Diagnostic ===\n');

// 1. Check environment variables
console.log('1. Environment Variables:');
console.log(`   GOOGLE_APPLICATION_CREDENTIALS: ${process.env.GOOGLE_APPLICATION_CREDENTIALS || '(not set)'}`);
console.log(`   FIREBASE_SERVICE_ACCOUNT: ${process.env.FIREBASE_SERVICE_ACCOUNT ? '(set)' : '(not set)'}`);
console.log();

// 2. Check credentials.json file
console.log('2. Credentials File:');
const credPath = path.join(__dirname, 'hwproto-8beaf-c20c412679c2.json');
if (fs.existsSync(credPath)) {
  console.log(`   ✓ Found: ${credPath}`);
  try {
    const creds = JSON.parse(fs.readFileSync(credPath, 'utf8'));
    console.log(`   Project ID: ${creds.project_id}`);
    console.log(`   Type: ${creds.type}`);
    console.log(`   Client Email: ${creds.client_email}`);
    console.log(`   Key ID: ${creds.private_key_id}`);
    
    // Validate key format
    if (creds.private_key && creds.private_key.startsWith('-----BEGIN PRIVATE KEY-----')) {
      console.log(`   ✓ Private key format valid`);
    } else {
      console.log(`   ✗ Private key format invalid`);
    }
  } catch (e) {
    console.log(`   ✗ Error parsing credentials.json: ${e.message}`);
  }
} else {
  console.log(`   ✗ File not found: ${credPath}`);
}
console.log();

// 3. Try to initialize Firebase Admin and test Firestore
console.log('3. Firebase Admin SDK Test:');
try {
  const admin = require('firebase-admin');
  
  // Check if already initialized
  if (admin.apps.length === 0) {
    let credential;
    let serviceAccount;
    
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        credential = admin.credential.cert(serviceAccount);
        console.log(`   ✓ Loaded credential from FIREBASE_SERVICE_ACCOUNT env var`);
      } catch (e) {
        console.log(`   ✗ Failed to parse FIREBASE_SERVICE_ACCOUNT: ${e.message}`);
      }
    }
    
    if (!credential && fs.existsSync(credPath)) {
      try {
        serviceAccount = JSON.parse(fs.readFileSync(credPath, 'utf8'));
        credential = admin.credential.cert(serviceAccount);
        console.log(`   ✓ Loaded credential from credentials.json`);
      } catch (e) {
        console.log(`   ✗ Failed to load from credentials.json: ${e.message}`);
      }
    }
    
    if (!credential) {
      try {
        credential = admin.credential.applicationDefault();
        console.log(`   ✓ Using application default credentials`);
      } catch (e) {
        console.log(`   ✗ No valid credential found: ${e.message}`);
      }
    }
    
    if (credential) {
      const app = admin.initializeApp({ credential });
      console.log(`   ✓ Firebase Admin SDK initialized`);
      
      // Test Firestore connectivity
      console.log('\n4. Firestore Connectivity Test:');
      const db = admin.firestore();
      
      db.collection('diagnostic_tests')
        .doc('startup_check')
        .get()
        .then(() => {
          console.log(`   ✓ Firestore connection successful`);
          process.exit(0);
        })
        .catch((err) => {
          console.log(`   ✗ Firestore error: ${err.code || err.message}`);
          console.log(`   Details: ${err.message}`);
          
          if (err.code === 16) {
            console.log('\n   This is an UNAUTHENTICATED error (code 16).');
            console.log('   Possible causes:');
            console.log('   - Service account key is invalid or revoked');
            console.log('   - Service account does not have Firestore permissions');
            console.log('   - Project ID mismatch');
            console.log('\n   To fix:');
            console.log('   1. Visit Google Cloud Console: https://console.cloud.google.com');
            console.log('   2. Select project: hwproto-8beaf');
            console.log('   3. Go to Service Accounts');
            console.log('   4. Verify firebase-adminsdk-fbsvc@hwproto-8beaf.iam.gserviceaccount.com exists');
            console.log('   5. Check it has "Datastore Owner" or "Firestore Owner" role');
            console.log('   6. If old, regenerate the key');
          }
          process.exit(1);
        });
    }
  } else {
    console.log(`   Firebase Admin SDK already initialized (${admin.apps.length} apps)`);
  }
} catch (e) {
  console.log(`   ✗ Failed to load Firebase Admin SDK: ${e.message}`);
}
