# Hados Admin Access & Role Management

This document explains how to set up administrative access and manage user roles within the Hados application.

## 1. Initial Setup (Bootstrapping the first Admin)

To prevent hardcoded credentials in the source code, Hados uses a **Setup Key** mechanism.

### Method A: Web Bootstrap (Recommended for Dev/Staging)
1.  Open your `.env` file (or environment variables in your hosting provider).
2.  Set `VITE_ADMIN_SETUP_KEY` to a strong secret string.
    ```env
    VITE_ADMIN_SETUP_KEY=my_secure_bootstrap_key_123
    ```
3.  Restart your development server (`npm run dev`).
4.  Log in to the Hados app with your standard account.
5.  Navigate to `/admin-setup` in your browser.
6.  Enter the secret key and click **Promote to Admin**.
7.  **IMPORTANT:** Once the first admin is created, you should remove this environment variable from production to close the setup route.

### Method B: Firebase Console (Direct Database Access)
1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Navigate to **Firestore Database**.
3.  Locate the `users` collection.
4.  Find your user document (by UID or Email).
5.  Edit the `role` field from `"student"` to `"admin"`.
6.  Refresh the app.

---

## 2. Managing Other Users

Once you have one Admin account, you can manage all other users through the built-in UI:

1.  Navigate to the **Admin Dashboard**.
2.  Go to the **Users** section.
3.  Search for a user by name or email.
4.  Use the **Role Selector** dropdown to promote or demote users instantly.
5.  All role changes are logged in the **Activity Log** for audit purposes.

---

## 3. Role Definitions

| Role | Description | Capabilities |
| :--- | :--- | :--- |
| `student` | Default role for all new signups. | Post content, join clubs, report items, view campus data. |
| `admin` | Full system controller. | Access dashboard, manage users, approve clubs, moderate content, view audit logs. |

---

## 4. Security Best Practices

*   **Audit Logs**: Regularly check the **Activity Log** in the admin panel to monitor role changes and moderation actions.
*   **Principle of Least Privilege**: Only grant the `admin` role to trusted individuals.
*   **No Hardcoding**: Never hardcode admin emails in the codebase. Always use the Firestore `role` field as the source of truth.
