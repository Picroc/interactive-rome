import { Component, createSignal } from 'solid-js';
import { CircularButton } from '../CircularButton/CircularButton';

import Experience from '../../experience/Experience';

interface Action {
  action: (experience: Experience, onDone: () => void) => void;
}

const actions: Action[] = [
  {
    action: (experience, onDone) => {
      experience.scenes.intro.setForDown();
      experience.camera.animate('down', () => {
        experience.scenes.intro.animateDown(() => {
          onDone();
        });
      });
    }
  },
  {
    action(experience, onDone) {
      experience.scenes.intro.skullComponent.playWakeUpAnimation(() => {
        onDone();
      });
    }
  },
  {
    action(experience, onDone) {
      experience.scenes.intro.skullComponent.playMovingAnimation(() => {
        onDone();
      });
    }
  },
  {
    action: (experience, onDone) => {
      experience.scenes.intro.animateUp(() => {
        experience.transitionToScene(experience.scenes.map, onDone);
      });
    }
  }
];

export const ActionTrigger: Component = () => {
  const experience = Experience.getInstance();

  const [isAnimating, setIsAnimating] = createSignal(false);
  const [currentAction, setCurrentAction] = createSignal(0);

  const triggerNextAction = () => {
    if (isAnimating()) {
      return;
    }

    setIsAnimating(true);

    const action = actions[currentAction()];

    if (action) {
      action.action(experience, () => {
        setCurrentAction((prev) => prev + 1);
        setIsAnimating(false);
      });
    }
  };

  return (
    <CircularButton
      text=">"
      onClick={triggerNextAction}
      disabled={isAnimating()}
    />
  );
};
