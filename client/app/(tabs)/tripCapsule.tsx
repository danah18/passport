import {
  View,
  TextInput,
  StyleSheet,
  Button,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { getSupabaseClient } from '../../utils/supabase.ts';
import { Capsule } from './capsules.tsx';

const { width, height } = Dimensions.get('window');
const isMobile = width < 768;
const placeholderText =
  'Add important notes to your capsule summary here, like ' +
  "'Don't forget to apply for visa online at least 3 weeks before & make sure to do the sunset sail!'";

export interface Pin {
  id: string;
  pin_name: string;
  note: string;
}

export default function TripCapsule() {
  const { capsuleId } = useLocalSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const [capsuleSummary, setCapsuleSummary] = useState('');
  const [capsule, setCapsule] = useState<Capsule>();
  const [pins, setPins] = useState<Pin[]>([]);

  useEffect(() => {
    const fetchCapsule = async () => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('capsules')
        .select('*')
        .eq('id', capsuleId)
        .single();

      if (error) {
        console.log('Error fetching capsule:', error);
        return;
      }

      setCapsuleSummary(data.summary);
      setCapsule(data);

      const { data: pinData, error: pinError } = await supabase.rpc(
        'get_capsule_pins_with_owner_notes',
        {
          _capsule_id: capsuleId,
        }
      );
      setPins(pinData as Pin[]);

      if (pinError) {
        console.log('Error fetching capsule pins:', error);
        return;
      }
    };

    if (capsuleId) {
      fetchCapsule();
    }
  }, [capsuleId]);

  const handleSave = () => {
    setIsEditing(false);

    // Add logic to save the text to the DB with a post
  };

  return (
    <View>
      <View style={{ display: 'flex', margin: 10 }}>
        <TouchableOpacity
          style={{ marginRight: 10 }}
          onPress={() =>
            router.push({
              pathname: '/(tabs)',
            })
          }
        >
          <Text style={{ fontSize: 30 }}>👈</Text>
        </TouchableOpacity>
        <Text
          style={{ fontSize: 30, color: '#FFFFFF' }}
        >{`${capsule?.name} trip capsule`}</Text>
      </View>

      {/* swap to a dark mode // light mode style for font marginRight:10*/}

      <TextInput
        value={capsuleSummary}
        onChangeText={setCapsuleSummary}
        editable={isEditing}
        placeholder={placeholderText}
        placeholderTextColor='#AAAAAA'
        multiline={true}
        onFocus={() => setIsEditing(true)} // Set editing to true on focus
        onBlur={() => setIsEditing(false)} // Set editing to false on blur
        style={
          isMobile
            ? styles.editableTextContainerMobile
            : styles.editableTextContainerDesktop
        }
      />

      {isEditing ? (
        <>
          <View style={styles.saveButtonContainer}>
            <TouchableOpacity style={{ marginRight: 10 }} onPress={handleSave}>
              <Text style={{ fontSize: 25 }}>✔️</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.pencilButton}>
          <TouchableOpacity
            style={{ marginRight: 10 }}
            onPress={() => setIsEditing(!isEditing)}
          >
            <Text style={{ fontSize: 20 }}>✏️</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Just for debugging */}
      <View style={styles.pinListContainer}>
        {pins.map((pin, index) => (
          <View key={index} style={styles.pinItem}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.pinName}>{pin.pin_name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const inheritedStyles = StyleSheet.create({
  editableTextContainer: {
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'center',
    color: '#FFFFFF',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 15,
    borderRadius: 20,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    width: '80%',
  },
});

const styles = StyleSheet.create({
  editableTextContainerMobile: {
    ...StyleSheet.flatten(inheritedStyles.editableTextContainer),
    height: 100,
  },
  editableTextContainerDesktop: {
    ...StyleSheet.flatten(inheritedStyles.editableTextContainer),
    height: 40,
  },
  pencilButton: {
    display: 'flex',
    justifyContent: 'center',
  },
  saveButtonContainer: {
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'center',
  },
  pinListContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  pinItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  bulletPoint: {
    fontSize: 18,
    color: '#FFFFFF',
    marginRight: 5,
  },
  pinName: {
    fontSize: 18,
    color: '#FFFFFF',
  },
});
