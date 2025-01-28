import React, { useState, useEffect } from 'react';
import { View, Button, ActivityIndicator } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { getSupabaseClient } from '../../utils/supabase';
import { User } from '@supabase/supabase-js';
import * as QueryParams from 'expo-auth-session/build/QueryParams';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

WebBrowser.maybeCompleteAuthSession();

export default function AccountScreen() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // check if the user is already logged in on component mount
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

    // subscribe to auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

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

  const signInWithGoogle = async () => {
    setLoading(true);
    const supabase = getSupabaseClient();
    try {
      const redirectUri = AuthSession.makeRedirectUri({
        path: 'auth',
      });
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: redirectUri, skipBrowserRedirect: true },
      });

      if (error) throw error;

      // Open the Google Sign-In page
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUri
      );

      if (result.type === 'success') {
        const { url } = result;
        await createSessionFromUrl(url);
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <ThemedView
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      {user ? (
        <>
          <ThemedText>Welcome, {user.email}</ThemedText>
          <Button title='Sign Out' onPress={signOut} />
        </>
      ) : (
        <>
          {loading ? (
            <ActivityIndicator size='large' color='#0000ff' />
          ) : (
            <>
              <Button title='Sign in with Google' onPress={signInWithGoogle} />
            </>
          )}
        </>
      )}
    </ThemedView>
  );
}
