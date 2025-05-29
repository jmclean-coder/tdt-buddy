# Detailed Verification Flow

The verification process follows these specific steps:

1. Command Initiation:
   * User types /verify [code] with their unique code
   * Bot acknowledges the command with a private (ephemeral) message

2. Code Validation:

   * Bot searches Airtable for matching verification code
   * Checks if code has already been used
   * Verifies payment status is complete

3. Role Assignment:

    * Assigns year-specific attendee role (e.g., 2025-Attendee)
    * Assigns Verified Member base role
    * Assigns any additional roles based on Airtable flags:

      * Staff role if Is Staff is true
      * Volunteer role if Is Volunteer is true
      * DJ role if Is DJ is true

4. Database Update:

   * Updates Airtable record with:
      * Discord User ID
      * Discord Username
      * Verification status and timestamp
      * List of assigned roles

5. Success Notification:

    * Sends personalized success message to user
    * Lists all assigned roles
    * Provides next steps and channel recommendations

6. Admin Logging:

    * Logs successful verification to admin channel
    * Includes user details and assigned roles

## Error Handling

The verification system includes comprehensive error handling:

1. Invalid Codes:

    * If no matching code exists in Airtable
    * Clear error message with recommendation to use /verification-help

2. Already Used Codes:

    * If code has already been used for verification
    * Directs user to contact staff if they believe this is an error

3. Payment Issues:

    * If payment status is not "Completed"
    * Prompts user to complete payment before verifying

4. Missing Roles/Permissions:

      * If bot cannot assign roles due to permission issues
      * Provides information about which roles could not be assigned

5. Server Issues:

      * Graceful handling of API failures or timeouts
      * Informative messages to contact staff for manual verification

### Make.com Integration for Verification Codes

To complete the verification system, you'll need to set up an automation workflow in Make.com:
3.1 Make.com Verification Workflow

```plaintext
Make.com Scenario
TRIGGER: New/Updated Record in Airtable
└── Filter: Payment Status = "Completed" AND Verification Code is empty
    └── Generate Random Alphanumeric Code (8-16 characters)
        └── Update Airtable Record with Verification Code
            └── Create Email with Discord Invitation Link + Code
                └── Send Email to Registrant
                    └── Log Action in "Communication Log" Table
```

1. Create a new scenario in Make.com
2. Add Airtable trigger watching for new records in your Registrations table
3. Add a filter to only process records with completed payments and no verification code
4. Add a "Set variable" module to generate a random verification code:

`{{toUpper(randomString(10, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"))}}`

5. Add Airtable update module to save the verification code to the record
6. Add email module configured with your event's email template (check how we send emails)
7. Add final Airtable module to log the communication

# (USER FACING)How to Join Our Discord Community

After registering for the Dance & Camping Event, follow these steps to join our Discord community:

## Step 1: Join the Discord Server

Click the invitation link sent to your email after registration.

## Step 2: Verify Your Registration

Once in the server, you'll only see a few channels. To access all event channels:

1. Type `/verify` in any channel
2. Enter your unique verification code from your registration email
3. Press Enter to submit

## Step 3: Access Granted

After successful verification:

* You'll receive the appropriate roles
* All relevant channels will become visible
* You'll get a confirmation message with next steps

## Need Help?

If you have trouble verifying:

* Use the `/verification-help` command for guidance
* Check your email for the correct verification code
* Ensure your payment is complete
* Ask for help in the #verification-help channel

Remember, your verification code is unique to you and can only be used once.
