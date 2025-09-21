# Requirements Document

## Introduction

This document outlines the requirements for a React Native/Expo iOS application that serves as a work efficiency prompt stock management system. The app is specifically designed for users who want to efficiently store, organize, and quickly access AI prompts that enhance their daily work tasks. The application focuses on simplicity and speed, allowing users to build a personal library of proven prompts for various work scenarios such as email creation, meeting minutes summarization, document summarization, and social media planning.

## Requirements

### Requirement 1

**User Story:** As a user, I want to create and save work-related prompts with clear titles and descriptions, so that I can build a personal library of effective AI prompts for my daily tasks.

#### Acceptance Criteria

1. WHEN the user creates a new prompt THEN the system SHALL require a descriptive title and prompt content
2. WHEN the user saves a prompt THEN the system SHALL store the prompt with title, content, category, and creation date
3. WHEN the user views saved prompts THEN the system SHALL display prompts in a clean, scannable list format
4. IF the user attempts to save a prompt without title or content THEN the system SHALL display validation errors
5. WHEN the user saves a prompt THEN the system SHALL automatically suggest relevant categories based on content keywords

### Requirement 2

**User Story:** As a user, I want to organize prompts by work function categories, so that I can quickly locate the right prompt for specific work scenarios.

#### Acceptance Criteria

1. WHEN the user creates a prompt THEN the system SHALL provide predefined work categories (E メール作成, 議事録要約, 文書要約, SNS 企画生成, 集計, 翻訳)
2. WHEN the user views the home screen THEN the system SHALL display category tiles with prompt counts
3. WHEN the user creates a custom category THEN the system SHALL allow naming and color selection for easy identification
4. WHEN the user selects a category THEN the system SHALL show all prompts in that category sorted by most recently used
5. WHEN the user assigns a prompt to a category THEN the system SHALL update the category's prompt count immediately

### Requirement 3

**User Story:** As a user, I want to use proven work prompt templates, so that I can quickly create effective prompts without starting from scratch.

#### Acceptance Criteria

1. WHEN the user creates a new prompt THEN the system SHALL offer work-focused templates (Professional Email, Meeting Minutes, Document Summary, Social Media Post, Data Report, Translation Request, etc.)
2. WHEN the user selects a template THEN the system SHALL populate the form with structured content including placeholders like [TOPIC], [DEADLINE], [STAKEHOLDERS]
3. WHEN the user uses a template THEN the system SHALL provide guidance text explaining how to customize each section
4. WHEN the user saves a customized template THEN the system SHALL offer to save it as a new personal template
5. WHEN templates are displayed THEN the system SHALL show preview text and expected use cases

### Requirement 4

**User Story:** As a user, I want to create custom prompts for unique work situations, so that I can capture and reuse specialized prompts that work well for my specific tasks or projects.

#### Acceptance Criteria

1. WHEN the user chooses custom creation THEN the system SHALL provide a rich text input with formatting options
2. WHEN the user types in custom mode THEN the system SHALL support multi-line text with bullet points and basic formatting
3. WHEN the user saves a custom prompt THEN the system SHALL allow tagging with keywords for better searchability
4. WHEN the user creates a custom prompt THEN the system SHALL suggest similar existing prompts to avoid duplication
5. WHEN the user switches between template and custom modes THEN the system SHALL preserve entered content and warn before discarding changes

### Requirement 5

**User Story:** As a user, I want to quickly copy and use my stored prompts in various AI tools, so that I can maintain consistent quality in my AI-assisted work without retyping.

#### Acceptance Criteria

1. WHEN the user taps a saved prompt THEN the system SHALL immediately copy it to clipboard and show a brief success animation
2. WHEN the prompt is copied THEN the system SHALL track usage frequency for "Most Used" sorting
3. WHEN the user copies a prompt THEN the system SHALL copy clean text optimized for AI chat interfaces
4. WHEN a prompt contains placeholders THEN the system SHALL highlight unfilled placeholders before copying
5. WHEN the user copies a prompt THEN the system SHALL provide a quick "Edit & Copy" option for one-time modifications

### Requirement 6

**User Story:** As a busy user, I want to access my most-used prompts through an iOS widget, so that I can quickly grab prompts while working in other apps without interrupting my workflow.

#### Acceptance Criteria

1. WHEN the user adds the widget to their home screen THEN the system SHALL display the top 3-6 most frequently used prompts
2. WHEN the user taps a prompt in the widget THEN the system SHALL copy it to clipboard and show a subtle confirmation
3. WHEN the widget is displayed THEN the system SHALL show prompt titles truncated to fit widget size with category color coding
4. WHEN the user long-presses the widget THEN the system SHALL provide options to refresh content or configure displayed prompts
5. WHEN prompts are updated in the main app THEN the widget SHALL reflect changes within 5 minutes
6. WHEN the widget shows prompts THEN the system SHALL prioritize recently used and favorited prompts

### Requirement 7

**User Story:** As a user, I want to refine and organize my prompt library over time, so that I can keep my most effective prompts updated and remove outdated ones.

#### Acceptance Criteria

1. WHEN the user long-presses a prompt THEN the system SHALL show options for Edit, Duplicate, Favorite, Move to Category, and Delete
2. WHEN the user edits a prompt THEN the system SHALL maintain version history and allow reverting to previous versions
3. WHEN the user deletes a prompt THEN the system SHALL show confirmation with prompt title and offer "Move to Archive" as an alternative
4. WHEN the user favorites a prompt THEN the system SHALL add it to a "Favorites" quick-access section
5. WHEN a prompt is modified THEN the system SHALL update the "Last Modified" timestamp and sync to widget if applicable
6. WHEN the user duplicates a prompt THEN the system SHALL create a copy with "(Copy)" suffix for easy customization

