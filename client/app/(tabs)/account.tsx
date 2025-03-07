import React, { useState, useEffect } from 'react';
import { Button, ActivityIndicator, TextInput } from 'react-native';
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

  // Sign out the user.
  const signOut = async () => {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    setUser(null);
  };

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
            Welcome, {user.email}
          </ThemedText>
          <Button title='Sign Out' onPress={signOut} />
        </>
      ) : (
        <>
          {loading ? (
            <ActivityIndicator size='large' color='#0000ff' />
          ) : (
            <>
              <ThemedText style={{ marginVertical: 20 }}>Sign In</ThemedText>
              <TextInput
                style={{
                  height: 40,
                  width: 250,
                  borderColor: 'gray',
                  borderWidth: 1,
                  marginBottom: 10,
                  paddingHorizontal: 10,
                  color: 'white'
                }}
                placeholder='Email'
                value={email}
                onChangeText={setEmail}
                autoCapitalize='none'
                keyboardType='email-address'
              />
              <TextInput
                style={{
                  height: 40,
                  width: 250,
                  borderColor: 'gray',
                  borderWidth: 1,
                  marginBottom: 10,
                  paddingHorizontal: 10,
                  color: 'white'
                }}
                placeholder='Password'
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <Button title='Sign In' onPress={signInWithEmail} />
              <Button title='Sign Up' onPress={signUpWithEmail} />
              <Button title='Sign in with Google' onPress={signInWithGoogle} />
            </>
          )}
        </>
      )}
    </ThemedView>
  );
}
