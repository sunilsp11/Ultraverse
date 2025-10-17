import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Text from '../../components/common/Typography';
import Colors from '../../theme/color';
import FormTextInput from '../../components/common/FormTextInput';

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
            <View style={styles.header}>
                <Image
                    source={require('../../assets/images/top_header_logo.png')}
                    style={styles.topLogo}
                    resizeMode="contain"
                />
                <Text variant="h3" align="center">LOGIN</Text>
                <View style={{ height: 8 }} />
                <Text variant="p" color="#D7E7EE" align="center">
                    Enter your email below to login to your account.
                </Text>
            </View>

            <View style={styles.form}>
                <Text variant="h6" color={Colors.white}>EMAIL</Text>
                <FormTextInput
                    placeholder="Please enter your email address"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    variant="body"
                />

                <View style={{ height: 16 }} />

                <Text variant="h6" color={Colors.white}>PASSWORD</Text>
                <FormTextInput
                    placeholder="Please enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    variant="body"
                />

                <TouchableOpacity onPress={onForgot} style={styles.forgotBtn}>
                    <Text variant="body" color="#D7E7EE">Forgot Password?</Text>
                </TouchableOpacity>

                <View style={{ height: 16 }} />

                <View style={styles.ctaOuter}>
                    <TouchableOpacity style={styles.ctaInner} onPress={handleLogin} activeOpacity={0.9}>
                        <Text variant="body" color="#111111" align="center">Login</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.orRow}>
                    <View style={styles.divider} />
                    <Text variant="body" color="#CFE2EA">or continue with</Text>
                    <View style={styles.divider} />
                </View>

                <View style={styles.socialRow}>
                    <View style={styles.socialCircle}>
                        <Text color="#0F5270">G</Text>
                    </View>
                    <View style={styles.socialCircle}>
                        <Text color="#0F5270">f</Text>
                    </View>
                </View>

                <View style={{ height: 24 }} />
                <View style={styles.footerRow}>
                    <Text variant="body" color="#CFE2EA">Don't have account?</Text>
                    <TouchableOpacity onPress={onRegister}>
                        <Text variant="body" color={Colors.white}>
                            {' '}Register Here
                        </Text>
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
    },
    inputWrapper: {},
    input: {},
    forgotBtn: {
        alignSelf: 'flex-end',
        marginTop: 24,
    },
    ctaOuter: {
        alignSelf: 'center',
        marginTop: 32,
        height: 48,
        borderWidth: 1,
        borderColor: Colors.white,
        borderTopRightRadius: 16,
        borderBottomLeftRadius: 16,
        padding: 4,
    },
    ctaInner: {
        height: 40,
        width: width * 0.6,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: '#DDE6EA',
        borderTopRightRadius: 16,
        borderBottomLeftRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
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
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});


