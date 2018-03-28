// webDX7 (WAM)
// Jari Kleimola 2017 (jari@webaudiomodules.org)

class DX7 extends WAMController
{
  constructor (actx, options) {
    options = options || {};
    options.numberOfInputs  = 0;
    options.numberOfOutputs = 1;
    options.outputChannelCount = [1];

    super(actx, "DX7", options);
  }
  
  static importScripts (actx) {
    return new Promise( (resolve) => {
      actx.audioWorklet.addModule("/src/pedal-board/webdx7-master2/dist/dx7/wasm/dx7.wasm.js").then(() => {
      actx.audioWorklet.addModule("/src/pedal-board/webdx7-master2/dist/dx7/wasm/loader.js").then(() => {
      actx.audioWorklet.addModule("/src/pedal-board/webdx7-master2/dist/wamsdk/wam-processor.js").then(() => {
      actx.audioWorklet.addModule("/src/pedal-board/webdx7-master2/dist/dx7/dx7-awp.js").then(() => {
        setTimeout( function () { resolve(); }, 500);
      }) }) }) });      
    })
  }
}
