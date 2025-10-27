import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Dimensions, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import UvTypography from '../../components/common/uvTypography';
import Colors from '../../theme/color';
import UvFormTextInput from '../../components/common/uvFormTextInput';
import UvButton from '../../components/common/uvButton';

const { width } = Dimensions.get('window');

interface Props {
    onLogin?: (email: string) => void;
    onRegister?: () => void;
    onForgot?: () => void;
}

const LoginScreen: React.FC<Props> = ({ onLogin, onRegister, onForgot }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        onLogin && onLogin(email);
    };

    return (
        <LinearGradient
            colors={['#05273A', '#0F5270']}
            start={{ x: 0.5, y: 0.0 }}
            end={{ x: 0.5, y: 1.0 }}
            style={styles.container}
        >
              <StatusBar translucent backgroundColor="transparent" />
            <View style={styles.header}>
                <Image
                    source={require('../../assets/images/top_header_logo.png')}
                    style={styles.topLogo}
                    resizeMode="contain"
                />
                <UvTypography variant="h3" align="center">LOGIN</UvTypography>
                <View style={{ height: 8 }} />
                <UvTypography variant="p" color="#D7E7EE" align="center">
                    Enter your email below to login to your account.
                </UvTypography>

                
            </View>

            <View style={styles.form}>
                <View style={styles.formContent}>
                    <UvTypography variant="h6" color={Colors.white} style={{ marginBottom: 8 }}>EMAIL</UvTypography>
                    <UvFormTextInput
                        placeholder="Please enter your email address"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        variant="body"
                    />

                    <View style={{ height: 16 }} />

                    <UvTypography variant="h6" color={Colors.white} style={{ marginBottom: 8 }}>PASSWORD</UvTypography>
                    <UvFormTextInput
                        placeholder="Please enter your password"
                        value={password}
                        onChangeText={setPassword}
                        showPasswordToggle={true}
                        autoCapitalize="none"
                        variant="body"
                    />

                    <TouchableOpacity onPress={onForgot} style={styles.forgotBtn}>
                        <UvTypography variant="p" color="#D7E7EE">Forgot Password?</UvTypography>
                    </TouchableOpacity>

                    <View style={{ height: 16 }} />

                    <UvButton 
                        onPress={handleLogin} 
                        title="Login" 
                    />

                    <View style={styles.orRow}>
                        <View style={styles.divider} />
                        <UvTypography variant="bodyXs" color="#CFE2EA">or continue with</UvTypography>
                        <View style={styles.divider} />
                    </View>

                    <View style={styles.socialRow}>
                        <View style={styles.socialCircle}>
                            <UvTypography color="#0F5270">G</UvTypography> 
                        </View>
                        <View style={styles.socialCircle}>
                            <UvTypography color="#0F5270">f</UvTypography>
                        </View>
                    </View> 
                </View>

                <View style={styles.footerRow}>
                    <UvTypography variant="body" color="#CFE2EA">Don't have account?</UvTypography>
                    <TouchableOpacity onPress={onRegister}>
                        <UvTypography variant="p" color={Colors.white}>
                            {' '}Register Here
                        </UvTypography>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 48,
    },
    topLogo: {
        alignSelf: 'center',
        width: 52,
        height: 40,
        marginBottom: 32,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    form: {
        flex: 1,
        justifyContent: 'space-between',
    },
    formContent: {
        flex: 1,
    },
    inputWrapper: {},
    input: {},
    forgotBtn: {
        alignSelf: 'flex-end',
        marginTop: 24,
    },
    orRow: {
        marginTop: 26,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#91B4C3',
    },
    socialRow: {
        marginTop: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 22,
    },
    socialCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.black,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 24,
        paddingBottom: 24,
    },
});


