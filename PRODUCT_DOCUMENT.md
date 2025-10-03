# TestSpec Studio - Product Documentation

**Version:** 1.3.0
**Last Updated:** January 2025
**Document Type:** Product Feature Documentation

---

## Table of Contents

1. [Product Overview](#product-overview)
2. [Core Features](#core-features)
3. [User Roles & Permissions](#user-roles--permissions)
4. [Product Access Control](#product-access-control)
5. [Authentication System](#authentication-system)
6. [Test Generation Features](#test-generation-features)
7. [Admin Dashboard](#admin-dashboard)
8. [User Account Management](#user-account-management)
9. [Export & Download Features](#export--download-features)
10. [Technical Architecture](#technical-architecture)
11. [Security & Privacy](#security--privacy)

---

## Product Overview

TestSpec Studio is an AI-powered test case generation platform that transforms user stories and acceptance criteria into comprehensive, ready-to-use test suites. The platform combines artificial intelligence with professional testing frameworks to automate the creation of both manual test cases and automation test skeletons.

### Key Value Propositions

- **Time Savings**: Reduce test case creation time from hours to minutes
- **AI-Powered Intelligence**: Leverage Google Gemini AI for context-aware test generation
- **Framework Flexibility**: Support for Playwright, Jest, and other popular frameworks
- **Enterprise-Ready**: Built-in user management, authentication, and admin controls
- **Professional Exports**: Multiple export formats for seamless integration with existing workflows

---

## Core Features

### 1. AI-Powered Test Generation

**Description**: Transform natural language user stories into comprehensive test suites using Google Gemini AI.

**How It Works**:
- User inputs a user story or acceptance criteria
- Selects preferred automation framework (Playwright/Jest)
- AI analyzes the story and generates:
  - Manual test cases with step-by-step instructions
  - Automation test skeletons with proper structure
  - Edge cases and negative scenarios
  - Data validation tests

**Benefits**:
- Intelligent understanding of context and requirements
- Consistent test case format across the organization
- Coverage of positive, negative, and edge case scenarios
- Framework-specific code generation

**Free Tier Limits** (Google Gemini):
- 15 requests per minute
- 1 million tokens per minute
- 1,500 requests per day
- Completely FREE forever

---

### 2. Multi-Framework Support

**Supported Frameworks**:
- **Playwright**: Modern end-to-end testing framework
- **Jest**: JavaScript testing framework for unit and integration tests

**Framework-Specific Features**:
- Proper test structure and syntax
- Framework-specific assertions
- Best practices implementation
- Ready-to-run test skeletons

---

### 3. Test History & Tracking

**Description**: All generated tests are automatically saved to user's history with full tracking.

**Tracked Information**:
- User story/requirements input
- Selected framework
- Generated manual test cases
- Generated automation skeletons
- Timestamp of generation
- User who created the tests

**Features**:
- View past test generations
- Track testing activity over time
- Analyze testing patterns
- Audit trail for compliance

---

## User Roles & Permissions

### Regular User

**Capabilities**:
- Create account and authenticate
- Generate test cases from user stories
- View personal test history
- Export tests in multiple formats
- Manage personal account settings
- Track active sessions

**Restrictions**:
- Can only view own test history
- Cannot access other users' data
- No administrative capabilities

---

### Super Admin

**Capabilities**:
- **All Regular User capabilities**, plus:
- View all users in the system
- Search and filter users
- View detailed user statistics
- Ban/unban user accounts
- Reset user passwords
- Delete user data
- View all test history across users
- Track user sessions system-wide
- Access activity logs
- Enterprise-level controls

**Access**:
- Super Admin dashboard at `/admin`
- Requires `super_admin` role in database
- Protected by authentication and role checks

---

## Product Access Control

### Overview

TestSpec Studio includes granular product access control that allows administrators to enable or disable workspace access for individual users. This feature is essential for managing product licenses, trial periods, or restricting access to specific users.

### How It Works

**Access States**:
- **Enabled**: User can access the workspace and generate tests
- **Disabled**: User is redirected to Product Info page explaining features

**User Experience**:
- Users without access see a comprehensive product information page
- Page describes all features, use cases, and benefits
- Clear call-to-action to contact administrator for access
- Navigation shows "Get Access" instead of "Workspace" link

### Admin Controls

**Grant Access**:
- Click "✅ Grant Access" button in user details panel
- User immediately gains workspace access
- Action is logged in activity history
- User notification (if configured)

**Revoke Access**:
- Click "🔒 Revoke Access" button in user details panel
- User loses workspace access immediately
- Redirected to Product Info page on next workspace visit
- Action is logged with timestamp and admin ID

**Access Status Indicator**:
- Green badge: ✅ Product Access Enabled
- Orange badge: 🔒 Product Access Disabled
- Displayed prominently in user details panel
- Shows current access state and implications

### Product Info Page

**Features**:
- Complete product overview with benefits
- Feature grid showcasing capabilities
- Use case scenarios for different user types
- Step-by-step "How It Works" guide
- Key benefits highlighted
- Perfect for demos and onboarding

**Content Sections**:
1. **Hero Section**: Value proposition and main features
2. **Features Grid**: 6 key features with icons and descriptions
3. **Perfect For**: Target audience and use cases
4. **How It Works**: 4-step process explanation
5. **Key Benefits**: Bullet-point list of advantages
6. **CTA**: Call-to-action to request access

### Database Structure

**product_access Table**:
```sql
- user_id: UUID (unique, references auth.users)
- has_access: BOOLEAN (default false)
- granted_at: TIMESTAMP
- granted_by: UUID (admin who granted access)
- revoked_at: TIMESTAMP
- revoked_by: UUID (admin who revoked access)
- notes: TEXT (optional notes)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Use Cases

**Trial Management**:
- Grant temporary access to trial users
- Easily revoke when trial expires
- Track who has active access

**License Management**:
- Control seat allocation
- Manage paid vs free tiers
- Enforce user limits

**Selective Rollout**:
- Beta test with specific users
- Gradual feature rollout
- A/B testing capabilities

**Access Restriction**:
- Temporarily disable problematic users
- Seasonal access control
- Project-based access management

---

## Authentication System

### Supported Authentication Methods

#### 1. Email/Password Authentication
- Traditional username/password login
- Secure password hashing with bcrypt
- Password reset functionality
- Email verification support

#### 2. Google OAuth
- One-click Google sign-in
- No password management required
- Secure OAuth 2.0 implementation
- Automatic profile sync

#### 3. GitHub OAuth
- Developer-friendly authentication
- GitHub account integration
- Automatic profile creation
- OAuth 2.0 standard

### Security Features

- **Row Level Security (RLS)**: Database-level access control
- **Secure Sessions**: JWT-based session management
- **Session Tracking**: Monitor active user sessions
- **Device Information**: Track login devices
- **Password Reset**: Secure password recovery flow
- **Auto-logout**: Automatic session expiration

### User Profile Management

**Automatic Profile Creation**:
- Email synced from auth provider
- Creation timestamp
- Last sign-in tracking
- Provider information (email/google/github)

**Profile Data**:
- User ID (unique)
- Email address
- Created date
- Last sign-in date
- Authentication provider
- Ban status (if applicable)

---

## Test Generation Features

### Input Methods

**User Story Input**:
- Large text area for story/criteria
- Support for multi-line input
- Paste from external sources
- Clear and intuitive interface

**Framework Selection**:
- Dropdown selection
- Playwright or Jest options
- Framework-specific generation

### Generated Outputs

#### 1. Manual Test Cases

**Structure**:
- Test case ID and title
- Priority level (High/Medium/Low)
- Test steps with numbered sequence
- Expected results for each step
- Preconditions
- Test data requirements

**Format**:
- Clean, professional presentation
- Easy to read and follow
- Ready for test management tools
- Print-friendly layout

#### 2. Automation Test Skeletons

**Features**:
- Framework-specific syntax
- Proper test structure
- Setup and teardown code
- Assertion examples
- Comments and documentation
- Best practices implementation

**Code Quality**:
- Syntax highlighted display
- Copy-to-clipboard functionality
- Ready to run with minimal changes
- Professional formatting

#### 3. Preview & Review

**Tabs Interface**:
- **Manual Test Cases Tab**: View all generated test scenarios
- **Automation Skeletons Tab**: See automation code
- **Preview Bundle Tab**: Preview exports before download

**Review Features**:
- Side-by-side comparison
- Easy navigation between sections
- Responsive design for mobile/desktop

---

## Admin Dashboard

### Overview Statistics

**Dashboard Metrics**:
- **Total Users**: Count of registered users
- **Total Tests Generated**: System-wide test count
- **Active Sessions**: Current active user sessions

**Visual Design**:
- Modern card-based layout
- Real-time data updates
- Neon-themed UI with purple accents
- Professional enterprise appearance

---

### User Management

#### User List Panel

**Features**:
- Search by email or user ID
- Filter by status (All/Active/Banned)
- Real-time search results
- User details preview

**Displayed Information**:
- User email (prominent display)
- User ID (truncated for readability)
- Test count
- Session count
- Ban status indicator (🚫 for banned users)

**Interactions**:
- Click user to view details
- Highlighted selection
- Smooth transitions

---

#### User Details Panel

**Information Displayed**:
- Full user ID
- Email address
- Account creation date
- Last sign-in date
- Authentication provider
- Test generation statistics
- Active sessions count
- Ban status and reason (if applicable)

**Action Buttons**:

1. **Ban User** (Red button)
   - Prompt for ban reason
   - Immediate effect
   - Logged in activity log
   - Prevents user access

2. **Unban User** (Green button)
   - Confirmation required
   - Restores user access
   - Logged in activity log

3. **Reset Password** (Yellow button)
   - Records reset request
   - User notified to use "Forgot Password"
   - Logged in activity log

4. **Delete All User Data** (Dark Red button)
   - Confirmation required
   - Deletes: test history, sessions, ban records
   - Logged in activity log with details
   - **Irreversible action**

---

#### User Activity Tabs

**1. Test History Tab**
- Shows all tests generated by user
- User story preview (truncated)
- Framework used
- Test count per generation
- Timestamp
- Scrollable list (max 400px)

**2. Sessions Tab**
- Active user sessions
- Device information
- Last active timestamp
- Session creation date
- Helps identify suspicious activity

**3. Activity Logs Tab** (NEW)
- All admin actions performed on user
- Action types: BAN_USER, UNBAN_USER, PASSWORD_RESET, DELETE_USER_DATA
- Timestamps
- Reason for action (if provided)
- Full audit trail

---

### Search & Filter Features

**Search Functionality**:
- Search by email address
- Search by user ID
- Case-insensitive matching
- Real-time results (debounced)
- ILIKE SQL query for partial matches

**Filter Options**:
- **All Users**: Show everyone
- **Active Only**: Exclude banned users
- **Banned Only**: Show only banned users

**Performance**:
- Server-side filtering
- Optimized queries
- Fast response times
- Handles large user bases

---

### Activity Logging System

**Logged Actions**:
- User bans (with reason)
- User unbans
- Password resets
- User data deletions

**Log Data Structure**:
- Admin ID (who performed action)
- Action type
- Target user ID
- Timestamp
- Details (JSON): reason, deleted tables, etc.

**Benefits**:
- Complete audit trail
- Compliance and accountability
- Troubleshooting capabilities
- Security monitoring

---

## User Account Management

### Account Page Features

**Profile Information**:
- Email address display
- Account creation date
- Last sign-in timestamp
- Authentication provider

**Security Settings**:
- Change password (email users)
- View active sessions
- Sign out from all devices
- Delete account option

**Test History**:
- View all generated tests
- Filter by date/framework
- Export personal data
- Statistics and insights

---

## Export & Download Features

### Export Formats

#### 1. CSV Export
**Use Case**: Import into test management tools (Jira, TestRail, etc.)

**Structure**:
- Test ID column
- Title column
- Priority column
- Steps column (comma-separated)
- Expected Results column

**Benefits**:
- Spreadsheet compatible
- Easy data manipulation
- Tool integration ready

#### 2. Markdown Export
**Use Case**: Documentation and version control

**Structure**:
- Formatted headings
- Numbered steps
- Code blocks for automation
- Clean, readable format

**Benefits**:
- GitHub/GitLab compatible
- Version control friendly
- Human-readable

#### 3. ZIP Bundle
**Use Case**: Complete package with all formats

**Contents**:
- manual-tests.md
- automation-tests.md
- tests.csv
- README.md

**Benefits**:
- One-click download
- All formats included
- Project-ready structure

---

## Technical Architecture

### Frontend Stack

**Framework**: React 18
- Modern hooks-based architecture
- Functional components
- Context API for state management

**Styling**: TailwindCSS
- Utility-first CSS
- Custom neon theme
- Responsive design
- Dark mode optimized

**Build Tool**: Vite
- Fast development server
- Hot module replacement
- Optimized production builds

**Routing**: React Router v6
- Client-side routing
- Protected routes
- Navigation guards

---

### Backend Stack

**Platform**: Netlify Functions (Serverless)
- Automatic scaling
- No server management
- Cost-effective

**API Framework**: Node.js
- Express-like routing
- JSON API responses
- Error handling middleware

**AI Integration**: Google Gemini 1.5 Flash
- Free tier access
- High rate limits
- Advanced language understanding

---

### Database

**Provider**: Supabase
- PostgreSQL database
- Real-time capabilities
- Built-in authentication
- Row Level Security (RLS)

**Tables**:
1. **auth.users**: User authentication (managed by Supabase)
2. **user_profiles**: User email and metadata sync
3. **test_history**: All generated tests
4. **user_sessions**: Active session tracking
5. **admin_users**: Super admin role assignments
6. **banned_users**: Banned user records
7. **admin_password_resets**: Password reset tracking
8. **admin_activity_log**: Admin action audit trail

**Security**:
- Row Level Security policies
- Encrypted connections
- Secure API keys
- Role-based access control

---

### API Endpoints

#### POST /api/generate-tests
**Purpose**: Generate test cases from user story

**Request**:
```json
{
  "story": "As a user, I want to...",
  "framework": "playwright"
}
```

**Response**:
```json
{
  "manualTests": [...],
  "automationSkeletons": "...",
  "framework": "playwright",
  "exports": {
    "markdown": "...",
    "csv": "..."
  }
}
```

#### POST /api/save-history
**Purpose**: Save generated tests to user history

**Authentication**: Required

---

## Security & Privacy

### Data Protection

**Encryption**:
- All data encrypted in transit (HTTPS)
- Database encryption at rest
- Secure API communication

**Privacy**:
- Users can only access own data
- Admin actions logged
- GDPR-compliant data deletion
- No data sold to third parties

### Access Control

**Authentication Required**:
- Test generation
- Test history access
- Account settings
- Admin dashboard

**Role-Based Access**:
- Regular users: Limited to own data
- Super admins: System-wide access with logging

### Compliance

**Audit Trail**:
- All admin actions logged
- Timestamps recorded
- Action details preserved
- Queryable history

**Data Retention**:
- User controls own data
- Account deletion available
- Test history exportable
- No unnecessary data retention

---

## Recent Updates

### v1.3.0 (January 2025) - Product Access Control

**New Features**:
1. ✅ **Product Access Control System**
   - Admin can grant/revoke workspace access per user
   - Granular control over who can use the product
   - Perfect for trials, licenses, and staged rollouts

2. ✅ **Product Info Page**
   - Comprehensive product information for users without access
   - Feature showcase and use cases
   - Clear call-to-action to request access

3. ✅ **Access Management UI**
   - Visual access status indicators (enabled/disabled)
   - One-click grant/revoke buttons in admin panel
   - Real-time access control enforcement

4. ✅ **Smart Navigation**
   - "Workspace" link for users with access
   - "Get Access" link for users without access
   - Automatic redirection to product info page

**Database Changes**:
- Added `product_access` table
- Tracks access grants/revokes with timestamps
- Records which admin performed actions
- Optimized indexes for fast lookups

**Admin Enhancements**:
- New access control buttons in user details
- Access status badge with color coding
- Activity logging for GRANT_ACCESS and REVOKE_ACCESS
- Integrated into existing admin workflow

---

### v1.2.0 (January 2025) - Enterprise Admin Features

**New Features**:
1. ✅ User search functionality (by email and user ID)
2. ✅ Advanced filters (All/Active/Banned users)
3. ✅ Email display in user lists
4. ✅ Activity logging for all admin actions
5. ✅ Activity Logs tab in user details
6. ✅ Enhanced user statistics (test count, session count)

**Improvements**:
- More professional admin UI
- Better search performance
- Real-time filtering
- Comprehensive audit trail
- Enterprise-level controls

**Technical Changes**:
- Enhanced `getUsersDetailed()` function with filters
- Activity logging infrastructure
- User profiles table with auto-sync trigger
- Optimized database queries

---

## Roadmap & Future Enhancements

### Planned Features

**Short Term**:
- Bulk user actions (select multiple users)
- CSV export of user data
- Advanced analytics dashboard
- Email notifications for admin actions

**Medium Term**:
- Cypress framework support
- Selenium WebDriver support
- Custom test templates
- Team collaboration features
- API key management for users

**Long Term**:
- Integration with CI/CD pipelines
- Test execution tracking
- Test case versioning
- Multi-language support
- White-label options

---

## Support & Contact

**Documentation**: See README.md for setup instructions

**Issues**: Report bugs via GitHub Issues

**Feature Requests**: Submit via GitHub Discussions

**Security Issues**: Contact maintainer directly

---

## Changelog

### v1.2.0 (January 2025)
- Added enterprise admin features
- User search and filtering
- Activity logging system
- Enhanced user management UI

### v1.1.0 (December 2024)
- Super admin dashboard
- User ban/unban functionality
- Password reset management
- Session tracking

### v1.0.0 (November 2024)
- Initial release
- AI-powered test generation
- Multi-framework support
- Authentication system
- Export functionality

---

**Document End**

*This document is automatically maintained and updated with each feature release.*
