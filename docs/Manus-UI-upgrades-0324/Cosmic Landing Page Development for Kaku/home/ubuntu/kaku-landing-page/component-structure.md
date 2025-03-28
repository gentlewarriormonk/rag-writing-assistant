# Component Structure for Kaku's Cosmic Landing Page

## Component Hierarchy Diagram

```
LandingPage
├── CosmicBackground
│   ├── StarfieldCanvas (Three.js)
│   ├── EarthModel (Three.js)
│   └── AmbientParticles (Three.js)
├── SoundController
├── ScrollContainer (Locomotive Scroll)
│   ├── IntroSection
│   │   ├── KakuCharacter
│   │   │   ├── KakuSVG
│   │   │   └── EmotionController
│   │   ├── KakuArrivalAnimation
│   │   └── IntroText
│   ├── OriginStorySection
│   │   ├── HelixNebula
│   │   ├── KakuCharacter
│   │   ├── StoryText
│   │   └── VisualElements
│   │       ├── ArchitectsVisualization
│   │       └── JourneyPath
│   ├── CharacterDevelopmentSection
│   │   ├── KakuCharacter
│   │   ├── ConstellationVisualizations
│   │   │   ├── CuriosityConstellation
│   │   │   ├── WarmthConstellation
│   │   │   ├── CreativityConstellation
│   │   │   └── EncouragementConstellation
│   │   └── TraitDescriptions
│   ├── MissionExplanationSection
│   │   ├── KakuCharacter
│   │   ├── MissionVisualization
│   │   │   ├── DiscoveryStage
│   │   │   ├── DevelopmentStage
│   │   │   └── MasteryStage
│   │   └── MissionText
│   ├── SignUpSection
│   │   ├── KakuCharacter
│   │   ├── SignUpForm
│   │   │   ├── FormFields
│   │   │   ├── SubmitButton
│   │   │   └── FormMessages
│   │   └── CosmicFormContainer
│   └── TransitionToChatSection
│       ├── KakuCharacter
│       ├── ChatInterface
│       │   ├── MessageContainer
│       │   ├── InputArea
│       │   └── UIControls
│       └── TransitionEffects
├── NavigationIndicators
│   ├── ScrollProgress
│   └── SectionIndicators
├── AccessibilityControls
│   ├── ReducedMotionToggle
│   └── SoundToggle
└── ResponsiveController
```

## Component Definitions and Props

### Core Container Components

#### 1. LandingPage

**Description:** The main container component that orchestrates the entire landing experience.

**Props:**
- `initialSection?: string` - Optional section to start at (for deep linking)
- `userAuthStatus?: 'new' | 'returning' | 'authenticated'` - User authentication status
- `onComplete?: () => void` - Callback when landing experience is completed

**State:**
- `currentSection: string` - Current active section
- `landingProgress: number` - Overall progress through the landing experience
- `isLoading: boolean` - Loading state for assets
- `hasInteracted: boolean` - Whether user has interacted with the page

**Key Methods:**
- `handleSectionChange(section: string): void` - Handle section changes
- `handleComplete(): void` - Handle completion of landing experience
- `checkDeviceCapabilities(): void` - Check device capabilities for feature adjustments

#### 2. CosmicBackground

**Description:** Manages the 3D cosmic background with starfield and Earth.

**Props:**
- `intensity: number` - Controls the visual intensity of cosmic effects
- `parallaxEnabled: boolean` - Whether parallax effects are enabled
- `focusPoint?: {x: number, y: number}` - Point of focus for camera/effects

**State:**
- `isInitialized: boolean` - Whether Three.js scene is initialized
- `fpsRate: number` - Current FPS for performance monitoring
- `particleDensity: number` - Adjusted particle density based on device

**Key Methods:**
- `initializeScene(): void` - Set up Three.js scene
- `updateParallax(mousePosition: {x: number, y: number}): void` - Update parallax effect
- `adjustForPerformance(): void` - Adjust visual complexity based on performance

#### 3. ScrollContainer

**Description:** Manages the smooth scrolling experience and section transitions.

