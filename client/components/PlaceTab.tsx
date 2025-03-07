import React, { useState, useCallback } from 'react';
import { Dimensions, FlatList, StatusBar, View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import PlaceInfo, { mockPhotoArray } from './PlaceInfo.tsx';
import PlacePhotoFlatList from './PlacePhotoFlatList.tsx';

type PlaceTabProps = {
    placeId: string,
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
  });

  const [displayAllPhotos, setDisplayAllPhotos] = useState(false);

  // Assumption is that we can retrieve users and their recommendations for the specific pin
  // user1, note from user1; user2, note from user2l user3, note from user3
  const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      note: 'You get great portions for the price, and the food quality is v worth it. Check out their happy hour specials',
      name: 'Michelle Monaghan'
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      note: 'It’s in a great spot with plenty of parking and easy access. Perfect for a quick bite or a long, relaxed meal',
      name: 'Aubrey Plaza'
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      note: 'Menu has a little something for everyone, and everything is made with fresh, high-quality ingredients',
      name: 'Jennifer Coolidge'
    },
    {
      id: 'a8694a0f-3da1-471f-bd96-145571e29d72',
      note: 'We had to wait a good amount to get a table, but once seated the staff was super apologetic',
      name: 'Jennifer Aniston'
    },
    {
      id: 'f8694a0f-3da1-471f-bd96-145571e29d72',
      note: `Generous portion sizes, I'd recommend doing family style or only apps if you're not hungry`,
      name: 'Alex Pettyfer'
    },
    {
      id: 'g8694a0f-3da1-471f-bd96-145571e29d72',
      note: `Street parking is hard, just do the valet - it's worth the $10`,
      name: 'Jim Carter'
    },
  ];
  
  type ItemProps = {
    note: string,
    name: string
  };
  
  const Item = ({note, name}: ItemProps) => (
    <View style={styles.item}>
      <Text style={styles.text}>{note}</Text>
      <Text style={styles.recommenderText}>{name}</Text>
    </View> 
  );

  return (
    // Play around with styling to not overlay on certain Maps components
    <BlurView intensity={20} style={{
        position: 'absolute',
        right: 0,
        top: 0,
        width: width*0.25,
        height: height,
        display: 'flex',
        flexDirection: 'row',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        borderRadius: '8px'
      }}>
        {displayAllPhotos ? 
          <PlacePhotoFlatList photos={mockPhotoArray} setDisplayAllPhotos={setDisplayAllPhotos}/> :
          <View>
            <PlaceInfo placeId={props.placeId} setDisplayAllPhotos={setDisplayAllPhotos}/>
            <FlatList
              data={DATA}
              renderItem={({item}) => <Item note={item.note} name={item.name} />}
              keyExtractor={item => item.id}
            />
          </View>   
        }
    </BlurView>
  );
}




  