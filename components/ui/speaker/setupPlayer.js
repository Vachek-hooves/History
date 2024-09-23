import TrackPlayer, {Capability, State} from 'react-native-track-player';

let isSetup = false;

export const setupPlayer = async () => {
  try {
    // Stop and reset the player if it's already set up
    if (isSetup) {
      await TrackPlayer.reset();
    }

    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      capabilities: [Capability.Play, Capability.Pause],
      compactCapabilities: [Capability.Play, Capability.Pause],
    });

    await TrackPlayer.add({
      id: 'backgroundMusic',
      url: require('../../../assets/music/gameMusic.mp3'),
      title: 'Background Music',
      artist: 'Your App',
    });

    isSetup = true;
    console.log('Track player set up successfully');
    await TrackPlayer.play();
  } catch (error) {
    console.error('Error setting up player:', error);
  }
};

export const toggleBackgroundMusic = async () => {
  const state = await TrackPlayer.getState();
  if (state === State.Playing) {
    await TrackPlayer.pause();
  } else {
    await TrackPlayer.play();
  }
};
