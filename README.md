# Mail Application

A simple, yet functional, web-based email client that allows users to send and receive emails.

## Key Features:

- **User Authentication**: Users can register, log in, and log out.
  
- **Compose Email**: Users can compose and send new emails with a subject and message body.
  
- **Mailbox Views**: Users can view emails in their 'Inbox', 'Sent', and 'Archived' folders.
  
- **Email Details**: Clicking on an email displays its full content, along with options to reply, mark as unread, or archive/unarchive.
  
- **Reply to Email**: Users can easily reply to received emails, with the subject and recipient fields pre-filled.
  
- **Notification for Unread Emails**: Displays a count of unread emails in the inbox.

- **Interactivity**: The application is responsive, providing visual feedback for read and unread emails, and displaying alerts for specific actions.

## Languages & Tools Used:

- **Frontend**:
  - **HTML**: Structure of the web pages.
  - **CSS (Bootstrap)**: Styling the web pages. The Bootstrap framework is used to enhance the look and make the application responsive.
  - **JavaScript**: Powers the interactive features, DOM manipulations, and AJAX requests.
  
- **Backend**:
  - **Python (Django)**: The application's backend logic is built using Django, a high-level Python web framework.
  - **Django Models**: Used for data modeling, representing users and emails in the database.

- **Database**:
  - **Django's default SQLite database** (can be changed to other databases if scaled): Storing user information, emails, and their metadata.

## Files Overview:

- **inbox.js**: Contains the JavaScript functions and event listeners that power most of the interactivity of the application.
  
- **inbox.html**: The main HTML template showing the user's email, buttons to navigate between different views, and sections to display emails and their content.
  
- **views.py**: Contains the backend logic, handling different routes, data processing, and database operations.
  
- **urls.py**: Defines the URLs for the different routes in the application.
  
- **models.py**: Defines the data models (`User` and `Email`) used in the application.