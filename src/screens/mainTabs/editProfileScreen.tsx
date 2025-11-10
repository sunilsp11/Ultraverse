import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  Image,
} from "react-native";
import UvScreenWrapper from "../../components/common/uvScreenWrapper";
import UvTypography from "../../components/common/uvTypography";
import UvFormTextInput from "../../components/common/uvFormTextInput";
import Colors from "../../theme/color";
import UvProfileHeader from "../../components/common/uvProfileHeader";
import UvButton from "../../components/common/uvButton";
import SaveIcon from "../../assets/svg/save.svg";
import CameraIcon from "../../assets/svg/cameraIcon.svg";
import UvHeader from "../../components/common/uvHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Controller, useForm } from "react-hook-form";
import { useChangePasswordMutation } from "../../services/authRequest/authApi";
import { useAppSelector } from "../../store/store";
import {
  useGetProfileQuery,
  useUploadProfilePictureMutation,
} from "../../services/profile/profileApi";
import {
  Asset,
  ImageLibraryOptions,
  CameraOptions,
  launchImageLibrary,
  launchCamera,
} from "react-native-image-picker";

const EditProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const { data: profileData } = useGetProfileQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
  });
  const storedProfile = useAppSelector((state) => state.profile.profile);
  const [isProfileInitialized, setIsProfileInitialized] = useState(false);
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [avatarOverride, setAvatarOverride] = useState<string | null>(null);
  const [uploadProfilePicture, { isLoading: isUploadingPicture }]
    = useUploadProfilePictureMutation();

  const activeProfile = profileData ?? storedProfile ?? null;

  useEffect(() => {
    if (!activeProfile) {
      return;
    }

    const resolvedName = activeProfile.first_name || activeProfile.username || "";
    const resolvedEmail = activeProfile.email || activeProfile.username || "";

    const shouldSyncName =
      !isProfileInitialized ||
      name.length === 0 ||
      name === resolvedName;

    const shouldSyncEmail =
      !isProfileInitialized ||
      email.length === 0 ||
      email === resolvedEmail;

    if (shouldSyncName) {
      setName(resolvedName);
    }

    if (shouldSyncEmail) {
      setEmail(resolvedEmail);
    }

    setIsProfileInitialized(true);
  }, [activeProfile, email, isProfileInitialized, name]);

  const displayName = useMemo(() => {
    const resolvedName = activeProfile?.first_name || activeProfile?.username || name;
    return resolvedName.toUpperCase();
  }, [activeProfile?.first_name, activeProfile?.username, name]);

  const avatarSource = useMemo(() => {
    if (avatarOverride) {
      return { uri: avatarOverride };
    }

    if (activeProfile?.profile_picture_url) {
      return { uri: activeProfile.profile_picture_url };
    }

    return require("../../assets/images/Fortnite.png");
  }, [activeProfile?.profile_picture_url, avatarOverride]);

  const closePicker = useCallback(() => {
    setIsPickerVisible(false);
  }, []);

  const handleUploadAsset = useCallback(
    async (asset: Asset | undefined) => {
      if (!asset || !asset.uri) {
        Alert.alert("Upload failed", "No image selected. Please try again.");
        return;
      }

      try {
        const pendingUri = asset.uri;
        setAvatarOverride(pendingUri);
        const formData = new FormData();
        const nameFromAsset = asset.fileName || `profile-${Date.now()}.jpg`;
        const mimeType = asset.type || "image/jpeg";

        formData.append("profile_picture", {
          uri: asset.uri,
          name: nameFromAsset,
          type: mimeType,
        } as any);

        const result = await uploadProfilePicture(formData).unwrap();
        const resolvedUri = result?.profile_picture_url || pendingUri;
        const cacheBustedUri = resolvedUri
          ? `${resolvedUri}${resolvedUri.includes("?") ? "&" : "?"}cb=${Date.now()}`
          : pendingUri;

        if (cacheBustedUri !== pendingUri) {
          try {
            await Image.prefetch(cacheBustedUri);
          } catch (prefetchError) {
            console.warn("Failed to prefetch profile image", prefetchError);
          }
        }

        setAvatarOverride(cacheBustedUri);
        Alert.alert("Profile updated", "Your profile picture has been updated.");
      } catch (error: any) {
        setAvatarOverride(null);
        const message =
          error?.data?.message ||
          error?.data?.detail ||
          "Unable to update profile picture. Please try again.";
        Alert.alert("Upload failed", message);
      }
    },
    [uploadProfilePicture]
  );

  const handleOpenCamera = useCallback(() => {
    const options: CameraOptions = {
      mediaType: "photo",
      includeBase64: false,
      quality: 0.8,
      saveToPhotos: false,
      presentationStyle: "fullScreen",
      cameraType: "front",
      includeExtra: true,
      maxWidth: 1024,
      maxHeight: 1024,
    };

    if (Platform.OS === "ios") {
      (options as any).allowsEditing = true;
    }

    launchCamera(options, (response) => {
      if (response.didCancel) {
        return;
      }

      if (response.errorCode) {
        Alert.alert("Camera error", response.errorMessage || "Unable to open camera.");
        return;
      }

      closePicker();
      const asset = response.assets?.[0];
      handleUploadAsset(asset);
    });
  }, [closePicker, handleUploadAsset]);

  const handleOpenLibrary = useCallback(() => {
    const options: ImageLibraryOptions = {
      mediaType: "photo",
      selectionLimit: 1,
      includeBase64: false,
      quality: 0.8,
      includeExtra: true,
      presentationStyle: "fullScreen",
      maxWidth: 2048,
      maxHeight: 2048,
    };

    if (Platform.OS === "ios") {
      (options as any).allowsEditing = true;
    }

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        return;
      }

      if (response.errorCode) {
        Alert.alert("Gallery error", response.errorMessage || "Unable to open gallery.");
        return;
      }

      closePicker();
      const asset = response.assets?.[0];
      handleUploadAsset(asset);
    });
  }, [closePicker, handleUploadAsset]);

  type ChangePasswordFormData = {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  };

  const {
    control,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  const newPasswordValue = watch("newPassword");

  const onSubmit = async (data: ChangePasswordFormData) => {
    if (isLoading) return;

    const token = await AsyncStorage.getItem("UserToken");

    if (!token) {
      Alert.alert("Unable to change password", "User session not found. Please login again.");
      return;
    }

    try {
      clearErrors("oldPassword");

      await changePassword({
        token,
        old_password: data.oldPassword,
        new_password: data.newPassword,
      }).unwrap();

      Alert.alert("Password updated", "Your password has been changed successfully.");
      reset();
    } catch (error: any) {
      const oldPasswordError = error?.data?.old_password?.[0];

      if (oldPasswordError) {
        setError("oldPassword", {
          type: "server",
          message: oldPasswordError,
        });
      }

      if (!oldPasswordError) {
        Alert.alert(
          "Password update failed",
          error?.data?.message || "Please verify your current password and try again."
        );
      }
    }
  };

  return (
    <UvScreenWrapper>
      <View style={styles.container}>
        <UvHeader 
          title="EDIT PROFILE" 
          titleVariant="h4"
          containerStyle={styles.headerContainer}
        />

        <View style={{ height: 51 }} />
        <ScrollView showsVerticalScrollIndicator={false} automaticallyAdjustKeyboardInsets={true} style={styles.scrollView}>
          <UvProfileHeader
            avatarSource={avatarSource}
            name={displayName}
            email={email}
            onEditPress={() => setIsPickerVisible(true)}
            editIcon={<CameraIcon width={32} height={32} color={Colors.black} />}
          />

          <View style={{ height: 32 }} />

          <UvTypography variant="h7" color={Colors.base[50]} style={styles.sectionTitle}>
            PERSONAL INFO
          </UvTypography>
          <View style={{ height: 12 }} />
          <UvFormTextInput value={name} onChangeText={setName} placeholder="Mike Smith" />
          <View style={{ height: 12 }} />
          <UvFormTextInput value={email} onChangeText={setEmail} placeholder="mike_smith@mail.com" keyboardType="email-address" />

          <View style={{ height: 32 }} />

          <UvTypography variant="h7" color={Colors.base[50]} style={styles.sectionTitle}>
            CHANGE PASSWORD
          </UvTypography>
          <View style={{ height: 12 }} />
          <View style={{paddingBottom: 32}}>
            <Controller
              control={control}
              name="oldPassword"
              rules={{
                required: "Current password is required",
                validate: v => (!!v && v.trim().length > 0) || "Current password is required",
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <UvFormTextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Enter current password"
                    showPasswordToggle
                    autoCapitalize="none"
                  />
                  {errors.oldPassword && (
                    <UvTypography variant="bodyXs" color={Colors.danger[400]}>
                      {errors.oldPassword.message}
                    </UvTypography>
                  )}
                </>
              )}
            />

            <View style={{ height: 12 }} />

            <Controller
              control={control}
              name="newPassword"
              rules={{
                required: "New password is required",
                minLength: { value: 8, message: "Password must be at least 8 characters" },
                validate: {
                  hasUpper: v => /[A-Z]/.test(v) || "Include at least one uppercase letter",
                  hasLower: v => /[a-z]/.test(v) || "Include at least one lowercase letter",
                  hasNum: v => /[0-9]/.test(v) || "Include at least one number",
                  hasSpecial: v => /[!@#$%^&*(),.?":{}|<>\[\]_+=\-]/.test(v) || "Include at least one special character",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <UvFormTextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Create new password"
                    showPasswordToggle
                    autoCapitalize="none"
                  />
                  {errors.newPassword && (
                    <UvTypography variant="bodyXs" color={Colors.danger[400]}>
                      {errors.newPassword.message}
                    </UvTypography>
                  )}
                </>
              )}
            />

            <View style={{ height: 12 }} />

            <Controller
              control={control}
              name="confirmPassword"
              rules={{
                required: "Please confirm your new password",
                validate: v => v === newPasswordValue || "Passwords do not match",
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <UvFormTextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Confirm new password"
                    showPasswordToggle
                    autoCapitalize="none"
                  />
                  {errors.confirmPassword && (
                    <UvTypography variant="bodyXs" color={Colors.danger[400]}>
                      {errors.confirmPassword.message}
                    </UvTypography>
                  )}
                </>
              )}
            />
          </View>
        </ScrollView>

        <View style={styles.bottomButtonContainer}>
          <UvButton
            title="Save"
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            icon={<SaveIcon width={20} height={20} color={Colors.base[950]} />}
            iconPosition="left"
          />
        </View>
      </View>

      <Modal
        visible={isPickerVisible}
        transparent
        animationType="fade"
        onRequestClose={closePicker}
      >
        <TouchableWithoutFeedback onPress={closePicker}>
          <View style={styles.modalBackdrop}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalSheet}>
                <View style={styles.modalHandle} />
                <UvTypography variant="h6" align="center" style={styles.modalTitle}>
                  Update Profile Photo
                </UvTypography>
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={handleOpenLibrary}
                  disabled={isUploadingPicture}
                >
                  <UvTypography variant="body" align="center" color={Colors.white}>
                    Upload Photo
                  </UvTypography>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={handleOpenCamera}
                  disabled={isUploadingPicture}
                >
                  <UvTypography variant="body" align="center" color={Colors.white}>
                    Open Camera
                  </UvTypography>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalOption, styles.modalCancel]}
                  onPress={closePicker}
                  disabled={isUploadingPicture}
                >
                  <UvTypography variant="body" align="center" color={Colors.base[100]}>
                    Cancel
                  </UvTypography>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </UvScreenWrapper>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    letterSpacing: 2,
  },

  bottomButtonContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    zIndex: 10,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.base[900],
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    gap: 12,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.base[700],
    alignSelf: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    marginBottom: 8,
    letterSpacing: 1,
  },
  modalOption: {
    backgroundColor: Colors.base[700],
    paddingVertical: 14,
    borderRadius: 14,
  },
  modalCancel: {
    backgroundColor: Colors.base[800],
  },
});


