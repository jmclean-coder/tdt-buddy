# File structure

tdt-buddy/
├── wrangler.toml                # Cloudflare Workers configuration
├── .env                         # Local environment variables
├── package.json                 # Dependencies and scripts
├── README.md                    # Documentation
├── src/
│   ├── index.js                 # Main Workers entry point
│   ├── discord/                 # Discord API integration
│   │   ├── interactions.js      # Handle slash command interactions
│   │   ├── verification.js      # Verification logic
│   │   └── year-transition.js   # Year transition logic
│   ├── airtable/                # Airtable integration
│   │   ├── client.js            # Airtable API client
│   │   └── operations.js        # Airtable operations
│   ├── commands/                # Command definitions
│   │   ├── verification/        # Verification commands
│   │   │   ├── verify.js        # Verify command
│   │   │   └── help.js          # Verification help command
│   │   ├── admin/               # Admin commands
│   │   │   ├── createnewyear.js # Create new year command
│   │   │   └── archiveyear.js   # Archive year command
│   │   └── utility/             # Utility commands
│   │       └── listyears.js     # List years command
│   └── utils/                   # Utility functions
│       ├── permissions.js       # Permission checking
│       ├── responses.js         # Response formatting
│       └── logging.js           # Logging utilities
├── deploy/                      # Deployment scripts
│   └── register-commands.js     # Register Discord slash commands
└── test/                        # Tests
    └── interactions.test.js     # Test interaction handling

VERIFICATION BOT DEPLOYMENT
□ Register bot application in Discord Developer Portal
□ Set up hosting environment (VPS, Heroku, etc.)
□ Configure environment variables (.env file)
□ Install dependencies (Discord.js, Airtable, etc.)
□ Deploy bot to production environment
□ Check bot is online and commands are registered
□ Verify permissions in Discord server

MAKE.COM INTEGRATION
□ Create and test Make.com scenario
□ Connect to production Airtable base
□ Configure email template with correct branding
□ Set up error notifications
□ Activate scenario

DOCUMENTATION & TRAINING
□ Create user guide for verification process
□ Train staff on troubleshooting verification issues
□ Document admin commands for verification management
□ Create recovery procedures for system failures
