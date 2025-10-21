import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import UvTypography from '../../components/common/uvTypography';
import Colors from '../../theme/color';
import UvFormTextInput from '../../components/common/uvFormTextInput';
import UvButton from '../../components/common/uvButton';

interface Props {
    onSubmit?: (email: string) => void;
    onLogin?: () => void;
}

const ForgotPasswordScreen: React.FC<Props> = ({ onSubmit, onLogin }) => {
    const [email, setEmail] = useState('');

    const handleSubmit = () => {
        onSubmit && onSubmit(email);
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
                <UvTypography variant="h3" align="center">FORGOT PASSWORD?</UvTypography>
                <View style={{ height: 8 }} />
                <UvTypography variant="p" color="#D7E7EE" align="center">
                    Enter your email below and we'll send you a link to reset your password.
                </UvTypography>
            </View>

            <View style={styles.form}>
                <UvTypography variant="h6" color={Colors.white} style={{ marginBottom: 8 }}>EMAIL</UvTypography>
                <UvFormTextInput
                    placeholder="Please enter your email address"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    variant="body"
                />

                <View style={{ height: 32 }} />

                <UvButton 
                    onPress={handleSubmit} 
                    title="Submit" 
                />

                <View style={{ height: 24 }} />
                <View style={styles.footerRow}>
                    <UvTypography variant="body" color="#CFE2EA">Remember Password?</UvTypography>
                    <TouchableOpacity onPress={onLogin}>
                        <UvTypography variant="p" color={Colors.white}>
                            {' '}Login Here
                        </UvTypography>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
};

export default ForgotPasswordScreen;

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
    footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
