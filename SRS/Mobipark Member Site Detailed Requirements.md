# Mobipark Member Site – Detailed Requirement Specification

Version: 1.0
Prepared From: Software Design Document – Member Site Phase 1
Application: Mobipark Member Site

---

# 1. Introduction

## 1.1 Purpose

The purpose of this document is to define the detailed functional and non-functional requirements for the Mobipark Member Site application. The application enables users to register and manage vehicles, maintain membership information, raise inquiries, and manage account credentials.

This requirement specification serves as the primary reference for:

* Development
* QA/Test Design
* API Integration
* UI/UX Validation
* Acceptance Testing

---

# 2. System Overview

The Mobipark Member Site is a customer-facing web platform that allows users to:

* Register as members
* Log into the system
* Register purchased vehicles
* View warranty information
* Raise inquiries
* Manage account details
* Reset and change passwords

The platform integrates with the Mobipark Main System for vehicle verification and membership synchronization.

---

# 3. Technology Stack

| Component        | Technology          |
| ---------------- | ------------------- |
| Backend          | Spring Boot 4.0.5   |
| Frontend         | React 19            |
| Database         | MySQL 8             |
| Application Type | RESTful Web Service |
| Infrastructure   | AWS                 |

---

# 4. Supported Browsers

## Windows

* Microsoft Edge Version 143.0.3650.80
* Google Chrome Version 143.0.7499.41

## macOS

* Safari 12+
* Google Chrome Version 143.0.7499.41

---

# 5. User Roles

The application supports a single user role:

| Role        | Description                   |
| ----------- | ----------------------------- |
| Member User | Standard customer/member user |

---

# 6. Password Policy Requirements

All passwords within the system must comply with the following rules:

| Requirement         | Details       |
| ------------------- | ------------- |
| Minimum Length      | 8 characters  |
| Maximum Length      | 20 characters |
| Uppercase Character | Mandatory     |
| Lowercase Character | Mandatory     |
| Numeric Character   | Mandatory     |
| Special Character   | Mandatory     |
| Empty Password      | Not allowed   |

## Additional Notes

* Account lock after repeated invalid login attempts is NOT implemented.
* Password validation applies to:

  * Registration
  * Change Password
  * Reset Password

---

# 7. Functional Requirements

---

# 7.1 Login Module

## Description

Users can log into the application using registered credentials.

## Functional Flow

1. User opens login page.
2. User enters email address.
3. User enters password.
4. User clicks Submit.
5. System validates credentials.
6. User is redirected to Dashboard upon successful authentication.
7. Appropriate validation message is displayed for invalid credentials.

## Fields & Validation

| Field                  | Type   | Validation                        |
| ---------------------- | ------ | --------------------------------- |
| Email Address          | Input  | Required, Valid email format      |
| Password               | Input  | Required, Maximum 20 characters   |
| Forgot Password        | Link   | Navigates to Forgot Password page |
| Register as New Member | Link   | Navigates to Registration page    |
| Submit                 | Button | Initiates login                   |

## Business Rules

* Only activated users may log in.
* Session must be created upon successful login.
* Invalid credentials must display an error message.

---

# 7.2 Registration Module

## Description

Users can create a new member account.

## Functional Flow

1. User navigates to Registration page.
2. User enters all required information.
3. User submits the form.
4. System validates all fields.
5. Activation email is sent.
6. User clicks activation link.
7. Account becomes active.

## Activation Rules

* Activation link validity: 7 days.
* Expired links must become invalid.
* Only activated users can log in.

## Registration Fields

| Field            | Validation                                             |
| ---------------- | ------------------------------------------------------ |
| First Name       | Required, Max 25 characters                            |
| Last Name        | Required, Max 25 characters                            |
| Gender           | Optional Radio Button                                  |
| Date of Birth    | Required, User must be older than 16 years             |
| Email Address    | Required, Valid email format                           |
| Telephone Number | Required, 6–15 characters, Supports +, spaces, hyphens |
| Postal Code      | Required, Max 50 characters                            |
| Prefecture       | Required                                               |
| Municipality     | Required, Max 50 characters                            |
| Street Address   | Required, Max 255 characters                           |
| Building Name    | Optional, Max 50 characters                            |
| Password         | Must follow password policy                            |
| Confirm Password | Must match password                                    |