**Props:**
- `children: React.ReactNode` - Child components/sections
- `smoothScrolling: boolean` - Whether to use smooth scrolling
- `onSectionChange?: (section: string) => void` - Callback for section changes

**State:**
- `activeSection: string` - Currently active section
- `scrollProgress: number` - Overall scroll progress (0-1)
- `isScrolling: boolean` - Whether user is actively scrolling

**Key Methods:**
- `initializeScroll(): void` - Set up scroll behavior
- `scrollToSection(section: string): void` - Programmatically scroll to section
- `updateScrollProgress(progress: number): void` - Update scroll progress

### Character Components

#### 4. KakuCharacter

**Description:** Manages Kaku's appearance, animations, and emotional states.

**Props:**
- `emotion: 'neutral' | 'happy' | 'curious' | 'excited' | 'thoughtful'` - Current emotional state
- `size: 'small' | 'medium' | 'large'` - Size of character
- `animation?: 'idle' | 'arrival' | 'greeting' | 'pointing' | 'celebration'` - Current animation
- `position?: {x: number, y: number}` - Position coordinates
- `onAnimationComplete?: () => void` - Callback when animation completes

**State:**
- `currentFrame: number` - Current animation frame
- `glowIntensity: number` - Intensity of character's glow effect
- `isAnimating: boolean` - Whether character is currently animating

**Key Methods:**
- `playAnimation(animation: string): void` - Play specific animation
- `transitionEmotion(emotion: string): void` - Transition to new emotional state
- `pulse(): void` - Create pulse effect for emphasis

#### 5. KakuArrivalAnimation

**Description:** Specialized component for Kaku's initial arrival sequence.

**Props:**
- `onComplete?: () => void` - Callback when arrival animation completes
- `speed?: 'slow' | 'normal' | 'fast'` - Animation speed
- `skipAnimation?: boolean` - Whether to skip animation (accessibility)

**State:**
- `animationPhase: 'approach' | 'orbit' | 'zoom' | 'reveal' | 'complete'` - Current phase
- `progress: number` - Animation progress (0-1)

**Key Methods:**
- `startAnimation(): void` - Begin animation sequence
- `skipToEnd(): void` - Skip to end of animation
- `handlePhaseComplete(phase: string): void` - Handle completion of animation phase

### Section Components

#### 6. IntroSection

**Description:** The initial introduction section with Kaku's greeting.

**Props:**
- `onComplete?: () => void` - Callback when intro is complete
- `isActive: boolean` - Whether section is currently active

**State:**
- `textRevealProgress: number` - Progress of text reveal animation
- `hasGreeted: boolean` - Whether initial greeting has completed

**Key Methods:**
- `revealText(): void` - Animate text reveal
- `handleKakuAnimationComplete(): void` - Handle when Kaku's animation completes
- `promptScroll(): void` - Show scroll prompt to continue

#### 7. OriginStorySection

**Description:** Section revealing Kaku's origin from the Helix Nebula.

**Props:**
- `isActive: boolean` - Whether section is currently active
- `scrollProgress: number` - Scroll progress within section (0-1)

**State:**
- `nebulaFormation: number` - Formation progress of nebula visualization
- `storyPhase: 'architects' | 'creation' | 'purpose' | 'journey'` - Current story phase

**Key Methods:**
- `updateVisualization(progress: number): void` - Update visualization based on scroll
- `revealStoryPhase(phase: string): void` - Reveal specific story phase
- `animateJourneyPath(progress: number): void` - Animate the journey path visualization

#### 8. CharacterDevelopmentSection

**Description:** Section revealing Kaku's personality traits through constellations.

**Props:**
- `isActive: boolean` - Whether section is currently active
- `scrollProgress: number` - Scroll progress within section (0-1)

**State:**
- `activeConstellation: 'curiosity' | 'warmth' | 'creativity' | 'encouragement' | null` - Current active constellation
- `constellationFormation: {[key: string]: number}` - Formation progress for each constellation

