

# Hados Admin Access & Role Management

This document explains how to manage user roles and administrative access within the Hados application.

## 1. Role Definitions

| Role | Description | Capabilities |
| :--- | :--- | :--- |
| `student` | Default role for all new signups. | Post content, join clubs, report items, view campus data. |
| `admin` | Full system controller. | Access dashboard, manage users, approve clubs, moderate content, view audit logs. |

---

## 2. Managing User Roles

Administrative access is managed strictly through Firestore role-based authorization. There are two ways to promote a user to Admin:

### Method A: Admin Dashboard (Recommended)
1.  Log in with an existing **Admin** account.
2.  Navigate to the **Admin Dashboard** > **Users** section.
3.  Search for the user you wish to promote.
4.  Use the **Role Selector** dropdown to select `Admin`.
5.  The change takes effect immediately for that user.

### Method B: Firebase Console (Direct Database Access)
Use this method if there are no existing admins or for manual overrides:
1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Navigate to **Firestore Database**.
3.  Locate the `users` collection.
4.  Find the user document (by UID or Email).
5.  Edit the `role` field from `"student"` to `"admin"`.
6.  The user must refresh the application to see the changes.

---

## 3. Auditing & Security

*   **Activity Logs**: Every role change is automatically recorded in the **Activity Log** (accessible in the Admin Panel). This includes the timestamp, the admin who performed the action, and the previous/new role.
*   **Principle of Least Privilege**: Only grant the `admin` role to highly trusted individuals. Standard moderation can be handled via the Reports system.
*   **Production Safety**: The temporary bootstrap mechanism (`/admin-setup`) has been removed from the application. Roles are now gated strictly by authenticated session claims and database state.
