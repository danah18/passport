import React, { useState, useCallback } from 'react';
import { Dimensions, FlatList, StatusBar, View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import PlaceInfo from './PlaceInfo.tsx';
import PlacePhotoFlatList from './PlacePhotoFlatList.tsx';
import { Pin } from '../app/(tabs)/map.tsx';
import { ScrollView } from 'react-native-gesture-handler';

type PlaceTabProps = {
    pin: Pin,
    isMobile:boolean,
}

export default function PlaceTab(props: PlaceTabProps) {
  const { width, height } = Dimensions.get('window');
  const isMobile = width < 768;

  const styles = StyleSheet.create({
    container: {
      flex: 1, // Ensures the View takes up full height
      padding: 10,
    },
    item: {
      opacity: 0.8,
      backgroundColor: 'white',
      borderRadius: '10px',
      marginLeft: 5,
      marginVertical: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3, // For Android shadow,
      width: width*0.25
    },
    text: {
      fontSize: 14,
      marginLeft: 5,
      padding: 10,
      width: width*0.25
    },
    recommenderText: {
      fontSize: 14,
      fontStyle: 'italic',
      marginLeft: 5,
      padding: 10,
    },
    desktop: {
      position: 'absolute',
      right: 0,
      top: 0,
      width: width*0.25,
      height: height,
      display: 'flex',
      flexDirection: 'row',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      borderRadius: '8px'
    },
    mobile: {
      position: 'absolute',
      // right: 0,
      top: height*0.76,
      width: width,
      height: height,
      display: 'flex',
      flexDirection: 'row',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      borderRadius: '8px'
    },
  });

  const [displayAllPhotos, setDisplayAllPhotos] = useState(false);

  // Given pin id from props, query user_pin DB for the list of recommendations
  // 
  // Add recommendations in portal
  // TODO: make equivalent supabase function
  //  const { data, error } = await supabase.rpc('pins_in_view', {
  //   min_lat,
  //   min_long,
  //   max_lat,
  //   max_long,
  // });
  // if (error) {
  //   console.error('Error fetching pins:', error);
  // } else if (data) {
  //   setPins(data as Pin[]);
  // }
  
  type ItemProps = {
    note: string,
    name: string
  };
  
  const Item = ({note, name}: ItemProps) => (
    <View style={styles.item}>
      {/* <Text style={styles.text}>{note}</Text> */}
      <Text style={styles.recommenderText}>{name}</Text>
    </View> 
  );

  return (
    // Play around with styling to not overlay on certain Maps components
    <BlurView intensity={20} style={isMobile ? styles.mobile : styles.desktop}>
        {displayAllPhotos ? 
          <PlacePhotoFlatList photos={props.pin.metadata.photos} setDisplayAllPhotos={setDisplayAllPhotos}/> :
          <ScrollView>
            <PlaceInfo pin={props.pin} setDisplayAllPhotos={setDisplayAllPhotos}/>
          </ScrollView>   
        }
    </BlurView>
  );
}

  