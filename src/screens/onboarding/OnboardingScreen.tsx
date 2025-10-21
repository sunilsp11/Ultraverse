import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, FlatList, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Video from 'react-native-video';


import UvSlide from '../../components/onboarding/uvSlide';
import UvDots from '../../components/onboarding/uvDots';
import UvNextButton from '../../components/onboarding/uvNextButton';

const { width, height } = Dimensions.get('window');

type SlideData = {
    id: string;
    title: string;
    description: string;
};

const slides: SlideData[] = [
    {
        id: '1',
        title: 'DIVE INTO THE\nULTIMATE\nGAMING\nEXPERIENCE!',
        description:
            'Join us and master the art of outsmarting through next-gen augmented reality. Compete, explore, and connect – where the real world becomes your gaming arena.',
    },
    {
        id: '2',
        title: 'PLAY\nANYWHERE.\nCONQUER\nEVERYWHERE.',
        description:
            'Turn parks, streets, and public spaces into interactive battlefields. Ultraverse transforms real-world locations into immersive AR zones where skill meets strategy.',
    },
    {
        id: '3',
        title: 'POWER UP\nWITH KRUZER\nCOIN ($KRZ)',
        description:
            'Earn, trade, and level up with the Ultraverse’s native token. Unlock rewards, boost gameplay, and fuel your adventure across the ever‑expanding Ultraverse.',
    },
];

interface Props {
    onDone?: () => void;
}

const OnboardingScreen: React.FC<Props> = ({ onDone }) => {
    const [index, setIndex] = useState(0);
    const listRef = useRef<FlatList<SlideData>>(null);
    const scrollX = useRef(new Animated.Value(0)).current;
    const getStartedAnim = useRef(new Animated.Value(0)).current;

    const handleNext = () => {
        console.log('Next pressed');
        if (index < slides.length - 1) {
            listRef.current?.scrollToIndex({ index: index + 1, animated: true });
            return;
        }
        onDone && onDone();
    };

    useEffect(() => {
        const isLast = index === slides.length - 1;
        if (isLast) {
            Animated.spring(getStartedAnim, {
                toValue: 1,
                useNativeDriver: true,
                friction: 7,
                tension: 80,
            }).start();
        } else {
            getStartedAnim.setValue(0);
        }
    }, [index, getStartedAnim]);

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

            <Video
                source={require('../../assets/videos/onboarding_bg.mp4')}
                style={styles.videoBackground}
                resizeMode="cover"
                repeat
                muted
                paused={false}
                playInBackground={false}
                playWhenInactive={false}
                ignoreSilentSwitch="obey"
            />

            <Image
                source={require('../../assets/images/top_header_logo.png')}
                style={styles.topLogo}
                resizeMode="contain"
            />

            <Animated.FlatList
                ref={listRef}
                data={slides}
                keyExtractor={(s) => s.id}
                renderItem={({ item }) => (
                    <UvSlide title={item.title} description={item.description} />
                )}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                onMomentumScrollEnd={(e) => {
                    const i = Math.round(e.nativeEvent.contentOffset.x / width);
                    setIndex(i);
                }}
                contentContainerStyle={styles.listContent}
            />
       
            <View style={styles.dotsOverlay}>
                <UvDots total={slides.length} index={index} scrollX={scrollX} pageWidth={width} />
            </View>
            <View style={styles.footer}>
                <TouchableOpacity onPress={onDone} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>

                {index < slides.length - 1 ? (
                    <UvNextButton onPress={handleNext} />
                ) : (
                    <Animated.View
                        style={[
                            styles.getStartedAnimWrapper,
                            {
                                opacity: getStartedAnim,
                                transform: [
                                    {
                                        translateY: getStartedAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [12, 0],
                                        }),
                                    },
                                    {
                                        scale: getStartedAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0.95, 1],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    >
                        <View style={styles.getStartedBtnWrapper}>
                            <TouchableOpacity
                                onPress={onDone}
                                style={styles.getStartedBtn}
                                activeOpacity={0.9}
                            >
                                <Text style={styles.getStartedText}>Get Started</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                )}
            </View>
        </View>
    );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    videoBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
    },
    topLogo: {
        position: 'absolute',
        top: 50,
        alignSelf: 'center',
        width: 52,
        height: 40,
        zIndex: 2,
    },
    listContent: {
        flexGrow: 1,
    },
    dotsOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },

    footer: {
        position: 'absolute',
        left: 20,
        right: 20,
        bottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    skipText: {
        color: '#E5E5E5',
        fontSize: 13,
        fontFamily: 'Ronix-Classic',
    },
    getStartedBtn: {
        marginLeft: 'auto',
        paddingHorizontal: 22,
        height: 40,
        borderWidth: 1,
        borderColor: '#FFFFFF',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopRightRadius: 16,
        borderBottomLeftRadius: 16,
    },
    getStartedAnimWrapper: {
        marginLeft: 'auto',
    },
    getStartedText: {
        color: '#111111',
        fontSize: 16,
        fontFamily: 'FormaDJR-Bold',
    },
    getStartedBtnWrapper: {
        height: 48,
        borderWidth: 1,
        borderColor: '#FFFFFF',
        borderTopRightRadius: 16,
        borderBottomLeftRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
        backgroundColor: 'transparent',

    },
});


