
import {
    GridLayout,
    ParticipantTile,
    useTracks,
  } from '@livekit/components-react';
  
  const LiveVideoGrid = () => {
    const tracks = useTracks([]); // Gets all published tracks in room
  
    return (
      <GridLayout tracks={tracks}>
        <ParticipantTile />
      </GridLayout>
    );
  };
  
  export default LiveVideoGrid;
  