## Business Rules

* Duplicate email addresses must not be allowed.
* Password and confirm password must match.
* User must be at least 16 years old.
* Email activation is mandatory.

---

# 7.3 Dashboard Module

## Description

The dashboard acts as the landing page after successful login.

## Functional Requirements

The dashboard shall display:

* Membership registration date
* Membership number
* Navigation cards/menus
* Quick access to application features

## Navigation Targets

Users must be able to navigate to:

* Registered Vehicles
* New Vehicle Registration
* New Inquiry
* Account Settings
* Change Password

---

# 7.4 View Registered Vehicles Module

## Description

Users can view all vehicles registered under their account.

## Functional Requirements

The system shall display:

* Vehicle Serial Number
* Purchase Date
* Warranty Period
* Ownership Status

## Business Rules

* Only vehicles registered by the logged-in user shall be displayed.
* Vehicle list should persist across sessions.

---

# 7.5 New Vehicle Registration Module

## Description

Users can register a vehicle using its Vehicle Identification Number (VIN).

## Functional Flow

1. User opens Vehicle Registration page.
2. User enters Vehicle Identification Number.
3. User clicks Search.
4. System sends API request to Mobipark Main System.
5. Vehicle data is validated.
6. If found:

   * Vehicle information is displayed.
   * Register button becomes available.
7. User clicks Register.
8. Vehicle registration is completed.

## Search Validation

| Field                         | Validation |
| ----------------------------- | ---------- |
| Vehicle Identification Number | Required   |

## Vehicle Search Rules

* VIN search must be case-insensitive.
* API integration with Mobipark Main System is mandatory.
* If no matching vehicle is found, system must display an appropriate message.

## Warranty Rules

| Condition                        | Warranty Duration |
| -------------------------------- | ----------------- |
| Purchase date within 1 month     | 2 years           |
| Purchase date older than 1 month | 1 year            |
| Purchase date unavailable        | 1 year default    |

## Registration Rules

* Same user cannot register the same vehicle multiple times.
* Different users may register the same vehicle.
* Each user is allowed only one registration per vehicle.
* Warranty information shall not be shown for previously owned vehicles by the same user.
* Inventory status validation is NOT implemented.

## Membership Synchronization Rule

* During first-time vehicle registration, membership registration date must be updated in the Mobipark Main System.

---

# 7.6 Inquiry Module

## Description

Users can submit inquiries related to registered vehicles or general support.

## Functional Flow

1. User opens Inquiry page.
2. User selects inquiry target.
3. User selects target vehicle if applicable.
4. User selects category.
5. User enters inquiry details.
6. User submits inquiry.
7. System sends confirmation email.

## Inquiry Fields

| Field           | Validation                    |
| --------------- | ----------------------------- |
| Inquiry Target  | Required                      |
| Target Vehicle  | Required                      |
| Category        | Required                      |
| Inquiry Details | Required, Max 1000 characters |
| Submit Inquiry  | Submits inquiry               |

## Business Rules

* Inquiry may be vehicle-specific or general.
* Confirmation email must be sent after submission.
* Email thread should support continued communication.

---

# 7.7 Account Settings Module

## Description

Users can edit their profile details.

## Editable Fields

| Field            | Editable |
| ---------------- | -------- |
| First Name       | Yes      |
| Last Name        | Yes      |
| Gender           | Yes      |
| Date of Birth    | Yes      |
| Telephone Number | Yes      |
| Postal Code      | Yes      |
| Prefecture       | Yes      |
| Municipality     | Yes      |
| Street Address   | Yes      |
| Building Name    | Yes      |

## Non-Editable Fields

| Field                        |
| ---------------------------- |
| Membership Number            |
| Membership Registration Date |
| Email Address                |