### Requirement 8

**User Story:** As a user using iOS devices, I want the app to integrate seamlessly with my Apple workflow, so that I can use it efficiently across iPhone and iPad during different work scenarios.

#### Acceptance Criteria

1. WHEN the app runs on iOS THEN the system SHALL support iOS 15.0 and later with optimized performance for business use
2. WHEN the app runs on iPad THEN the system SHALL provide a multi-column layout for better productivity
3. WHEN the app uses clipboard THEN the system SHALL integrate with iOS Universal Clipboard for cross-device access
4. WHEN the app stores data THEN the system SHALL use iOS Keychain for sensitive data and local storage for prompts
5. WHEN the app is used with external keyboards THEN the system SHALL support keyboard shortcuts for common actions
6. WHEN the app integrates with iOS THEN the system SHALL support Siri Shortcuts for voice-activated prompt access

### Requirement 9

**User Story:** As a user handling sensitive information, I want my prompts stored securely on my device only, so that I can maintain confidentiality and access my prompts even without internet connection.

#### Acceptance Criteria

1. WHEN prompt data is saved THEN the system SHALL encrypt and store it locally using iOS secure storage mechanisms
2. WHEN the app is used offline THEN the system SHALL provide full functionality including search, edit, and copy operations
3. WHEN sensitive business prompts are stored THEN the system SHALL NOT transmit any data to external servers or analytics services
4. WHEN device storage is low THEN the system SHALL provide storage usage statistics and archive options for old prompts
5. WHEN the user wants data portability THEN the system SHALL provide secure export/import functionality for backup purposes
6. WHEN the app is deleted THEN the system SHALL securely wipe all stored prompt data and notify the user about backup options

### Requirement 10

**User Story:** As a user, I want to search and filter my prompt library efficiently, so that I can quickly find the right prompt even when I have hundreds of stored prompts.

#### Acceptance Criteria

1. WHEN the user types in the search bar THEN the system SHALL search prompt titles, content, and tags in real-time
2. WHEN search results are displayed THEN the system SHALL highlight matching keywords and show relevance ranking
3. WHEN the user applies filters THEN the system SHALL allow filtering by category, date created, usage frequency, and favorites
4. WHEN the user searches frequently THEN the system SHALL remember recent searches and suggest them
5. WHEN no search results are found THEN the system SHALL suggest similar prompts or offer to create a new prompt
6. WHEN the user uses advanced search THEN the system SHALL support boolean operators and exact phrase matching

### Requirement 11

**User Story:** As a developer, I want to develop and test the application using ExpoGo during development, so that I can ensure rapid iteration while planning for native features in production builds.

#### Acceptance Criteria

1. WHEN the application is developed THEN the system SHALL maintain compatibility with ExpoGo for core functionality testing
2. WHEN running on ExpoGo THEN the system SHALL provide full prompt management, search, and clipboard functionality
3. WHEN tested on ExpoGo THEN the system SHALL simulate widget functionality with in-app alternatives for development
4. WHEN iOS-specific features are needed THEN the system SHALL clearly separate ExpoGo-compatible features from native-only features
5. WHEN preparing for production THEN the system SHALL provide clear documentation for transitioning from ExpoGo to native builds
6. WHEN development features differ from production THEN the system SHALL provide feature flags to toggle between development and production modes

### Req

uirement 12

**User Story:** As a user, I want to track the effectiveness of my prompts, so that I can identify which prompts deliver the best results and optimize my AI workflow.

#### Acceptance Criteria

1. WHEN the user copies a prompt THEN the system SHALL track usage frequency and timestamp
2. WHEN the user views prompt statistics THEN the system SHALL display usage count, last used date, and effectiveness rating
3. WHEN the user rates a prompt's effectiveness THEN the system SHALL store the rating and use it for recommendations
4. WHEN viewing prompt lists THEN the system SHALL provide sorting options by usage frequency, effectiveness, and recency
5. WHEN the user has many prompts THEN the system SHALL suggest archiving unused prompts older than 90 days
6. WHEN generating usage reports THEN the system SHALL provide weekly/monthly summaries of most effective prompts

### Requirement 13

**User Story:** As a user working in teams, I want to export and share selected prompts with colleagues, so that we can standardize effective prompts across our team while maintaining individual privacy.

#### Acceptance Criteria

1. WHEN the user selects prompts for sharing THEN the system SHALL create a shareable export file without personal metadata
2. WHEN exporting prompts THEN the system SHALL allow selection of specific prompts or entire categories
3. WHEN importing shared prompts THEN the system SHALL prevent duplicates and allow preview before adding
4. WHEN sharing prompts THEN the system SHALL remove any personal information or sensitive placeholders
5. WHEN importing prompts THEN the system SHALL allow customization of categories and tags during import
6. WHEN exporting prompts THEN the system SHALL support standard formats (JSON, CSV) for compatibility with other tools### Req
   uirement 14

**User Story:** As a user, I want the app to have a professional and calming blue-themed visual design, so that I can use it comfortably during long work sessions and it fits well with professional work environments.

#### Acceptance Criteria

1. WHEN the app is launched THEN the system SHALL use a blue-based color scheme as the primary theme
2. WHEN displaying categories THEN the system SHALL use different shades of blue for visual hierarchy and organization
3. WHEN showing interactive elements THEN the system SHALL use blue tones for buttons, links, and active states
4. WHEN the user views the interface THEN the system SHALL maintain good contrast ratios with blue backgrounds for accessibility
5. WHEN displaying prompts and content THEN the system SHALL use blue accents while keeping text highly readable
6. WHEN the widget is displayed THEN the system SHALL maintain the blue theme consistency across the widget interface
