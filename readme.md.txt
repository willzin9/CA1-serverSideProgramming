 CA1 – Server-Side Programming  
Student: William de Brito Leal (ID: 2024230)  

Project Overview

This project is part of the Server-Side Programming module at CCT College Dublin.  
The goal is to build a simple web application that collects user data through an HTML form, validates it on both the client and server, and then inserts valid data into a database.  
The server must handle port and database errors gracefully and return clear messages to the user.



Requirements (as described in the CA brief)
- Client-side validation for all form fields:  
  - First Name / Last Name: alphanumeric only, max 20 characters.  
  - Email: valid format.  
  - Phone Number: exactly 10 numeric digits.  
  - Eircode: 6 alphanumeric characters, must start with a number.  
  - Server: Express.js app listening on a specific port (e.g., 3000), receives POST data and handles server/port errors.  
  - Database: MySQL or SQLite. Insert only valid data into  
  - user_data(first_name, last_name, email, phone_number, eircode).


Folder Structure

 Accessibility & User Experience
- Each input has a descriptive label.  
- Clear helper text and visible error messages.  
- Keyboard-friendly navigation (Tab order).  
- Form feedback area for success/error messages.



   Submission Details
- Deliver a Word document (~1200 ± 5%) with Harvard referencing.  
- Submit individual .html,.css, and .js files (not zipped) through Moodle.  
- Deadline: Sunday, 26 October 2025 @ 23:59.  
- Late submission up to 5 days → −10%; after 5 days → 0%.  
- Minimum **7 commits** on different dates/times using GitHub Classroom.  
- Include an AI-use declaration.



 AI Use Declaration
> I used ChatGPT for brainstorming, outlining, and grammar/style checks only.  
> I did not use AI to generate any assignment code or to draft the report content.
