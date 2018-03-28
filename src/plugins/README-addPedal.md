# \<Create your own pedal>

Line to follow to create your personnal pedal compatible with the pedalboard

## The effect

You can both use an effect from the library **EffectLib.html** or create your own web-audio graph and connect it to the global one in an html pedal file.

## Structure of the pedal
### Global structure
In the pedalboard we include html files to add a pedal as a plugin. So to create a new one you need to add an html file which will contain the html/css/js code as a Polymer web-component.
### Js Structure
You have to extends from class "mymixin" present in the file **pedalBehavior.html** and implements the methods:
```
createAllInternNodes(){} // instanciate the effect
connectInternNodes(){} // connect to its i/o nodes
setKnobsListeners(){} // add listeners on you web audio controles
getDefaultButtonsValues(){}
bypass(){}
reactivate(){}
```
### Html Structure 
Start from this template and customize the style and disposition of the pedal
```
<dom-module id="id-pedal">
  <template>
    <style include="shared-styles"></style>
    <div class="laPedale">
      <div class="elements">
        <div class="row">
          <div class="column">
          <!-- here put your web audio controls-->
           <!-- for example <webaudio-knob id="knob1" class="knob" src="button.png"
              data-role="role"></webaudio-knob>-->
            <span class="knob-label" id="knob1-label">Name</span>
          </div>
        <div class="row">
          <div class="column">
            <webaudio-switch midilearn="true" src="switch_1.png" class="switch" id="switch1" width="40" height="25"></webaudio-switch>
          </div>
        </div>

        <div class="row">
          <div class="column">
            <span class="pedalLabel">PedalName</span>
          </div>
        </div>
      </div>
    </div>e
  </template>
```

## Add it to the pedal board

There is several actions that currently are not automated. You manually have to add into the **pedal-board.html** file :

 - In the `div_app_tabs` an input and label for your pedal
 - In the `div_container`a draggable div with the appropriate class and its block of css (link the image to drag on the pedalboard)
 - in the `dropPedalHandler()`create an unique id for the pedal

### Now you can drag your pedal on the board and connect it