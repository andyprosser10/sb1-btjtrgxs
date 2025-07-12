import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop, G, Line, Path } from 'react-native-svg';

interface LogoProps {
  size?: number;
}

export default function Logo({ size = 32 }: LogoProps) {
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 40 40">
        <Defs>
          <LinearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#3B82F6" />
            <Stop offset="100%" stopColor="#1D4ED8" />
          </LinearGradient>
          <LinearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <Stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.7" />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.9" />
          </LinearGradient>
        </Defs>
        
        <Circle
          cx="20"
          cy="20"
          r="18"
          fill="url(#logoGradient)"
          stroke="#1E40AF"
          strokeWidth="1"
        />
        
        <G opacity="0.3">
          <Line x1="8" y1="12" x2="32" y2="12" stroke="white" strokeWidth="0.5" />
          <Line x1="8" y1="16" x2="32" y2="16" stroke="white" strokeWidth="0.5" />
          <Line x1="8" y1="20" x2="32" y2="20" stroke="white" strokeWidth="0.5" />
          <Line x1="8" y1="24" x2="32" y2="24" stroke="white" strokeWidth="0.5" />
          <Line x1="8" y1="28" x2="32" y2="28" stroke="white" strokeWidth="0.5" />
        </G>
        
        <Path
          d="M8 20 Q14 16 20 20 T32 20"
          stroke="url(#waveGradient)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        
        <Path
          d="M8 24 Q14 20 20 24 T32 24"
          stroke="url(#waveGradient)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity="0.7"
        />
        
        <Circle cx="26" cy="16" r="1.5" fill="white" opacity="0.8" />
        
        <Circle cx="12" cy="20" r="1" fill="white" opacity="0.6" />
        <Circle cx="16" cy="18" r="0.8" fill="white" opacity="0.5" />
        <Circle cx="24" cy="22" r="0.8" fill="white" opacity="0.5" />
        <Circle cx="28" cy="20" r="1" fill="white" opacity="0.6" />
      </Svg>
    </View>
  );
}