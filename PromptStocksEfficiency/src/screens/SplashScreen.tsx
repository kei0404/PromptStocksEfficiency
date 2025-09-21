import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { BlueTheme } from '../styles/theme';
interface Props {
  navigation: any;
}

const { width, height } = Dimensions.get('window');

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    
    // Start animations
    Animated.sequence([
      // Logo fade in and scale
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      // Text slide up
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to home after delay
    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 2500);

    return () => {
      clearTimeout(timer);
      StatusBar.setBarStyle('dark-content');
    };
  }, [navigation, fadeAnim, scaleAnim, slideAnim]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={BlueTheme.primary[700]} />
      
      {/* Background Gradient */}
      <View style={styles.gradientBackground} />
      
      {/* Floating Particles */}
      <View style={styles.particle1} />
      <View style={styles.particle2} />
      <View style={styles.particle3} />
      
      {/* Main Content */}
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Logo Icon */}
          <View style={styles.logoIcon}>
            <Text style={styles.logoEmoji}>💡</Text>
          </View>
          
          {/* App Name */}
          <Animated.Text
            style={[
              styles.appName,
              {
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            PromptStocksEfficiency
          </Animated.Text>
          
          {/* Tagline */}
          <Animated.Text
            style={[
              styles.tagline,
              {
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            効率化プロンプト管理
          </Animated.Text>
        </Animated.View>
        
        {/* Loading Indicator */}
        <Animated.View
          style={[
            styles.loadingContainer,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <View style={styles.loadingDots}>
            <Animated.View style={[styles.dot, { opacity: fadeAnim }]} />
            <Animated.View 
              style={[
                styles.dot, 
                styles.dot2,
                { 
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                }
              ]} 
            />
            <Animated.View style={[styles.dot, { opacity: fadeAnim }]} />
          </View>
        </Animated.View>
      </View>
      
      {/* Footer */}
      <Animated.View
        style={[
          styles.footer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.footerText}>
          オフライン対応 • プライバシー重視
        </Text>
        <Text style={styles.versionText}>v1.0.0</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BlueTheme.primary[700],
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: BlueTheme.primary[600],
    opacity: 0.95,
  },
  particle1: {
    position: 'absolute',
    top: height * 0.1,
    left: width * 0.1,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(144, 202, 249, 0.4)', // Blue theme particle
  },
  particle2: {
    position: 'absolute',
    top: height * 0.3,
    right: width * 0.15,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(187, 222, 251, 0.3)', // Blue theme particle
  },
  particle3: {
    position: 'absolute',
    bottom: height * 0.2,
    left: width * 0.2,
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(227, 242, 253, 0.5)', // Blue theme particle
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoIcon: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: 'rgba(227, 242, 253, 0.2)', // Blue theme background
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: BlueTheme.primary[900],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoEmoji: {
    fontSize: 48,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: '-apple-system',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: '-apple-system',
    textAlign: 'center',
    fontWeight: '500',
  },
  loadingContainer: {
    marginTop: 40,
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(227, 242, 253, 0.6)', // Blue theme dot
    marginHorizontal: 4,
  },
  dot2: {
    backgroundColor: BlueTheme.primary[100], // Bright blue for active dot
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: '-apple-system',
    textAlign: 'center',
    marginBottom: 8,
  },
  versionText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: '-apple-system',
  },
});

export default SplashScreen;