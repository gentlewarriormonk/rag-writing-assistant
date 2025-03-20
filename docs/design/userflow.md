# User Flow Diagrams

## Authentication Flows

### Registration Flow

```mermaid
flowchart TD
    A[User Visits Site] --> B[Clicks Sign Up]
    B --> C[Fills Registration Form]
    C --> D{Form Valid?}
    D -->|No| E[Display Validation Errors]
    E --> C
    D -->|Yes| F[Submit Registration]
    F --> G{Registration Successful?}
    G -->|No| H[Display Error Message]
    H --> C
    G -->|Yes| I[Send Verification Email]
    I --> J[Show Success Message]
    J --> K[User Checks Email]
    K --> L[User Clicks Verification Link]
    L --> M[Account Verified]
    M --> N[Redirect to Login]
```

### Login Flow

```mermaid
flowchart TD
    A[User Visits Site] --> B[Clicks Login]
    B --> C[Enters Credentials]
    C --> D{Remember Me?}
    D -->|Yes| E[Set Extended Token Expiry]
    D -->|No| F[Set Standard Token Expiry]
    E --> G[Submit Login]
    F --> G
    G --> H{Login Successful?}
    H -->|No| I[Display Error Message]
    I --> C
    H -->|Yes| J[Store Auth Tokens]
    J --> K{Redirect URL exists?}
    K -->|Yes| L[Redirect to Original Destination]
    K -->|No| M[Redirect to Dashboard]
```

### Password Reset Flow

```mermaid
flowchart TD
    A[User Visits Login Page] --> B[Clicks Forgot Password]
    B --> C[Enters Email Address]
    C --> D[Submit Request]
    D --> E{Email Found?}
    E -->|No| F[Show Generic Success Message]
    E -->|Yes| G[Send Reset Email]
    G --> F
    F --> H[User Checks Email]
    H --> I[User Clicks Reset Link]
    I --> J[Show Reset Password Form]
    J --> K[User Enters New Password]
    K --> L{Password Valid?}
    L -->|No| M[Show Validation Errors]
    M --> K
    L -->|Yes| N[Submit New Password]
    N --> O[Show Success Message]
    O --> P[Redirect to Login]
```

## Core Application Flows

### Dashboard Navigation Flow

```mermaid
flowchart TD
    A[User Logs In] --> B[Load Dashboard]
    B --> C[Display Overview Metrics]
    B --> D[Load Sidebar Navigation]
    D --> E{User Selects Section}
    E -->|Profile| F[Load Profile Page]
    E -->|Settings| G[Load Settings Page]
    E -->|Content| H[Load Content Section]
    E -->|Logout| I[Confirm Logout]
    I -->|Cancel| B
    I -->|Confirm| J[Clear Auth Tokens]
    J --> K[Redirect to Login Page]
```

### Profile Update Flow

```mermaid
flowchart TD
    A[User Navigates to Profile] --> B[Display Current Profile]
    B --> C[User Edits Profile Information]
    C --> D[User Submits Changes]
    D --> E{Validation Passes?}
    E -->|No| F[Show Validation Errors]
    F --> C
    E -->|Yes| G[Send Update Request]
    G --> H{Update Successful?}
    H -->|No| I[Show Error Message]
    H -->|Yes| J[Show Success Message]
    J --> K[Refresh Profile Data]
```

### Content Creation Flow

```mermaid
flowchart TD
    A[User Navigates to Content Section] --> B[User Clicks Create New]
    B --> C[Display Creation Form]
    C --> D[User Fills Form]
    D --> E[User Submits Form]
    E --> F{Validation Passes?}
    F -->|No| G[Show Validation Errors]
    G --> D
    F -->|Yes| H[Submit to API]
    H --> I{Submission Successful?}
    I -->|No| J[Show Error Message]
    J --> D
    I -->|Yes| K[Show Success Message]
    K --> L[Redirect to Content List]
```

## Error Handling Flows

### Network Error Flow

```mermaid
flowchart TD
    A[User Action Requires API] --> B[Send API Request]
    B --> C{Connection Available?}
    C -->|Yes| D{Server Responds?}
    C -->|No| E[Show Offline Message]
    E --> F[Store Action for Retry]
    D -->|Yes| G[Process Response]
    D -->|No| H[Show Server Error]
    H --> I[Option to Retry]
    I -->|Retry| B
    I -->|Cancel| J[Return to Previous State]
```

### Authentication Error Flow

```mermaid
flowchart TD
    A[User Action Requires Auth] --> B[Check Token]
    B --> C{Token Valid?}
    C -->|Yes| D[Proceed with Action]
    C -->|No| E[Attempt Token Refresh]
    E --> F{Refresh Successful?}
    F -->|Yes| D
    F -->|No| G[Clear Auth State]
    G --> H[Show Session Expired Message]
    H --> I[Redirect to Login]
    I --> J[Store Return URL]
```

### Form Submission Error Flow

```mermaid
flowchart TD
    A[User Submits Form] --> B[Client-side Validation]
    B --> C{Validation Passes?}
    C -->|No| D[Mark Invalid Fields]
    D --> E[Show Inline Errors]
    E --> F[Focus First Error]
    F --> G[User Corrects Errors]
    G --> A
    C -->|Yes| H[Submit to API]
    H --> I{API Validation Passes?}
    I -->|No| J[Process API Validation Errors]
    J --> D
    I -->|Yes| K[Complete Action]
```

## Mobile-Specific Flows

### Mobile Navigation Flow

```mermaid
flowchart TD
    A[User on Mobile Device] --> B[Display Hamburger Menu]
    B --> C[User Taps Hamburger]
    C --> D[Open Slide-out Menu]
    D --> E[User Selects Menu Item]
    E --> F[Close Menu]
    F --> G[Navigate to Selected Section]
```

### Mobile Form Interaction Flow

```mermaid
flowchart TD
    A[User on Mobile Form] --> B[Tap Input Field]
    B --> C[Virtual Keyboard Opens]
    C --> D[User Enters Data]
    D --> E[User Taps Next/Done]
    E --> F{Last Field?}
    F -->|No| G[Focus Next Field]
    G --> D
    F -->|Yes| H[Close Keyboard]
    H --> I[Show Submit Button]
```

## Implementation Notes

1. These flow diagrams should be referenced when implementing each feature.
2. Error handling should follow the patterns outlined in the error flows.
3. Mobile interactions require special attention to keyboard behavior and touch targets.
4. Authentication state should be checked before rendering protected routes.
5. Form validation should happen both client-side and server-side.
