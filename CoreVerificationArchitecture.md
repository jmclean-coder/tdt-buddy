# Core Verification Architecture

1.1 System Components
The verification system consists of four main components:

1. Airtable Database - Stores registration records with verification codes
2. Make.com Workflow - Generates and distributes verification codes
3. Discord Bot - Processes verification commands and assigns roles
4. User Interface - Commands and feedback for users during verification

Here's how these components interact:

```plaintext
[Registration Form] → [Stripe Payment] → [Airtable Record]
         ↓
[Make.com generates code] → [Email to attendee]
         ↓
[User joins Discord] → [Submits verification code] → [Bot checks Airtable]
         ↓
[Bot assigns roles] → [Bot updates Airtable] → [User gains access]
```

1.2 Data Flow Diagram

```plaintext
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│   Webflow     │     │    Stripe     │     │    Airtable   │
│  Registration ├────►│    Payment    ├────►│  Registration  │
│     Form      │     │   Processing  │     │    Record     │
└───────────────┘     └───────────────┘     └───────┬───────┘
                                                   │
                                                   ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│  Discord Bot  │◄────┤    User's     │◄────┤    Make.com   │
│  Verification │     │    Email      │     │   Workflow    │
│    Process    │     │  with Code    │     │               │
└───────┬───────┘     └───────────────┘     └───────────────┘
        │
        ▼
┌───────────────┐
│   Discord     │
│   Server      │
│   Access      │
└───────────────┘
```
