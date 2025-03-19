# User Flow Diagram

```mermaid
flowchart TD
    Start([User Access]) --> IsAuth{Authenticated?}
    
    IsAuth -->|No| Auth[Sign In/Register]
    Auth --> SuccessAuth{Auth Success?}
    SuccessAuth -->|No| Auth
    SuccessAuth -->|Yes| Dashboard
    
    IsAuth -->|Yes| Dashboard[User Dashboard]
    
    Dashboard --> CM[Corpus Management]
    Dashboard --> CG[Content Generation]
    Dashboard --> UserSettings[User Settings]
    Dashboard --> Analytics[Usage Analytics]
    
    CM --> UploadFiles[Upload Text Files]
    UploadFiles --> ProcessingStart[Processing Starts]
    ProcessingStart --> ProcessingComplete[Processing Complete]
    ProcessingComplete --> CorpusReady[Corpus Ready]
    
    CM --> ManageFiles[Manage Existing Files]
    ManageFiles --> DeleteFile[Delete File]
    ManageFiles --> ViewFile[View File]
    ManageFiles --> Reprocess[Reprocess Corpus]
    Reprocess --> ProcessingStart
    
    CG --> EnterPrompt[Enter Request]
    EnterPrompt --> SelectStyle[Select Style Adjustments]
    SelectStyle --> GenerateContent[Generate Content]
    GenerateContent --> ReviewContent[Review Generated Content]
    ReviewContent --> Regenerate[Regenerate]
    Regenerate --> EnterPrompt
    ReviewContent --> SaveContent[Save Content]
    ReviewContent --> ExportContent[Export Content]
    
    UserSettings --> ManageAccount[Manage Account]
    UserSettings --> ManageAPIKeys[Manage API Keys]
    UserSettings --> ManageSubscription[Manage Subscription]
    
    Analytics --> CorpusStats[View Corpus Statistics]
    Analytics --> UsageStats[View Usage Statistics]
    
    subgraph "User Authentication"
        Auth
        SuccessAuth
    end
    
    subgraph "Corpus Management"
        CM
        UploadFiles
        ProcessingStart
        ProcessingComplete
        CorpusReady
        ManageFiles
        DeleteFile
        ViewFile
        Reprocess
    end
    
    subgraph "Content Generation"
        CG
        EnterPrompt
        SelectStyle
        GenerateContent
        ReviewContent
        Regenerate
        SaveContent
        ExportContent
    end
    
    subgraph "User Management"
        UserSettings
        ManageAccount
        ManageAPIKeys
        ManageSubscription
    end
    
    subgraph "Analytics"
        Analytics
        CorpusStats
        UsageStats
    end
