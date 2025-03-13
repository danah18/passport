import React, { useState, useEffect } from 'react';
import { Button, ActivityIndicator, TextInput, StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { getSupabaseClient } from '../../utils/supabase';
import { User } from '@supabase/supabase-js';
import * as QueryParams from 'expo-auth-session/build/QueryParams';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

WebBrowser.maybeCompleteAuthSession();

export default function AccountScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [newUser, setNewUser] = useState(false);

  // We use a default password with phone sign-in for now to avoid setting up OTP verification for the time being
  const defaultPassword = "5uP@WuJO2$Z3lK";

  // Check if user is already logged in on component mount.
  useEffect(() => {
    const supabase = getSupabaseClient();

    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.log('Error fetching user:', error);
        return;
      }
      setUser(data?.user || null);
    };

    fetchUser();

    // Subscribe to auth state changes.
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        setNewUser(false);
        setPhone('');
        setFirstName('');
        setLastName('');
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Helper to create a session from the URL after OAuth.
  const createSessionFromUrl = async (url: string) => {
    const supabase = getSupabaseClient();
    const { params, errorCode } = QueryParams.getQueryParams(url);
    if (errorCode) throw new Error(errorCode);
    const { access_token, refresh_token } = params;
    if (!access_token) return;
    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });
    if (error) throw error;
    return data.session;
  };

  // Google Sign-In flow.
  const signInWithGoogle = async () => {
    setLoading(true);
    const supabase = getSupabaseClient();
    try {
      const redirectUri = AuthSession.makeRedirectUri({ path: 'auth' });
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: redirectUri, skipBrowserRedirect: true },
      });
      if (error) throw error;
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUri
      );
      if (result.type === 'success') {
        await createSessionFromUrl(result.url);
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email/password.
  const signInWithEmail = async () => {
    setLoading(true);
    const supabase = getSupabaseClient();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error) {
      console.error('Email Sign-In Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sign up with email/password.
  const signUpWithEmail = async () => {
    setLoading(true);
    const supabase = getSupabaseClient();
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      console.log('Sign-up successful, please verify your email.');
    } catch (error) {
      console.error('Email Sign-Up Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sign in with phone
  const signInWithPhone = async () => {
    setLoading(true);
    const supabase = getSupabaseClient();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        phone: phone,
        password: defaultPassword,
      });
      if (error) throw error;
    } catch (error) {
      console.error('Phone Sign-In Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sign up with phone
  // OTP will be easy to set up in the future: https://supabase.com/docs/guides/auth/phone-login?queryGroups=language&language=js
  const signUpWithPhone = async () => {
    setLoading(true);
    const supabase = getSupabaseClient();

    const autoCapitalizedFirstName = autoCapitalize(firstName);
    const autoCapitalizedLastName = autoCapitalize(lastName);
    const fullName = `${autoCapitalizedFirstName} ${autoCapitalizedLastName}`

    try {
      const { data, error } = await supabase.auth.signUp({
        phone: phone,
        password: defaultPassword,
        options: {
          data: {
            firstName: autoCapitalizedFirstName,
            lastName: autoCapitalizedLastName,
            name: fullName,
          }
        }
      })
      if (error) throw error;
    } catch (error) {
      console.error('Phone Sign-Up Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sign out the user.
  const signOut = async () => {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    setUser(null);
  };

  const autoCapitalize = (input: string) => {
    if (input.length == 0)
    {
      return input;
    } else if (input.length == 1) {
      return input.charAt(0).toUpperCase();
    } else if (input.length > 1) {
      return input.charAt(0).toUpperCase() + input.slice(1);
    }
  }

  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}
    >
      {user ? (
        <>
          <ThemedText style={{ marginBottom: 20 }}>
            Welcome, {user.user_metadata.firstName}
          </ThemedText>
          <Button title='Sign Out' onPress={signOut} />
        </>
      ) : (
        <>
          {loading ? (
            <ActivityIndicator size='large' color='#0000ff' />
          ) : (
            <>
              {newUser ? ( 
                <ThemedText style={{ marginVertical: 20 }}>Sign Up</ThemedText> 
              ) : ( 
                <ThemedText style={{ marginVertical: 20 }}>Sign In</ThemedText> 
              )}

              {newUser ? ( 
                <>
                  <TextInput
                  style={styles.inputStyle}
                  placeholder='First Name'
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize='words'
                  keyboardType='default'
                />
                <TextInput
                  style={styles.inputStyle}
                  placeholder='Last Name'
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize='sentences'
                  keyboardType='default'
                />
                </>  
              ) : ( 
                <></>
              )}

              <TextInput
                style={{
                  height: 40,
                  width: 250,
                  borderColor: 'gray',
                  borderWidth: 1,
                  marginBottom: 10,
                  paddingHorizontal: 10,
                  color: 'gray'
                }}
                placeholder='Phone Number'
                value={phone}
                onChangeText={setPhone}
                autoCapitalize='none'
                keyboardType='phone-pad'
              />

              {newUser ? ( 
                <Button title='Sign Up' onPress={signUpWithPhone} />
              ) : ( 
                <>
                  <Button title='Sign In' onPress={signInWithPhone}/>
                  <Button title='New User?' onPress={(() => {
                    setPhone('');
                    setNewUser(true);
                  })} />
                </>
              )}  
            </>
          )}
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  inputStyle: {
    height: 40,
    width: 250,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: 'gray'
  }
});