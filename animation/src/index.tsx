import {Composition, registerRoot} from 'remotion';
import {WhatIsGenAI} from './WhatIsGenAI';

const Root = () => (
  <Composition id="WhatIsGenAI" component={WhatIsGenAI} durationInFrames={660} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
