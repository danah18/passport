import React, { useState, useCallback } from 'react';
import { Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';

export default function PlaceTab() {
  const { width, height } = Dimensions.get('window');
  const isMobile = width < 768;

  return (
    // Play around with styling to not overlay on certain Maps components
    <BlurView intensity={20} style={{
        position: 'absolute',
        right: 0,
        top: 0,
        width: width * 0.25,
        height: height,
        display: 'flex',
        flexDirection: 'row',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      }}>
      Hello World!
    </BlurView>
  );
}
