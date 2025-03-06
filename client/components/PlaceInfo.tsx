import React, { useState, useCallback, useEffect } from 'react';
import { Dimensions, FlatList, StatusBar, View, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { getSupabaseClient } from '../utils/supabase.ts';

type PlaceInfoProps = {
    placeId: string,
}

export default function PlaceInfo(props: PlaceInfoProps) {
  const { width, height } = Dimensions.get('window');
  const isMobile = width < 768;

  const supabase = getSupabaseClient();

  useEffect(() => {
    test();
  }, []);

  const test = async () => {
    const { data, error } = await supabase.functions.invoke(`google-places?placeId=${props.placeId}`, {
      headers: {
        'Authorization': `Bearer ${Deno.env.get('EXPO_PUBLIC_SUPABASE_ANON_KEY')}`,
        'Access-Control-Allow-Origin': '*',
      },
      method: 'GET',
    })
  
    console.log(data);
  };

  return (
    <View>
    </View>
  );
}



  