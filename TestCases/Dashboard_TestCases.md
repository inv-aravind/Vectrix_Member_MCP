# Test Cases from Dashboard Sheet

## Test Case & Result

| Test Case Category | Module testing |
| --- | --- |
| Sl. No. | Test Case ID | Test Case Description | Feature | Sub Feature | Test steps | PreCondition | Expected Result | Category | Status | Sweep 1 | Sweep 2 | Comments |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Actual Result | Build | Pass/ Fail | Bug ID | Actual Result | Build | Pass/ Fail | Bug ID |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | TC_001 | Verify authenticated member can open the Dashboard page successfully | Dashboard | Access | 1. Navigate to the Login page
2. Sign in with valid credentials for an activated member account
3. Observe that the Dashboard layout loads | - | The system should display the Dashboard without authentication errors for a signed-in member | Module Test | Pass | The Dashboard is displayed without authentication errors for a signed-in member | #1 | Pass | The Dashboard is displayed without authentication errors for a signed-in member | #4 | Pass |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2 | TC_002 | Verify membership number is displayed on the Dashboard | Dashboard | Membership Information | 1. Locate the membership number area on the Dashboard
2. Read the displayed membership number value | The system should show a membership number and the value should match the member record for the signed-in user | Pass | A membership number is displayed and the value matches the member record for the signed-in user | #1 | Pass | A membership number is displayed and the value matches the member record for the signed-in user | #4 | Pass |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 3 | TC_003 | Verify membership registration date is displayed in the member information area | Dashboard | Membership Information | 1. Locate the member information panel on the Dashboard
2. Read the membership registration date field | The system should display the membership registration date and it should match the member record for the signed-in user | Pass | The membership registration date is displayed and it matches the member record for the signed-in user | #1 | Pass | The membership registration date is displayed and it matches the member record for the signed-in user | #4 | Pass |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4 | TC_004 | Verify member fullname appears in the greeting section | Dashboard | Personalized Greeting | 1. Locate the greeting line on the Dashboard
2. Compare the displayed name with the signed-in member profile name | The system should greet the member using the correct registered full name (fname+lname) | Pass | The member is greeted using the correct registered full name (fname+lname) | #1 | Pass | The member is greeted using the correct registered full name (fname+lname) | #4 | Pass |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 5 | TC_005 | Verify member name appears in the member information panel | Dashboard | Member Information Panel | 1. Locate the member information panel on the Dashboard
2. Read the name line in that panel | The system should display the member name consistent with the signed-in account | Pass | The member name is displayed consistent with the signed-in account | #1 | Pass | The member name is displayed consistent with the signed-in account | #4 | Pass |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 6 | TC_006 | Verify registered email address is displayed in the member information panel | Dashboard | Member Information Panel | 1. Locate the member information panel on the Dashboard
2. Read the email line in that panel | The system should display the registered email address for the signed-in member | Pass | The registered email address is displayed for the signed-in member | #1 | Pass | The registered email address is displayed for the signed-in member | #4 | Pass |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 7 | TC_007 | Verify Vehicle Registration card navigates to the vehicle registration flow or page | Dashboard | Card Navigation | 1. On the Dashboard locate the Vehicle Registration action card
2. Click the Vehicle Registration card or its primary clickable area
3. Observe the destination page title or route | The system should navigate to the vehicle registration destination without errors | Pass | Navigation to the vehicle registration destination occurs without errors | #1 | Pass | Navigation to the vehicle registration destination occurs without errors | #4 | Pass |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 8 | TC_008 | Verify Inquiry card navigates to the enquiry or contact flow | Dashboard | Card Navigation | 1. Navigate back to the Dashboard if the current page is not the Dashboard
2. On the Dashboard locate the Inquiry action card
3. Click the Inquiry card or its primary clickable area
4. Observe the destination page title or route | The system should navigate to the enquiry destination without errors | Pass | Navigation to the enquiry destination occurs without errors | #1 | Pass | Navigation to the enquiry destination occurs without errors | #4 | Pass |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 9 | TC_009 | Verify Account Settings card navigates to account settings | Dashboard | Card Navigation | 1. Navigate back to the Dashboard if the current page is not the Dashboard
2. On the Dashboard locate the Account Settings action card
3. Click the Account Settings card or its primary clickable area
4. Observe the destination page title or route | The system should navigate to the account settings area without errors | Pass | Navigation to the account settings area occurs without errors | #1 | Pass | Navigation to the account settings area occurs without errors | #4 | Pass |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 10 | TC_010 | Verify Account Settings button in the member information panel navigates to account settings | Dashboard | Sidebar Navigation | 1. Navigate back to the Dashboard if the current page is not the Dashboard
2. On the Dashboard locate the Account Settings button inside the member information panel
3. Click the Account Settings button
4. Observe the destination page title or route | The system should navigate to the account settings area without errors | Pass | Navigation to the account settings area occurs without errors | #1 | Pass | Navigation to the account settings area occurs without errors | #4 | Pass |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 11 | TC_011 | Verify Dashboard is not accessible without authentication when a session is absent | Dashboard | Access Control | 1. Ensure no active application session exists (signed out or private window)
2. Attempt to open the Dashboard using a direct Dashboard URL if known
3. Observe the response | - | The system should block access and should redirect or prompt for sign-in instead of showing member data | Pass | Access is blocked and redirection or a sign-in prompt is presented instead of member data being displayed | #1 | Pass | Access is blocked and redirection or a sign-in prompt is presented instead of member data being displayed | #4 | Pass |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |