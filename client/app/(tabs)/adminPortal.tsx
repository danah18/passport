import { StyleSheet, Image, Platform, View, Button, TextInput } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useState } from 'react';

export default function TabTwoScreen() {
  const [inputValue, setInputValue] = useState("");

  return (
    <View style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Admin Portal</ThemedText>
      </ThemedView>
      <ThemedText>This tool allows you to add new pins to your local supabase DB instance.</ThemedText>
      <Collapsible title="1) Get Google Place JSON info">
        <ThemedText>
          Due to existing CORS issues, we use the Google Place API explorer to get JSON blobs rather than calling our own edge function.
          Hit 'Try It', update text query, then hit 'Execute'.
        </ThemedText>
        
        <ExternalLink href="https://developers.google.com/maps/documentation/places/web-service/text-search">
          <ThemedText type="link">Open Google Place API explorer</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="2) Copy & Paste JSON object into DB">
        <TextInput 
          style={styles.input} 
          placeholder="Paste JSON blob here" 
          value={inputValue} 
          onChangeText={setInputValue} // Update state on text change
        />
        <Button 
          title="Submit" 
          onPress={() => {
            // Handle button press
            console.log(inputValue); // Example action
          }} 
        />
      </Collapsible>
      <Collapsible title="3) See new info in your local DB instance">
        <ExternalLink href="http://127.0.0.1:54323/project/default/editor/19423?schema=public">
          <ThemedText type="link">Check out the pins table in the public schema to see changes</ThemedText>
        </ExternalLink>
      </Collapsible>    
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  container: {
    gap: 30,
    marginTop: 10,
    marginLeft: 10
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    color:'white'
  },
});