**Key Methods:**
- `formConstellation(name: string, progress: number): void` - Form specific constellation
- `transitionTraits(from: string, to: string): void` - Transition between trait focuses
- `updateKakuEmotion(trait: string): void` - Update Kaku's emotion based on active trait

#### 9. MissionExplanationSection

**Description:** Section explaining Kaku's mission to help users discover their voice.

**Props:**
- `isActive: boolean` - Whether section is currently active
- `scrollProgress: number` - Scroll progress within section (0-1)

**State:**
- `activeStage: 'discovery' | 'development' | 'mastery' | null` - Current active mission stage
- `pathIllumination: number` - Illumination progress of mission path
- `visualizationState: {[key: string]: any}` - State of mission visualization

**Key Methods:**
- `illuminatePath(progress: number): void` - Illuminate the mission path based on scroll
- `activateStage(stage: string): void` - Activate specific mission stage
- `animateTransition(from: string, to: string): void` - Animate transition between stages

#### 10. SignUpSection

**Description:** Section with the sign-up form that maintains narrative continuity.

**Props:**
- `isActive: boolean` - Whether section is currently active
- `onSignUpComplete?: (userData: any) => void` - Callback when sign-up completes

**State:**
- `formData: {name: string, email: string, password: string, interests?: string[]}` - Form data
- `formErrors: {[key: string]: string}` - Form validation errors
- `formStatus: 'idle' | 'submitting' | 'success' | 'error'` - Current form status
- `kakuReaction: 'encouraging' | 'celebrating' | 'helping'` - Kaku's reaction to form interaction

**Key Methods:**
- `validateForm(): boolean` - Validate form data
- `handleSubmit(e: React.FormEvent): void` - Handle form submission
- `updateKakuReaction(field: string, isValid: boolean): void` - Update Kaku's reaction based on form interaction

#### 11. TransitionToChatSection

**Description:** Final section that transitions to the chat interface.

**Props:**
- `isActive: boolean` - Whether section is currently active
- `userData: any` - User data from sign-up
- `onTransitionComplete?: () => void` - Callback when transition completes

**State:**
- `transitionPhase: 'initial' | 'opening' | 'materializing' | 'complete'` - Current transition phase
- `chatInterfaceReady: boolean` - Whether chat interface is ready
- `welcomeMessageProgress: number` - Progress of welcome message typing animation

**Key Methods:**
- `startTransition(): void` - Begin transition animation
- `materializeInterface(progress: number): void` - Materialize chat interface elements
- `animateWelcomeMessage(): void` - Animate typing of welcome message

### UI and Interactive Components

#### 12. SignUpForm

**Description:** Form component for user registration with cosmic styling.

**Props:**
- `onSubmit: (data: any) => void` - Submit handler
- `initialValues?: {[key: string]: any}` - Initial form values
- `isSubmitting: boolean` - Whether form is submitting

**State:**
- `values: {[key: string]: any}` - Form field values
- `touched: {[key: string]: boolean}` - Which fields have been touched
- `errors: {[key: string]: string}` - Validation errors
- `currentFocus: string | null` - Currently focused field

**Key Methods:**
- `handleChange(e: React.ChangeEvent): void` - Handle field changes
- `handleBlur(e: React.FocusEvent): void` - Handle field blur
- `validate(): {[key: string]: string}` - Validate form values
- `handleSubmit(e: React.FormEvent): void` - Handle form submission

#### 13. NavigationIndicators

**Description:** Provides subtle navigation indicators for the scroll journey.

**Props:**
- `sections: string[]` - Array of section IDs
- `currentSection: string` - Current active section
- `scrollProgress: number` - Overall scroll progress (0-1)

**State:**
- `isVisible: boolean` - Whether indicators are visible
- `indicatorPositions: {[key: string]: number}` - Positions for each indicator

**Key Methods:**
- `scrollToSection(section: string): void` - Scroll to specific section
- `updateIndicatorPositions(): void` - Update indicator positions based on sections
- `toggleVisibility(): void` - Toggle visibility of indicators

#### 14. AccessibilityControls

**Description:** Provides accessibility controls for the experience.

