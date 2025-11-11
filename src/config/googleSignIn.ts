import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import { Platform } from "react-native";

const WEB_CLIENT_ID =
  "73144482765-8hae40v2iqrhq4dv7etjn3ni7mlv7lmr.apps.googleusercontent.com";
const IOS_CLIENT_ID = "";

export type GoogleSignInResult = {
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

export function configureGoogleSignIn() {
  const config: Parameters<typeof GoogleSignin.configure>[0] = {
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
    const tokens = await GoogleSignin.getTokens();

    const wrapped = (userInfo as any)?.data;
    const rawUser = wrapped?.user ?? userInfo?.user ?? null;

    return {
      idToken:
        wrapped?.idToken ?? userInfo?.idToken ?? tokens?.idToken ?? null,
      accessToken:
        wrapped?.accessToken ?? tokens?.accessToken ?? null,
      serverAuthCode:
        wrapped?.serverAuthCode ?? userInfo?.serverAuthCode ?? null,
      scopes: wrapped?.scopes ?? userInfo?.scopes ?? [],
      user: rawUser
        ? {
            id: rawUser.id,
            email: rawUser.email,
            name: rawUser.name,
            familyName: rawUser.familyName,
            givenName: rawUser.givenName,
            photo: rawUser.photo,
          }
        : null,
    };
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
