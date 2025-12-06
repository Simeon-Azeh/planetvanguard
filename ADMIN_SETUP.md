# Planet Vanguard Admin Dashboard Setup

## Firebase Collections Structure

The admin dashboard uses the following Firestore collections:

### 1. **users** Collection
Stores admin user data. Users are keyed by UID (recommended best practice).

**Important**: The dashboard expects user documents to be keyed by Firebase Auth UID, not email.

Example document structure:
```
Document ID: <Firebase Auth UID>
Fields:
  - email: "admin@planetvanguard.org" (string)
  - name: "Simeon Azeh" (string)
  - role: "admin" (string)
  - createdAt: (timestamp)
```

**Migration Note**: If you have existing email-keyed user documents (e.g., `admin@planetvanguard.org`), you must migrate them to UID-keyed documents. See the migration section below.

### 2. **projects** Collection
Stores project/initiative data with fields:
- title (string)
- description (string)
- category (string)
- location (string)
- status: "ongoing" | "completed" | "planned" (string)
- impact: { beneficiaries: number, duration: string, budget: string }
- image (string - URL)
- featured (boolean)
- createdAt (timestamp)
- updatedAt (timestamp)

### 3. **events** Collection
Stores event data with fields:
- title (string)
- description (string)
- date (string - YYYY-MM-DD format)
- time (string)
- location (string)
- category (string)
- image (string - URL)
- registrationLink (string - URL)
- capacity (number)
- featured (boolean)
- createdAt (timestamp)
- updatedAt (timestamp)

### 4. **gallery** Collection
Stores media items with fields:
- title (string)
- description (string)
- type: "image" | "video" (string)
- url (string - image URL or YouTube URL)
- category (string)
- featured (boolean)
- createdAt (timestamp)
- updatedAt (timestamp)

### 5. **subscriptions** Collection
Newsletter subscribers (auto-created by Newsletter component):
- email (string)
- timestamp (timestamp)

### 6. **volunteers** Collection
Volunteer form submissions (auto-created by GetInvolved component):
- name (string)
- email (string)
- phone (string)
- interests (array of strings)
- message (string)
- timestamp (timestamp)

### 7. **contacts** Collection
Contact form submissions (auto-created by Contact component):
- name (string)
- email (string)
- subject (string)
- message (string)
- timestamp (timestamp)

## Setup Instructions

### Step 1: Create Admin User Document

After deploying your Firebase project, you need to manually create the admin user document in Firestore:

1. Go to Firebase Console → Firestore Database
2. Click "Start collection"
3. Collection ID: `users`
4. Document ID: `admin@planetvanguard.org`
5. Add fields:
   - email: `admin@planetvanguard.org`
   - name: `Simeon Azeh`
   - role: `admin`
   - createdAt: (Click "Add field" → Type: timestamp → Use server timestamp)

### Step 2: Create the Admin Account in Firebase Authentication

1. Go to Firebase Console → Authentication
2. Click "Add user"
3. Email: `admin@planetvanguard.org`
4. Password: (Set a secure password)
5. Click "Add user"

### Step 3: Environment Variables

Make sure your `.env.local` file contains all required Firebase configuration variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

### Step 4: Firestore Security Rules

Update your Firestore security rules to protect admin data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - only admins can read/write
    match /users/{userId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.token.email)).data.role == 'admin';
    }
    
    // Projects, Events, Gallery - admins can write, everyone can read
    match /projects/{projectId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.token.email)).data.role == 'admin';
    }
    
    match /events/{eventId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.token.email)).data.role == 'admin';
    }
    
    match /gallery/{itemId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.token.email)).data.role == 'admin';
    }
    
    // Subscriptions, volunteers, contacts - allow create, admins can read/delete
    match /subscriptions/{subId} {
      allow create: if true;
      allow read, delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.token.email)).data.role == 'admin';
    }
    
    match /volunteers/{volunteerId} {
      allow create: if true;
      allow read, delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.token.email)).data.role == 'admin';
    }
    
    match /contacts/{contactId} {
      allow create: if true;
      allow read, delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.token.email)).data.role == 'admin';
    }
  }
}
```

## Accessing the Dashboard

1. Navigate to: `http://localhost:3000/admin/login` (or your deployed URL)
2. Login with: `admin@planetvanguard.org` and the password you set
3. You'll be redirected to: `/admin/dashboard`

## Dashboard Features

### Overview
- View statistics (projects, events, gallery items, subscribers, volunteers, contacts)
- Recent activity feed

### Projects Manager
- Create, edit, and delete projects
- Set project status (ongoing, completed, planned)
- Add impact metrics (beneficiaries, duration, budget)
- Mark projects as featured

### Events Manager
- Create, edit, and delete events
- Set event date, time, and location
- Add registration links
- Set capacity limits
- Mark events as featured

### Gallery Manager
- Upload images and YouTube videos
- Categorize media items
- Mark items as featured

### Newsletter Manager
- View all subscribers
- Export subscriber list to CSV
- Remove subscribers

## Frontend Integration

The following frontend components automatically pull data from Firebase:

- **Events Component** (`/src/app/components/Events.js`) - Displays events from Firestore
- **Gallery Component** (`/src/app/components/Gallery.js`) - Displays gallery items from Firestore
- **Initiatives Component** (`/src/app/components/Initiatives.js`) - Displays projects from Firestore

All changes made in the admin dashboard will immediately reflect on the frontend upon page refresh!

## Migrating Email-keyed Users to UID-keyed Users

If you have existing user documents keyed by email (e.g., `users/admin@planetvanguard.org`), you must migrate them to UID-keyed documents to work with the current security rules and dashboard code.

### Option 1: Manual Migration (Recommended for few users)

1. Go to Firebase Console → Firestore Database
2. Find your `users` collection
3. For each email-keyed document:
   - Note the email address
   - Go to Firebase Console → Authentication
   - Find the user by email and copy their UID
   - Create a new document in `users` collection with the UID as document ID
   - Copy all fields from the email-keyed document
   - Delete the old email-keyed document (optional, after verification)

### Option 2: Automated Script Migration

Use the included migration script at `scripts/migrate-users-email-to-uid.js`:

1. Download your Firebase service account key:
   - Go to Firebase Console → Project Settings → Service Accounts
   - Click "Generate new private key"
   - Save the JSON file securely

2. Set environment variable (Windows PowerShell):
   ```powershell
   $env:GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\serviceAccountKey.json"
   ```

3. Install firebase-admin (if not installed):
   ```powershell
   npm install firebase-admin
   ```

4. Run the migration script:
   ```powershell
   node scripts/migrate-users-email-to-uid.js
   ```

5. Verify in Firestore Console that documents now exist under UID keys

The script will copy email-keyed documents to UID-keyed documents without deleting the originals. After verification, you can manually delete the old email-keyed documents.

## Troubleshooting

### "Authentication failed" on login
- Verify the user exists in Firebase Authentication
- Check that the email ends with `@planetvanguard.org`
- Ensure the user document exists in Firestore with `role: "admin"`

### "Permission denied" errors
- Check Firestore security rules
- Verify the admin user document has the correct `role` field

### Data not showing on frontend
- Check browser console for errors
- Verify Firestore collections have data
- Check that environment variables are properly set
- Ensure `createdAt` timestamps exist on documents for ordering

### Admin dashboard not accessible
- Verify the route: `/admin/dashboard`
- Check that you're logged in
- Clear browser cache and cookies
