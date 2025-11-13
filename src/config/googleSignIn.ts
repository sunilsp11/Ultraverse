import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import { Platform } from "react-native";
import Config from "react-native-config";

const WEB_CLIENT_ID =
  Config.GOOGLE_SIGNIN_WEB_CLIENT_ID ??
  "73144482765-8hae40v2iqrhq4dv7etjn3ni7mlv7lmr.apps.googleusercontent.com";
const IOS_CLIENT_ID =
  Config.GOOGLE_SIGNIN_IOS_CLIENT_ID ??
  "73144482765-6j5s7c2otv4i9mp6qa02pk8stcalcdce.apps.googleusercontent.com";

export type GoogleSignInResult = {
  data: { idToken: string; };
  idToken: string | null;
  accessToken: string | null;
  serverAuthCode: string | null;
  scopes: string[];
  user: {
    id: string;
    email?: string | null;
    name?: string | null;
    familyName?: string | null;
    givenName?: string | null;
    photo?: string | null;
  } | null;
};

type GoogleSigninConfigureParams = Parameters<
  typeof GoogleSignin.configure
>[0] & { iosClientId?: string };

export function configureGoogleSignIn() {
  const config: GoogleSigninConfigureParams = {
    webClientId: WEB_CLIENT_ID,
    offlineAccess: true,
    forceCodeForRefreshToken: true,
  };

  if (Platform.OS === "ios" && IOS_CLIENT_ID) {
    config.iosClientId = IOS_CLIENT_ID;
  }

  GoogleSignin.configure(config);
}

export async function signInWithGoogle(): Promise<GoogleSignInResult | null> {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const userInfo = await GoogleSignin.signIn();
return userInfo as any;
  } catch (error: any) {
    if (error?.code === statusCodes.SIGN_IN_CANCELLED) {
      return null;
    }

    if (error?.code === statusCodes.IN_PROGRESS) {
      return null;
    }

    if (error?.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      throw new Error(
        "Google Play Services is not available or needs to be updated."
      );
    }

    throw error;
  }
}

export async function signOutGoogle() {
  try {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
  } catch (err) {
    console.warn("[GoogleSignIn] Failed to sign out:", err);
  }
}
