import React, { useState, useCallback } from 'react';
import { Dimensions, FlatList, StatusBar, View, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import PlaceInfo, { mockPhotoArray } from './PlaceInfo.tsx';
import PlacePhotoFlatList from './PlacePhotoFlatList.tsx';

type PlaceTabProps = {
    placeId: string,
}

export default function PlaceTab(props: PlaceTabProps) {
  const { width, height } = Dimensions.get('window');
  const isMobile = width < 768;

  const [displayAllPhotos, setDisplayAllPhotos] = useState(false);

  // Assumption is that we can retrieve users and their recommendations for the specific pin
  // user1, note from user1; user2, note from user2l user3, note from user3
  const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'First Item',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Second Item',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Third Item',
    },
  ];
  
  type ItemProps = {title: string};
  
  const Item = ({title}: ItemProps) => (
    <View>
      <Text>{title}</Text>
    </View> 
  );

  return (
    // Play around with styling to not overlay on certain Maps components
    <BlurView intensity={20} style={{
        position: 'absolute',
        right: 0,
        top: 0,
        width: width* 0.25,
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
              renderItem={({item}) => <Item title={item.title} />}
              keyExtractor={item => item.id}
            />
          </View>   
        }
        
        
    </BlurView>
  );
}



  