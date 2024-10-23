# Data Access Folder

This folder contains utility functions for data access operations. These functions are designed to be:

1. Only called on the server
2. Only used within server components
3. Only used within API routes

Do not import or use these functions in client-side code or components, as they may contain sensitive operations or access restricted resources.

Ensure that any new functions added to this folder adhere to these guidelines to maintain proper separation between client and server code.
