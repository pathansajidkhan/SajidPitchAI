import * as React from "react"
import { storiesOf } from "@storybook/react-native"
import { StoryScreen, Story, UseCase } from "../../../storybook/views"
import { PlayerControls } from "./playercontrol"

declare var module

storiesOf("Playercontrol", module)
  .addDecorator(fn => <StoryScreen>{fn()}</StoryScreen>)
  .add("Style Presets", () => (
    <Story>
      <UseCase text="Primary" usage="The primary.">
      <PlayerControls
                onPlay={ null}
                onPause={null}
                playing={null}
                showPreviousAndNext={false}
                showSkip={false}
                
              />
      </UseCase>
    </Story>
  ))
