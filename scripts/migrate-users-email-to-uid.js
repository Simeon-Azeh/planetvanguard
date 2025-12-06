// Migration script: copies email-keyed user docs to UID-keyed docs
// Usage:
// 1. Create a Firebase service account JSON and set env variable:
//    setx GOOGLE_APPLICATION_CREDENTIALS "C:\path\to\serviceAccountKey.json"
// 2. Run: node scripts/migrate-users-email-to-uid.js

const admin = require('firebase-admin');

// Initialize with default service account set via GOOGLE_APPLICATION_CREDENTIALS
admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();

async function migrate() {
    console.log('Starting migration: users (email -> uid)');
    const usersSnapshot = await db.collection('users').get();
    const total = usersSnapshot.size;
    console.log(`Found ${total} users in users collection`);
    let migrated = 0;
    let skipped = 0;

    for (const docSnap of usersSnapshot.docs) {
        const id = docSnap.id;
        // simple heuristic: if id contains @ then it's an email-keyed doc
        if (!id.includes('@')) {
            skipped++;
            continue;
        }

        const data = docSnap.data();
        try {
            const user = await auth.getUserByEmail(id);
            const uid = user.uid;
            const targetRef = db.collection('users').doc(uid);
            // Copy doc if target doesn't exist or asking to overwrite (here we overwrite)
            await targetRef.set(data, { merge: true });
            // Optionally delete the old email-keyed doc
            // await docSnap.ref.delete();
            migrated++;
            console.log(`Migrated ${id} -> ${uid}`);
        } catch (err) {
            console.error(`Failed migrating ${id}: ${err.message}`);
        }
    }

    console.log(`Migration complete. Migrated: ${migrated}, Skipped: ${skipped}`);
}

migrate().catch(err => {
    console.error('Migration failed:', err);
    process.exitCode = 1;
});
