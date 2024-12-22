// TODO: add resetPassword, newPassword, verifyEmail, and updateEmail functions
// TODO: add the following error types:
//    incorrect email
//    incorrect password
//    passwords don't match
//    invalid email
//    email doesn't exist
//    account exists with <oauth-provider>

import { useNavigation } from "@react-navigation/native";
import { toast } from "sonner-native";
import { FormData } from "@/hooks/types";

import pb from "@root/pocketbase.config";
import * as WebBrowser from "expo-web-browser";
import EventSource from "react-native-sse";
import "react-native-url-polyfill/auto";

global.EventSource = EventSource;

export function useAuth() {
  const navigation = useNavigation();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  async function isValidUsername(username: string) {
    const collection = "users";
    const filter = `name="${username}"`;
    const records = await pb.collection(collection).getList(1, 1, { filter });

    return records.totalItems === 0;
  }

  function isValidEmail(email: string) {
    if (emailRegex.test(email) === true) {
      return true;
    }

    toast.error("Your email's invalid. Try again!", {
      onAutoClose: () => console.log("Auto-closed!"),
      onDismiss: () => console.log("Manually dismissed!"),
    });
    console.log(email);

    return false;
  }

  // function isValidPassword(password: string, passwordConfirm: string) {
  //     if (password !== passwordConfirm) {
  //         toast.error("Passwords don't match", {
  //         onAutoClose: () => console.log('Auto-closed!'),
  //         onDismiss: () => console.log('Manually dismissed!'),
  //         });
  //         return false;
  //     } else if (password.length < 8) {
  //         toast.error("Password must be at least 8 characters", {
  //         onAutoClose: () => console.log('Auto-closed!'),
  //         onDismiss: () => console.log('Manually dismissed!'),
  //         });
  //
  //         return false;
  // }
  //
  //     console.log(password, passwordConfirm);
  //
  //     return true;
  // }

  async function handleSignUp(formData: FormData): Promise<void> {
    // const match = nameRegex.exec(email);
    if (
      isValidEmail(
        formData.email,
      ) /* && isValidPassword(userData.password, userData.passwordConfirm) */
    ) {
      try {
        await pb.collection("users").create(formData);
        navigation.navigate("Home");
      } catch (error: any) {
        toast.error(error.message.toString(), {
          onAutoClose: () => console.log("Auto-closed!"),
          onDismiss: () => console.log("Manually dismissed!"),
        });
      }
    }

    console.log(formData);
  }

  async function handleSignIn(formData: FormData): Promise<void> {
    try {
      let authData;

      if (isValidEmail(formData.email)) {
        authData = await pb
          .collection("users")
          .authWithPassword(formData.email, formData.password);
      } else {
        const filter = `email="${formData.email}"`;
        const records = await pb.collection("users").getList(1, 1, { filter });

        if (records.totalItems === 0) {
          throw new Error("Username or Email is invalid.");
        }
      }

      navigation.navigate("Home");

      return authData;
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  async function handleOAuth(provider: string): Promise<void> {
    try {
      const authData = await pb.collection("users").authWithOAuth2({
        provider: provider,
        urlCallback: (url) => {
          console.log("Opening URL: ", url);
          WebBrowser.openAuthSessionAsync(url).catch((err) => {
            console.log("failed to open url", err);
          });
        },
      });
      navigation.navigate("Home");

      const { meta } = authData;
      const OAuthData = {
        name: meta?.name,
        email: meta?.email,
        avatarURL: meta?.avatarURL,
      };

      await pb.collection("users").update(authData.record.id, OAuthData);
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  async function handleSignOut(): Promise<void> {
    pb.authStore.clear();
    navigation.popToTop();
  }

  return {
    isValidUsername,
    isValidEmail,
    handleSignUp,
    handleSignIn,
    handleOAuth,
    handleSignOut,
  };
}
