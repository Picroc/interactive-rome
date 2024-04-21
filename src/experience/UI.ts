import NextButton from '../html-ui/NextButton';
import Experience from './Experience';

export default class UI {
  static nextButtonActions: {
    action: (experience: Experience, onDone: () => void) => void;
  }[] = [
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

  experience: Experience;

  mainContainer: HTMLDivElement;

  nextButton: NextButton;

  currentAction = 0;
  isAnimating = false;

  constructor() {
    this.experience = Experience.getInstance();

    this.setUi();
  }

  setUi() {
    this.mainContainer = document.createElement('div');

    this.mainContainer.style.display = 'flex';
    this.mainContainer.style.flexDirection = 'row';
    this.mainContainer.style.justifyContent = 'end';

    this.mainContainer.style.position = 'fixed';
    this.mainContainer.style.width = '100%';
    this.mainContainer.style.height = '100%';

    this.nextButton = new NextButton();
    this.nextButton.setButtonText('>');
    this.nextButton.appendTo(this.mainContainer);
    this.nextButton.onClick(this.triggerNextAction);

    document.querySelector('body')?.appendChild(this.mainContainer);
  }

  triggerNextAction = () => {
    const action = UI.nextButtonActions[this.currentAction];
    if (action) {
      this.isAnimating = true;
      this.nextButton.disable();
      action.action(this.experience, () => {
        this.currentAction++;
        this.isAnimating = false;
        this.nextButton.enable();
      });
    }
  };
}
