import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { User } from "@supabase/supabase-js";
import * as AuthSession from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { ArrowRight, Check } from "lucide-react";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Button } from "../components/ui/Button.tsx";
import { Input } from "../components/ui/Input.tsx";
import { getSupabaseClient } from "../utils/supabase";

WebBrowser.maybeCompleteAuthSession();

export default function AccountScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [newUser, setNewUser] = useState(false);
  const [isEditingPhoneNumber, setIsEditingPhoneNumber] = React.useState(false);
  const [isEditingFirstName, setIsEditingFirstName] = React.useState(false);
  const [isEditingLastName, setIsEditingLastName] = React.useState(false);

  // We use a default password with phone sign-in for now to avoid setting up OTP verification for the time being
  const defaultPassword = "5uP@WuJO2$Z3lK";

  const handleNameKeyDown = (e: React.KeyboardEvent, isFirstName: boolean) => {
    if (e.key === "Enter") {
      if (isFirstName) {
        setIsEditingFirstName(false);
      } else {
        setIsEditingLastName(false);
      }
    }
  };

  const handleNameChange = (newName: string, isFirstName: boolean) => {
    if (isFirstName) {
      setFirstName(newName);
    } else {
      setLastName(newName);
    }
  };

  const handlePhoneNumberKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setIsEditingPhoneNumber(false);
      // Sign-in for ease
      signInWithPhone();
    }
  };

  const handlePhoneNumberChange = (newPhone: string) => {
    setPhone(newPhone);
  };

  // Check if user is already logged in on component mount.
  useEffect(() => {
    const supabase = getSupabaseClient();

    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.log("Error fetching user:", error);
        return;
      }
      setUser(data?.user || null);
    };

    fetchUser();

    // Subscribe to auth state changes.
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setNewUser(false);
      setPhone("");
      setFirstName("");
      setLastName("");
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      router.push("./portal");
    }
  }, [user]);

  // useFocusEffect to force redirection even on nav click
  /*
  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        router.push("./capsules");
      }
    }, [user])
  );
  */

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
      const redirectUri = AuthSession.makeRedirectUri({ path: "auth" });
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: redirectUri, skipBrowserRedirect: true },
      });
      if (error) throw error;
      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);
      if (result.type === "success") {
        await createSessionFromUrl(result.url);
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
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
      console.error("Email Sign-In Error:", error);
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
      console.log("Sign-up successful, please verify your email.");
    } catch (error) {
      console.error("Email Sign-Up Error:", error);
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
      console.error("Phone Sign-In Error:", error);
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
    const fullName = `${autoCapitalizedFirstName} ${autoCapitalizedLastName}`;

    try {
      const { data, error } = await supabase.auth.signUp({
        phone: phone,
        password: defaultPassword,
        options: {
          data: {
            first_name: autoCapitalizedFirstName,
            last_name: autoCapitalizedLastName,
            name: fullName,
          },
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Phone Sign-Up Error:", error);
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
    if (input.length == 0) {
      return input;
    } else if (input.length == 1) {
      return input.charAt(0).toUpperCase();
    } else if (input.length > 1) {
      return input.charAt(0).toUpperCase() + input.slice(1);
    }
  };

  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      {user ? (
        <>
          <ThemedText style={{ marginVertical: 20 }}>Welcome, {user.user_metadata.name}!</ThemedText>
        </>
      ) : (
        <>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <>
              {newUser ? (
                <View style={{ flexDirection: 'column', alignItems: 'center', width: "100%" }}>
                  <ThemedText style={{ fontSize: 25, marginBottom: 5 }}>Create Account</ThemedText>
                  <ThemedText style={{ fontSize: 15, marginBottom: 10 }}>
                    Already a user?
                    <span
                      onClick={() => {
                        setPhone("");
                        setNewUser(false);
                      }}
                      style={{ fontSize: 15, marginLeft: 5, cursor: 'pointer', fontStyle: 'italic', color: '#6f94e5' }}>
                      Sign in here
                    </span>
                  </ThemedText>
                  
                  <Input
                    value={firstName}
                    onChange={(e) => handleNameChange(e.target.value, true)}
                    onBlur={() => setIsEditingLastName(false)}
                    onKeyDown={(e) => handleNameKeyDown(e, true)}
                    placeholder="First Name"
                    autoFocus
                    className="text-xs tracking-wide h-6 py-0 px-1"
                    style={{
                      width: "20%",
                      height: 40,
                      borderColor: "gray",
                      borderWidth: 1,
                      borderRadius: 10,
                      marginTop: 5,
                      marginBottom: 5,
                    }}
                  />

                  <Input
                    value={lastName}
                    onChange={(e) => handleNameChange(e.target.value, false)}
                    onBlur={() => setIsEditingLastName(false)}
                    onKeyDown={(e) => handleNameKeyDown(e, false)}
                    placeholder="Last Name"
                    className="text-xs tracking-wide h-6 py-0 px-1"
                    style={{
                      width: "20%",
                      height: 40,
                      borderColor: "gray",
                      borderWidth: 1,
                      borderRadius: 10,
                      marginTop: 5,
                      marginBottom: 5,
                    }}
                  />

                  <Input
                    value={phone}
                    onChange={(e) => handlePhoneNumberChange(e.target.value)}
                    onBlur={() => setIsEditingPhoneNumber(false)}
                    onKeyDown={handlePhoneNumberKeyDown}
                    placeholder="Phone Number"
                    className="text-xs tracking-wide h-6 py-0 px-1"
                    style={{
                      width: "20%",
                      height: 40,
                      borderColor: "gray",
                      borderWidth: 1,
                      borderRadius: 10,
                      marginTop: 5,
                      marginBottom: 5,
                    }}
                  />

                  <Button
                    onClick={signUpWithPhone}
                    className="mt-3 group relative overflow-hidden rounded-full px-6 py-2 shadow-md transition-all duration-300 hover:shadow-lg"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-90 transition-opacity group-hover:opacity-100"></span>
                    <span className="relative flex items-center justify-center text-white">
                      <Check className="mr-2 h-4" />
                      Sign Up
                    </span>
                  </Button>
                </View>
              ) : (
                <View style={{ flexDirection: 'column', alignItems: 'center', width:"100%", marginBottom: 150}}>
                  <ThemedText style={{ fontSize: 25, marginBottom: 5 }}>Sign In</ThemedText>
                  <ThemedText style={{ fontSize: 15, marginBottom: 5 }}>
                    First time here?
                    <span
                      onClick={() => {
                        setPhone("");
                        setNewUser(true);
                      }}
                      style={{ fontSize: 15, marginLeft: 5, cursor: 'pointer', fontStyle: 'italic', color: '#6f94e5' }}>
                      Create account
                    </span>
                  </ThemedText>
                
                  <View style={{ flexDirection: 'row', alignItems: 'center', width: "20%" }}>
                    <Input
                      value={phone}
                      onChange={(e) => handlePhoneNumberChange(e.target.value)}
                      onBlur={() => setIsEditingPhoneNumber(false)}
                      onKeyDown={handlePhoneNumberKeyDown}
                      autoFocus
                      placeholder="Phone Number"
                      className="text-xs tracking-wide h-6 py-0 px-1"
                      style={{
                        height: 40,
                        borderColor: "gray",
                        borderWidth: 1,
                        borderRadius: 10,
                        marginTop: 5,
                        marginBottom: 5,
                      }}
                    />

                    <Button
                      onClick={signInWithPhone}
                      className="mb-3 ml-2 mt-3 group relative overflow-hidden rounded-full px-6 py-2 shadow-md transition-all duration-300 hover:shadow-lg"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-90 transition-opacity group-hover:opacity-100">
                        <span className="mt-3 text-white relative flex items-center justify-center text-white">
                          <ArrowRight />
                        </span>
                      </span>  
                    </Button>
                  </View>
              </View>
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
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: "gray",
  },
});
