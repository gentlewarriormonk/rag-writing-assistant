# Development Guidelines for Kaku AI Writing Assistant

## Scope Management & Change Approach

### 1. Strictly Adhere to Change Scope
- Each change must be clearly defined with specific boundaries
- Changes should be atomic and focused on a single concern
- When a request is made (e.g., "remove an icon"), limit work to exactly that task
- Never extend changes to adjacent components without explicit approval

### 2. Backup Strategy
- Create a backup of any file before making significant changes
- For critical components, use descriptive backup naming (e.g., `component_name_pre_feature.tsx`)
- When experimenting with risky changes, work in a feature branch
- Document backup locations in commit messages or PR descriptions

### 3. Incremental Change Verification
- Make one small, logical change at a time
- Build and test the application after each significant change
- If a change breaks functionality, immediately revert rather than layering fixes
- Establish checkpoints for larger changes where verification occurs

### 4. Component Dependencies Management
- Map dependencies before modifying shared components
- When changing an interface, identify all consumers of that interface
- Be especially careful with:
  - Context providers/consumers
  - Animation libraries (framer-motion)
  - Component props structures 
  - External library integrations

### 5. Reversion Protocol
- When multiple issues arise, revert to a known working state
- Prefer complete reverts over partial fixes for complex problems
- Always have a clear path back to stability
- Document what changes were reverted and why

### 6. Technical Implementation Guidelines

#### UI Component Modifications
- Preserve existing styling patterns and class structures
- Maintain consistent naming conventions
- Test responsive behavior after changes
- Verify animations and transitions still work correctly

#### Third-Party Library Usage
- Verify library versions before assuming API availability
- Test library functions in isolation before integrating
- Consider fallbacks for complex library features (e.g., CSS for animations)
- Document any workarounds needed for library integration

#### State Management
- Be mindful of state sharing across components
- When modifying state, verify all consumers still function
- Test edge cases when changing stateful components
- Maintain existing state initialization patterns

## Effective Development Workflow

### 1. Pre-Change Analysis
- Understand the full component structure before modifying
- Document the current behavior and expected changes
- Identify potential side effects of the change
- Create a change plan with verification steps

### 2. Debugging Approach
- Isolate problems methodically
- Work from most likely to least likely causes
- Use console logging judiciously to trace execution
- Focus on solving one issue completely before addressing others

### 3. Focused Problem-Solving
- When encountering errors, stay focused on the original task
- Avoid being distracted by unrelated issues
- Address technical debt separately from feature work
- Document discovered issues for future resolution

### 4. Communication During Development
- Clearly communicate what changes are being made and why
- When problems occur, explain the nature of the issue
- Describe attempted solutions and their outcomes
- Provide options with trade-offs instead of unilateral decisions

## Kaku-Specific Guidelines

### 1. Brand Identity Consistency
- Maintain the Kaku character's visual appearance and personality
- Use the established color scheme consistently
- Adhere to typography guidelines (Inter for interface, Nunito for logo)
- Preserve the minimalist, chat-focused design philosophy

### 2. Feature Implementation Priorities
- Focus on RAG implementation for style analysis
- Enhance Kaku character integration across the application
- Improve document management capabilities
- Ensure mobile responsiveness for all features

### 3. Performance Considerations
- Optimize animations for smooth transitions
- Minimize unnecessary re-renders
- Be mindful of bundle size when adding new dependencies
- Test on various device types and connection speeds

This document should be reviewed and updated regularly as the project evolves. All team members should familiarize themselves with these guidelines before contributing to the codebase. 