**Props:**
- `onReducedMotionChange: (enabled: boolean) => void` - Reduced motion toggle handler
- `onSoundToggle: (enabled: boolean) => void` - Sound toggle handler
- `initialReducedMotion?: boolean` - Initial reduced motion state
- `initialSoundEnabled?: boolean` - Initial sound state

**State:**
- `isExpanded: boolean` - Whether controls are expanded
- `reducedMotion: boolean` - Reduced motion state
- `soundEnabled: boolean` - Sound enabled state

**Key Methods:**
- `toggleControls(): void` - Toggle controls expansion
- `toggleReducedMotion(): void` - Toggle reduced motion setting
- `toggleSound(): void` - Toggle sound setting

### Animation and Effect Components

#### 15. ConstellationVisualization

**Description:** Creates and animates constellation patterns for personality traits.

**Props:**
- `type: 'curiosity' | 'warmth' | 'creativity' | 'encouragement'` - Constellation type
- `formationProgress: number` - Formation progress (0-1)
- `isActive: boolean` - Whether constellation is active
- `colorPalette: {primary: string, secondary: string, accent: string}` - Color scheme

**State:**
- `starPositions: {x: number, y: number, size: number, delay: number}[]` - Star positions
- `pathProgress: number` - Progress of path formation
- `twinkleStates: boolean[]` - Twinkling state for each star

**Key Methods:**
- `generateStarPositions(): void` - Generate star positions based on type
- `updatePathProgress(progress: number): void` - Update constellation path formation
- `animateTwinkle(): void` - Animate star twinkling effect

#### 16. MissionVisualization

**Description:** Visualizes the three stages of Kaku's mission with cosmic elements.

**Props:**
- `activeStage: 'discovery' | 'development' | 'mastery' | null` - Current active stage
- `pathProgress: number` - Progress of path illumination (0-1)
- `stageProgress: {[key: string]: number}` - Progress for each stage formation

**State:**
- `particleStates: {[key: string]: any}` - State of particles for each stage
- `pathPoints: {x: number, y: number}[]` - Points defining the mission path
- `stagePositions: {[key: string]: {x: number, y: number}}` - Positions for each stage

**Key Methods:**
- `illuminatePath(progress: number): void` - Illuminate path based on progress
- `formStage(stage: string, progress: number): void` - Form specific mission stage
- `animateParticles(stage: string): void` - Animate particles for specific stage

#### 17. CosmicFormContainer

**Description:** Creates cosmic-themed container for the sign-up form.

**Props:**
- `children: React.ReactNode` - Child components (form elements)
- `glowIntensity: number` - Intensity of cosmic glow effect
- `animationState: 'appearing' | 'idle' | 'submitting' | 'success'` - Current animation state

**State:**
- `particlePositions: {x: number, y: number, size: number, speed: number}[]` - Cosmic particle positions
- `glowPulse: number` - Current glow pulse value
- `borderAnimation: number` - Border animation progress

**Key Methods:**
- `animateParticles(): void` - Animate cosmic particles
- `pulseGlow(): void` - Create pulsing glow effect
- `animateBorder(): void` - Animate container border

#### 18. TransitionEffects

**Description:** Creates visual effects for transitions between sections.

**Props:**
- `type: 'fade' | 'cosmic' | 'portal' | 'reveal'` - Transition type
- `progress: number` - Transition progress (0-1)
- `direction: 'in' | 'out'` - Transition direction
- `onComplete?: () => void` - Callback when transition completes

**State:**
- `particleSystem: any` - Particle system for cosmic effects
- `maskPosition: {x: number, y: number, scale: number}` - Position for mask effects
- `effectOpacity: number` - Opacity of transition effect

**Key Methods:**
- `initializeEffect(): void` - Initialize transition effect
- `updateEffect(progress: number): void` - Update effect based on progress
- `cleanupEffect(): void` - Clean up effect resources

### Utility and Controller Components

#### 19. SoundController

**Description:** Manages sound effects and ambient audio for the experience.

**Props:**
- `isMuted: boolean` - Whether sound is mu<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>