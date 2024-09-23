import TrackPlayer, {Capability, State} from 'react-native-track-player';

let isPlayerInitialized = false;
let initializationPromise = null;

export const setupPlayer = async () => {
  if (isPlayerInitialized) {
    return;
  }

  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = new Promise(async (resolve, reject) => {
    try {
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

      isPlayerInitialized = true;
      console.log('Track player set up successfully');
      resolve();
    } catch (error) {
      console.error('Error setting up player:', error);
      reject(error);
    } finally {
      initializationPromise = null;
    }
  });

  return initializationPromise;
};

export const playBackgroundMusic = async () => {
  if (!isPlayerInitialized) {
    await setupPlayer();
  }
  await TrackPlayer.play();
};

export const resetPlayer = async () => {
  if (!isPlayerInitialized) {
    return;
  }

  try {
    await TrackPlayer.stop();
    await TrackPlayer.reset();
    isPlayerInitialized = false;
    console.log('Track player reset successfully');
  } catch (error) {
    console.error('Error resetting player:', error);
  }
};

export const toggleBackgroundMusic = async () => {
  if (!isPlayerInitialized) {
    await setupPlayer();
  }

  try {
    const state = await TrackPlayer.getState();
    if (state === State.Playing) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  } catch (error) {
    console.error('Error toggling background music:', error);
  }
};
