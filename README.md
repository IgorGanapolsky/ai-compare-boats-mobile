# AI Compare Boats Mobile

A modern React Native application (Expo SDK 52) for comparing boats using AI image recognition technology. Upload a boat image and find similar boats with detailed specifications.

![React Native](https://img.shields.io/badge/React_Native-0.76.5-blue)
![Expo](https://img.shields.io/badge/Expo-52-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- 📸 Take a photo or upload a boat image from your gallery
- 🤖 AI-powered boat image analysis using TensorFlow.js
- 🔍 Find similar boats based on the analysis
- 📊 View detailed boat specifications and comparisons
- 🎨 Modern, responsive UI with dark mode support

## Prerequisites

- Node.js 20.x or later
- Expo CLI (for development)
- Xcode 16+ (for iOS development)
- Android Studio 2025.1+ (for Android development)
- iOS 18+ or Android 14+ device/emulator

## Installation

```bash
# Clone the repository
git clone https://github.com/IgorGanapolsky/ai-compare-boats-mobile.git
cd ai-compare-boats-mobile

# Install dependencies
npm install

# Start the development server
npx expo start
```

## Running on Physical Devices

### iOS (using Expo Go)
1. Install the Expo Go app from the App Store
2. Run `npx expo start --tunnel` in the project directory
3. Scan the QR code with your iPhone's camera app

### Android (using Expo Go)
1. Install the Expo Go app from the Google Play Store
2. Run `npx expo start --tunnel` in the project directory
3. Scan the QR code with the Expo Go app

## Project Structure

```
ai-compare-boats-mobile/
├── assets/                   # Static assets (images, fonts)
├── lib/                      # Local shared packages
│   ├── boats-api/            # API client services
│   ├── boats-core/           # Core business logic
│   ├── boats-hooks/          # React hooks
│   └── boats-types/          # TypeScript types
├── src/
│   ├── navigation/           # Navigation configuration
│   ├── screens/              # Application screens
│   └── theme/                # Theming and styling
├── App.tsx                   # Main application component
└── app.json                  # Expo configuration
```

## Shared Packages

This project utilizes shared packages from the [boats-shared-packages](https://github.com/IgorGanapolsky/boats-shared-packages) repository:

- `@boats/api`: API client services
- `@boats/core`: Core business logic and utilities
- `@boats/hooks`: React hooks
- `@boats/types`: TypeScript types

## Building for Production

### iOS
```bash
npx expo prebuild --platform ios
cd ios
pod install
npx react-native run-ios --configuration Release
```

### Android
```bash
npx expo prebuild --platform android
cd android
./gradlew assembleRelease
```

## Testing

```bash
# Run tests
npm test

# Run linter
npm run lint
```

## Dependencies

- [React Native](https://reactnative.dev/) - Mobile app framework
- [Expo](https://expo.dev/) - React Native toolchain
- [TensorFlow.js](https://www.tensorflow.org/js) - ML library for image analysis
- [React Navigation](https://reactnavigation.org/) - Navigation library
- See [package.json](./package.json) for a complete list

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See [LICENSE](./LICENSE) for more information.

## Contact

Igor Ganapolsky - [@igorganapolsky](https://github.com/IgorGanapolsky)