## Validation Rules

* Same validation rules as Registration module apply.

---

# 7.8 Forgot Password Module

## Description

Users can reset forgotten passwords.

## Functional Flow

1. User clicks Forgot Password.
2. User enters registered email.
3. System sends reset password link.
4. User opens reset link.
5. User enters new password.
6. Password is updated.

## Security Rules

* System must display success response even for unregistered emails.
* Reset links must be secure.
* Password policy validation must apply.

## Business Rules

* Existing password is replaced after successful reset.
* User can log in using the new password.

---

# 7.9 Change Password Module

## Description

Users can change their current password.

## Functional Flow

1. User opens Change Password page.
2. User enters current password.
3. User enters new password.
4. System validates current password.
5. System validates new password policy.
6. Password is updated.

## Business Rules

* Current password must match.
* New password must follow password policy.
* Existing active sessions must be invalidated after password change.

---

# 8. API Integration Requirements

## External System

Mobipark Main System

## Integration Areas

| Module                     | Purpose                                       |
| -------------------------- | --------------------------------------------- |
| Vehicle Registration       | Validate VIN and retrieve vehicle information |
| Membership Synchronization | Update member registration information        |

## API Requirements

* REST API architecture
* Secure communication
* Proper error handling
* Timeout handling
* Logging and monitoring

---

# 9. Non-Functional Requirements

## Performance

* System supports up to 200 concurrent users.
* Application should maintain acceptable response times.

## Security

* Password policy enforcement mandatory.
* Secure authentication required.
* Secure password reset flow required.
* Sensitive information must not be exposed.

## Usability

* Responsive UI design.
* User-friendly navigation.
* Clear validation/error messages.

## Compatibility

Application must support:

* Windows browsers
* macOS browsers
* Latest Chrome
* Latest Edge
* Safari 12+

## Availability

* System should remain accessible during standard operating periods.

## Maintainability

* Modular REST architecture.
* Clear separation between frontend and backend.
* API-driven integrations.

---

# 10. Validation Requirements

## Mandatory Validations

| Validation Area | Requirement                 |
| --------------- | --------------------------- |
| Email           | Valid email format          |
| Password        | Password policy enforcement |
| DOB             | User must be older than 16  |
| Telephone       | 6–15 characters             |
| Required Fields | Must not be empty           |
| VIN             | Required for vehicle search |

---

# 11. Error Handling Requirements

The application must:

* Display user-friendly validation messages.
* Handle API failures gracefully.
* Prevent application crashes.
* Log unexpected failures.
* Prevent sensitive data leakage.

---

# 12. Session Management Requirements

## Session Rules

* Session created after successful login.
* Sessions invalidated after password change.
* Unauthorized access must redirect to login page.

---

# 13. Email Notification Requirements

## Email Scenarios

| Scenario                | Email Required |
| ----------------------- | -------------- |
| Registration Activation | Yes            |
| Forgot Password         | Yes            |
| Inquiry Submission      | Yes            |

## Email Requirements

* Emails must contain secure links.
* Links must support expiry where applicable.
* Email delivery failures should be logged.

---

# 14. Out of Scope

The following are NOT included in Phase 1:

* Multi-role access management
* Inventory status validation
* Account lock after failed attempts
* Advanced analytics/reporting
* Admin management portal

---

# 15. Assumptions

* Users have internet connectivity.
* External Mobipark APIs are available.
* Email delivery services are operational.
* Browser compatibility environments are supported.

---

# 16. Dependencies

| Dependency                | Purpose                                       |
| ------------------------- | --------------------------------------------- |
| Mobipark Main System APIs | Vehicle lookup and membership synchronization |
| Email Service             | Activation/reset/inquiry emails               |
| AWS Infrastructure        | Hosting and storage                           |

---

# 17. Summary

The Mobipark Member Site provides a centralized membership and vehicle warranty management platform. The system focuses on secure user registration, vehicle registration workflows, inquiry management, and account maintenance while integrating with external Mobipark systems for validation and synchronization.
