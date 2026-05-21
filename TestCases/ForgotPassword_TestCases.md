# Forgot Password Module – Test Cases

Application: Mobipark Member Site

Module: Forgot Password

---

# Test Case ID – Test Case Description

## Feature

Feature


## Sub Feature

Sub Feature


## Preconditions

PreCondition


## Test Steps

Test steps


## Expected Result

Expected Result

---

# TC_001 – Verify user can open the Forgot password page from the Login menu

## Feature

Forgot Password


## Sub Feature

Navigation


## Preconditions

-


## Test Steps

1. Navigate to the Login page
2. Locate and click Forgot your password or the equivalent link that opens the forgot password flow
3. Observe the forgot password page URL and content


## Expected Result

The system should display the forgot password page without requiring the user to be signed in

---

# TC_002 – Verify password reset request is blocked or shows validation when the email field is empty

## Feature

Forgot Password


## Sub Feature

Email Validation


## Preconditions

User is logged in


## Test Steps

1. Open the Forgot password page
2. Leave the email address field empty
3. Click the submit or send reset link control


## Expected Result

The system should prevent the request and should indicate that the email address is required

---

# TC_003 – Verify password reset request is blocked when the email format is invalid

## Feature

Forgot Password


## Sub Feature

Email Validation


## Preconditions

nan


## Test Steps

1. Open the Forgot password page
2. Enter a value that is not a valid email format
3. Click the submit or send reset link control


## Expected Result

The system should prevent the request and should indicate that the email format is invalid

---

# TC_004 – Verify submitting a non-registered email for forgot password

## Feature

Forgot Password


## Sub Feature

Account Enumeration


## Preconditions

nan


## Test Steps

1. Open the Forgot password page
2. Enter a syntactically valid email address that is not registered in the system
3. Click the submit
4. Read the user-visible message


## Expected Result

AN error message should be displayed showing that email is not registered

---

# TC_005 – Verify submitting a registered email triggers a success confirmation suitable for email dispatch

## Feature

Forgot Password


## Sub Feature

Request Reset


## Preconditions

A known activated user account exists with a mailbox the tester can open


## Test Steps

1. Open the Forgot password page
2. Enter an email address that belongs to an activated user account in the system
3. Click the submit or send reset link control
4. Observe the confirmation messaging


## Expected Result

The system should accept the request and should show messaging consistent with sending reset instructions without exposing sensitive tokens on screen

---
