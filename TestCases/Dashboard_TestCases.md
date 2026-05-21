# Dashboard Module – Test Cases

Application: Mobipark Member Site
Module: Dashboard
Total Test Cases: 11

---

# Test Case Format

Each test case contains:

* Test Case ID
* Description
* Feature
* Sub Feature
* Preconditions
* Test Steps
* Expected Result

---

# TC_001 – Verify authenticated member can open the Dashboard page successfully

## Feature

Dashboard

## Sub Feature

Access

## Preconditions

None.

## Test Steps

1. Navigate to the Login page
2. Sign in with valid credentials for an activated member account
3. Observe that the Dashboard layout loads

## Expected Result

The system should display the Dashboard without authentication errors for a signed-in member

---

# TC_002 – Verify membership number is displayed on the Dashboard

## Feature

Dashboard

## Sub Feature

Membership Information

## Preconditions

None.

## Test Steps

1. Locate the membership number area on the Dashboard
2. Read the displayed membership number value

## Expected Result

The system should show a membership number and the value should match the member record for the signed-in user

---

# TC_003 – Verify membership registration date is displayed in the member information area

## Feature

Dashboard

## Sub Feature

Membership Information

## Preconditions

None.

## Test Steps

1. Locate the member information panel on the Dashboard
2. Read the membership registration date field

## Expected Result

The system should display the membership registration date and it should match the member record for the signed-in user

---

# TC_004 – Verify member fullname appears in the greeting section

## Feature

Dashboard

## Sub Feature

Personalized Greeting

## Preconditions

None.

## Test Steps

1. Locate the greeting line on the Dashboard
2. Compare the displayed name with the signed-in member profile name

## Expected Result

The system should greet the member using the correct registered full name (fname+lname)

---

# TC_005 – Verify member name appears in the member information panel

## Feature

Dashboard

## Sub Feature

Member Information Panel

## Preconditions

None.

## Test Steps

1. Locate the member information panel on the Dashboard
2. Read the name line in that panel

## Expected Result

The system should display the member name consistent with the signed-in account

---

# TC_006 – Verify registered email address is displayed in the member information panel

## Feature

Dashboard

## Sub Feature

Member Information Panel

## Preconditions

None.

## Test Steps

1. Locate the member information panel on the Dashboard
2. Read the email line in that panel

## Expected Result

The system should display the registered email address for the signed-in member

---

# TC_007 – Verify Vehicle Registration card navigates to the vehicle registration flow or page

## Feature

Dashboard

## Sub Feature

Card Navigation

## Preconditions

None.

## Test Steps

1. On the Dashboard locate the Vehicle Registration action card
2. Click the Vehicle Registration card or its primary clickable area
3. Observe the destination page title or route

## Expected Result

The system should navigate to the vehicle registration destination without errors

---

# TC_008 – Verify Inquiry card navigates to the enquiry or contact flow

## Feature

Dashboard

## Sub Feature

Card Navigation

## Preconditions

None.

## Test Steps

1. Navigate back to the Dashboard if the current page is not the Dashboard
2. On the Dashboard locate the Inquiry action card
3. Click the Inquiry card or its primary clickable area
4. Observe the destination page title or route

## Expected Result

The system should navigate to the enquiry destination without errors

---

# TC_009 – Verify Account Settings card navigates to account settings

## Feature

Dashboard

## Sub Feature

Card Navigation

## Preconditions

None.

## Test Steps

1. Navigate back to the Dashboard if the current page is not the Dashboard
2. On the Dashboard locate the Account Settings action card
3. Click the Account Settings card or its primary clickable area
4. Observe the destination page title or route

## Expected Result

The system should navigate to the account settings area without errors

---

# TC_010 – Verify Account Settings button in the member information panel navigates to account settings

## Feature

Dashboard

## Sub Feature

Sidebar Navigation

## Preconditions

None.

## Test Steps

1. Navigate back to the Dashboard if the current page is not the Dashboard
2. On the Dashboard locate the Account Settings button inside the member information panel
3. Click the Account Settings button
4. Observe the destination page title or route

## Expected Result

The system should navigate to the account settings area without errors

---

# TC_011 – Verify Dashboard is not accessible without authentication when a session is absent

## Feature

Dashboard

## Sub Feature

Access Control

## Preconditions

None.

## Test Steps

1. Ensure no active application session exists (signed out or private window)
2. Attempt to open the Dashboard using a direct Dashboard URL if known
3. Observe the response

## Expected Result

The system should block access and should redirect or prompt for sign-in instead of showing member data

---
