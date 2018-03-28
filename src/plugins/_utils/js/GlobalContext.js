(function (root) {

    'use strict';
    var GlobalContext = {};
    var commonJS = typeof module === "object" && module.exports;
    var amd = typeof define === "function" && define.amd;

    if (commonJS)
      module.exports = GlobalContext;
    else if (amd)
      define([], GlobalContext);
    else
      root.GlobalContext = GlobalContext;

    var AudioContext = root.AudioContext || root.webkitAudioContext;
    GlobalContext.context = new AudioContext;
    //GlobalContext.soundNodeIn=GlobalContext.context.createGain();
    //GlobalContext.soundNodeOut=GlobalContext.context.createGain();

    return GlobalContext;
  })(typeof window !== "undefined" ? window : global);