declare module 'react-native-video-controls' {
  import { Component } from 'react'
  import { StyleProp, ViewStyle, ImageSourcePropType } from 'react-native'
  import { OnLoadData, OnProgressData, OnSeekData, OnBufferData } from 'react-native-video'

  export interface VideoControlsProps {
    source: { uri: string } | number
    style?: StyleProp<ViewStyle>
    resizeMode?: 'stretch' | 'contain' | 'cover' | 'none'
    repeat?: boolean
    paused?: boolean
    muted?: boolean
    volume?: number
    rate?: number
    playInBackground?: boolean
    playWhenInactive?: boolean
    ignoreSilentSwitch?: 'inherit' | 'ignore' | 'obey'
    progressUpdateInterval?: number
    
    // Video Controls specific props
    tapAnywhereToPause?: boolean
    toggleResizeModeOnFullscreen?: boolean
    controlTimeout?: number
    scrubbing?: number
    showOnStart?: boolean
    navigator?: any
    reloadOnResume?: boolean
    disableFullscreen?: boolean
    disableSeekbar?: boolean
    disableVolume?: boolean
    disableTimer?: boolean
    disableBack?: boolean
    
    // Poster/Thumbnail
    poster?: string
    posterResizeMode?: 'stretch' | 'contain' | 'cover' | 'none'
    
    // Callbacks
    onEnterFullscreen?(): void
    onExitFullscreen?(): void
    onHideControls?(): void
    onShowControls?(): void
    onError?(error: any): void
    onPause?(): void
    onPlay?(): void
    onBack?(): void
    onEnd?(): void
    onLoad?(data: OnLoadData): void
    onLoadStart?(): void
    onProgress?(data: OnProgressData): void
    onSeek?(data: OnSeekData): void
    onBuffer?(data: OnBufferData): void
    onTimedMetadata?(metadata: any): void
  }

  export default class VideoControls extends Component<VideoControlsProps> {}
}

