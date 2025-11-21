import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Dimensions,
  FlatList,
  Image,
  ImageSourcePropType,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from 'react-native'
import Colors from '../../theme/color'
import UvButton from './uvButton'
import UvTypography from './uvTypography'

export type GalleryImageItem = {
  id: string
  source: ImageSourcePropType
  title?: string | null
}

type UvImageGalleryModalProps = {
  visible: boolean
  images: GalleryImageItem[]
  initialIndex: number
  onClose: () => void
  onIndexChange: (index: number) => void
}

const SLIDE_WIDTH = Dimensions.get('window').width - 32

const UvImageGalleryModal: React.FC<UvImageGalleryModalProps> = ({
  visible,
  images,
  initialIndex,
  onClose,
  onIndexChange,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const flatListRef = useRef<FlatList<GalleryImageItem>>(null)

  useEffect(() => {
    if (!visible || !images.length) {
      return
    }

    const clampedIndex = Math.min(initialIndex, images.length - 1)
    setCurrentIndex(clampedIndex)
    onIndexChange(clampedIndex)

    requestAnimationFrame(() => {
      flatListRef.current?.scrollToIndex({
        index: clampedIndex,
        animated: false,
      })
    })
  }, [images.length, initialIndex, onIndexChange, visible])

  const handleMomentumEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, layoutMeasurement } = event.nativeEvent
      const newIndex = Math.round(contentOffset.x / layoutMeasurement.width)
      setCurrentIndex(newIndex)
      onIndexChange(newIndex)
    },
    [onIndexChange],
  )

  if (!images.length) {
    return null
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <FlatList
          ref={flatListRef}
          data={images}
          horizontal
          keyExtractor={item => item.id}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.slide}>
              <Image source={item.source} style={styles.image} resizeMode="contain" />

            </View>
          )}
          onMomentumScrollEnd={handleMomentumEnd}
          getItemLayout={(_, index) => ({
            length: SLIDE_WIDTH,
            offset: SLIDE_WIDTH * index,
            index,
          })}
        />
        <View style={styles.indicator}>
          <UvTypography variant="body" color={Colors.white}>
            {`${currentIndex + 1} / ${images.length}`}
          </UvTypography>
        </View>
        <UvButton title="Close" variant="primary" style={styles.closeButton} onPress={onClose} />
      </View>
    </Modal>
  )
}

export default UvImageGalleryModal

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  slide: {
    width: SLIDE_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  image: {
    width: '100%',
    height: Dimensions.get('window').height * 0.65,
  },
  caption: {
    marginTop: 12,
    textAlign: 'center',
  },
  indicator: {
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  closeButton: {
    marginTop: 24,
  },
})

