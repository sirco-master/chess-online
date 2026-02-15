# Mobile App Deployment

This document outlines the steps to deploy Chess World as a mobile application.

## Overview

Chess World is built with React and can be deployed as:
1. **Progressive Web App (PWA)** - Install directly from browser
2. **Native Mobile App** - Using Expo/React Native wrapper
3. **Hybrid App** - Using Capacitor or similar

## Option 1: Progressive Web App (PWA)

The easiest deployment path. Users can install the app directly from their mobile browser.

### Steps:
1. Build the production app: `npm run build`
2. Deploy to a web server (Render, Vercel, Netlify, etc.)
3. Users visit the site and use "Add to Home Screen" on mobile

### Advantages:
- No app store approval needed
- Instant updates
- Cross-platform (iOS, Android, Desktop)
- Lower development overhead

### Limitations:
- Limited native device access
- Must be accessed through browser first

## Option 2: Native Mobile App with Expo

For a more native feel and app store distribution.

### Prerequisites:
```bash
npm install -g expo-cli eas-cli
```

### Setup:
1. Install Expo dependencies:
```bash
npx expo install expo expo-status-bar expo-splash-screen
```

2. Create an Expo account at https://expo.dev

3. Initialize EAS (Expo Application Services):
```bash
eas login
eas build:configure
```

### Development:
```bash
# Start Expo development server
npx expo start

# Run on iOS simulator (Mac only)
npx expo start --ios

# Run on Android emulator
npx expo start --android
```

### Building for Production:

#### iOS Build:
```bash
eas build --platform ios --profile production
```

Requirements:
- Apple Developer account ($99/year)
- App Store Connect setup

#### Android Build:
```bash
eas build --platform android --profile production
```

Requirements:
- Google Play Developer account ($25 one-time)
- App signing key

### Submitting to App Stores:

#### iOS (App Store):
```bash
eas submit --platform ios
```

#### Android (Google Play):
```bash
eas submit --platform android
```

## Option 3: Capacitor (Alternative to Expo)

Capacitor allows wrapping the existing React app with minimal changes.

### Setup:
```bash
npm install @capacitor/core @capacitor/cli
npx cap init "Chess World" "com.rzplay.chessworld"
npm install @capacitor/ios @capacitor/android
```

### Add Platforms:
```bash
npx cap add ios
npx cap add android
```

### Build and Sync:
```bash
npm run build
npx cap sync
```

### Open in Native IDEs:
```bash
npx cap open ios     # Opens in Xcode
npx cap open android # Opens in Android Studio
```

## Configuration Files

The following files have been added to support mobile deployment:

- **app.json** - Expo configuration
- **metro.config.js** - Metro bundler configuration
- **MOBILE_DEPLOYMENT.md** - This guide

## Mobile-Specific Considerations

### 1. Touch Interactions
- All buttons have adequate touch targets (min 44x44px)
- Hover effects adapted for touch (using active states)
- Drag-and-drop chess pieces work on mobile

### 2. Responsive Design
- All screens are mobile-optimized
- Breakpoints at 768px and 480px
- Font sizes scale appropriately

### 3. Performance
- Animations use CSS transforms (GPU-accelerated)
- Images and assets optimized
- Lazy loading where appropriate

### 4. Offline Support
- LocalStorage for game data
- Service workers (TODO for PWA)
- Offline game modes already functional

## Testing on Mobile

### iOS Testing:
1. Install Expo Go app from App Store
2. Scan QR code from `npx expo start`
3. Test on physical device

### Android Testing:
1. Install Expo Go app from Google Play
2. Scan QR code from `npx expo start`
3. Test on physical device

### Browser Testing:
```bash
npm run dev
# Open in Chrome DevTools mobile emulator
```

## App Store Requirements

### iOS App Store:
- App icon (1024x1024px)
- Screenshots (various sizes for different devices)
- Privacy policy
- App description
- Keywords
- Support URL
- Age rating

### Google Play Store:
- App icon (512x512px)
- Feature graphic (1024x500px)
- Screenshots (minimum 2, various sizes)
- Privacy policy
- App description
- Content rating
- Store listing

## Next Steps

1. **Test thoroughly on mobile devices**
   - Various screen sizes
   - Different OS versions
   - Performance testing

2. **Optimize assets**
   - Compress images
   - Minimize bundle size
   - Code splitting if needed

3. **Add push notifications** (optional)
   - For friend requests
   - Club invites
   - Match challenges

4. **Implement analytics** (optional)
   - Track user engagement
   - Monitor crashes
   - A/B testing

5. **Set up CI/CD**
   - Automated builds
   - Automated testing
   - Automated deployment

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Capacitor Documentation](https://capacitorjs.com/)
- [Apple App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Guidelines](https://play.google.com/about/developer-content-policy/)

## Support

For issues or questions regarding mobile deployment, please refer to:
- Expo Forums: https://forums.expo.dev/
- Stack Overflow: https://stackoverflow.com/questions/tagged/expo
- Project Issues: [GitHub Issues]
