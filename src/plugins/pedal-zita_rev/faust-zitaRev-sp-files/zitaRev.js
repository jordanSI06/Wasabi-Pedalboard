
/*
Code generated with Faust version 2.5.16
Compilation options: wasm, -scal -ftz 2
*/

function getJSONzitaRev() {
	return "{\"name\":\"zitaRev\",\"version\":\"2.5.16\",\"options\":\"wasm, -scal -ftz 2\",\"size\":\"959048\",\"inputs\":\"2\",\"outputs\":\"2\",\"meta\":[{\"author\":\"JOS, Revised by RM\"},{\"basics.lib/name\":\"Faust Basic Element Library\"},{\"basics.lib/version\":\"0.0\"},{\"delays.lib/name\":\"Faust Delay Library\"},{\"delays.lib/version\":\"0.0\"},{\"description\":\"Example GUI for zita_rev1_stereo (mostly following the Linux zita-rev1 GUI).\"},{\"filters.lib/name\":\"Faust Filters Library\"},{\"filters.lib/version\":\"0.0\"},{\"maths.lib/author\":\"GRAME\"},{\"maths.lib/copyright\":\"GRAME\"},{\"maths.lib/license\":\"LGPL with exception\"},{\"maths.lib/name\":\"Faust Math Library\"},{\"maths.lib/version\":\"2.1\"},{\"name\":\"zitaRev\"},{\"reverbs.lib/name\":\"Faust Reverb Library\"},{\"reverbs.lib/version\":\"0.0\"},{\"routes.lib/name\":\"Faust Signal Routing Library\"},{\"routes.lib/version\":\"0.0\"},{\"signals.lib/name\":\"Faust Signal Routing Library\"},{\"signals.lib/version\":\"0.0\"},{\"version\":\"0.0\"}],\"ui\":[{\"type\":\"hgroup\",\"label\":\"Zita_Rev1\",\"meta\":[{\"0\":\"\"},{\"tooltip\":\"~ ZITA REV1 FEEDBACK DELAY NETWORK (FDN) & SCHROEDER  ALLPASS-COMB REVERBERATOR (8x8). See Faust's reverbs.lib for documentation and  references\"}],\"items\":[{\"type\":\"hgroup\",\"label\":\"Input\",\"meta\":[{\"1\":\"\"}],\"items\":[{\"type\":\"vslider\",\"label\":\"In Delay\",\"address\":\"/Zita_Rev1/Input/In_Delay\",\"index\":\"262260\",\"meta\":[{\"1\":\"\"},{\"style\":\"knob\"},{\"tooltip\":\"Delay in ms   before reverberation begins\"},{\"unit\":\"ms\"}],\"init\":\"60\",\"min\":\"20\",\"max\":\"100\",\"step\":\"1\"}]},{\"type\":\"hgroup\",\"label\":\"Decay Times in Bands (see tooltips)\",\"meta\":[{\"2\":\"\"}],\"items\":[{\"type\":\"vslider\",\"label\":\"LF X\",\"address\":\"/Zita_Rev1/Decay_Times_in_Bands_(see_tooltips)/LF_X\",\"index\":\"65620\",\"meta\":[{\"1\":\"\"},{\"scale\":\"log\"},{\"style\":\"knob\"},{\"tooltip\":\"Crossover frequency (Hz) separating low and middle frequencies\"},{\"unit\":\"Hz\"}],\"init\":\"200\",\"min\":\"50\",\"max\":\"1000\",\"step\":\"1\"},{\"type\":\"vslider\",\"label\":\"Low RT60\",\"address\":\"/Zita_Rev1/Decay_Times_in_Bands_(see_tooltips)/Low_RT60\",\"index\":\"65612\",\"meta\":[{\"2\":\"\"},{\"scale\":\"log\"},{\"style\":\"knob\"},{\"tooltip\":\"T60 = time (in seconds) to decay 60dB in low-frequency band\"},{\"unit\":\"s\"}],\"init\":\"3\",\"min\":\"1\",\"max\":\"8\",\"step\":\"0.1\"},{\"type\":\"vslider\",\"label\":\"Mid RT60\",\"address\":\"/Zita_Rev1/Decay_Times_in_Bands_(see_tooltips)/Mid_RT60\",\"index\":\"65600\",\"meta\":[{\"3\":\"\"},{\"scale\":\"log\"},{\"style\":\"knob\"},{\"tooltip\":\"T60 = time (in seconds) to decay 60dB in middle band\"},{\"unit\":\"s\"}],\"init\":\"2\",\"min\":\"1\",\"max\":\"8\",\"step\":\"0.1\"},{\"type\":\"vslider\",\"label\":\"HF Damping\",\"address\":\"/Zita_Rev1/Decay_Times_in_Bands_(see_tooltips)/HF_Damping\",\"index\":\"65608\",\"meta\":[{\"4\":\"\"},{\"scale\":\"log\"},{\"style\":\"knob\"},{\"tooltip\":\"Frequency (Hz) at which the high-frequency T60 is half the middle-band's T60\"},{\"unit\":\"Hz\"}],\"init\":\"6000\",\"min\":\"1500\",\"max\":\"23520\",\"step\":\"1\"}]},{\"type\":\"hgroup\",\"label\":\"RM Peaking Equalizer 1\",\"meta\":[{\"3\":\"\"}],\"items\":[{\"type\":\"vslider\",\"label\":\"Eq1 Freq\",\"address\":\"/Zita_Rev1/RM_Peaking_Equalizer_1/Eq1_Freq\",\"index\":\"65584\",\"meta\":[{\"1\":\"\"},{\"scale\":\"log\"},{\"style\":\"knob\"},{\"tooltip\":\"Center-frequency of second-order Regalia-Mitra peaking equalizer section 1\"},{\"unit\":\"Hz\"}],\"init\":\"315\",\"min\":\"40\",\"max\":\"2500\",\"step\":\"1\"},{\"type\":\"vslider\",\"label\":\"Eq1 Level\",\"address\":\"/Zita_Rev1/RM_Peaking_Equalizer_1/Eq1_Level\",\"index\":\"65588\",\"meta\":[{\"2\":\"\"},{\"style\":\"knob\"},{\"tooltip\":\"Peak level   in dB of second-order Regalia-Mitra peaking equalizer section 1\"},{\"unit\":\"dB\"}],\"init\":\"0\",\"min\":\"-15\",\"max\":\"15\",\"step\":\"0.1\"}]},{\"type\":\"hgroup\",\"label\":\"RM Peaking Equalizer 2\",\"meta\":[{\"4\":\"\"}],\"items\":[{\"type\":\"vslider\",\"label\":\"Eq2 Freq\",\"address\":\"/Zita_Rev1/RM_Peaking_Equalizer_2/Eq2_Freq\",\"index\":\"65576\",\"meta\":[{\"1\":\"\"},{\"scale\":\"log\"},{\"style\":\"knob\"},{\"tooltip\":\"Center-frequency of second-order Regalia-Mitra peaking equalizer section 2\"},{\"unit\":\"Hz\"}],\"init\":\"1500\",\"min\":\"160\",\"max\":\"10000\",\"step\":\"1\"},{\"type\":\"vslider\",\"label\":\"Eq2 Level\",\"address\":\"/Zita_Rev1/RM_Peaking_Equalizer_2/Eq2_Level\",\"index\":\"65580\",\"meta\":[{\"2\":\"\"},{\"style\":\"knob\"},{\"tooltip\":\"Peak level   in dB of second-order Regalia-Mitra peaking equalizer section 2\"},{\"unit\":\"dB\"}],\"init\":\"0\",\"min\":\"-15\",\"max\":\"15\",\"step\":\"0.1\"}]},{\"type\":\"hgroup\",\"label\":\"Output\",\"meta\":[{\"5\":\"\"}],\"items\":[{\"type\":\"vslider\",\"label\":\"Dry/Wet Mix\",\"address\":\"/Zita_Rev1/Output/Dry/Wet_Mix\",\"index\":\"65552\",\"meta\":[{\"1\":\"\"},{\"style\":\"knob\"},{\"tooltip\":\"-1 = dry, 1 = wet\"}],\"init\":\"0\",\"min\":\"-1\",\"max\":\"1\",\"step\":\"0.01\"},{\"type\":\"vslider\",\"label\":\"Level\",\"address\":\"/Zita_Rev1/Output/Level\",\"index\":\"0\",\"meta\":[{\"2\":\"\"},{\"style\":\"knob\"},{\"tooltip\":\"Output scale   factor\"},{\"unit\":\"dB\"}],\"init\":\"-20\",\"min\":\"-70\",\"max\":\"40\",\"step\":\"0.1\"}]}]}]}";
}
/*
 faust2webaudio

 Primarily written by Myles Borins
 During the Spring 2013 offering of Music 420b with Julius Smith
 A bit during the Summer of 2013 with the help of Joshua Kit Clayton
 And finally a sprint during the late fall of 2013 to get everything working
 A Special thanks to Yann Orlarey and Stéphane Letz

 faust2webaudio is distributed under the terms the MIT or GPL2 Licenses.
 Choose the license that best suits your project. The text of the MIT and GPL
 licenses are at the root directory.

 Additional code: GRAME 2014-2017
*/

'use strict';

var faust = faust || {};

faust.error_msg = null;
faust.getErrorMessage = function() { return faust.error_msg; };

faust.remap = function(v, mn0, mx0, mn1, mx1)
{
    return (1.0 * (v - mn0) / (mx0 - mn0)) * (mx1 - mn1) + mn1;
}

function Heap2Str(buf)
{
    var str = "";
    var i = 0;
    while (buf[i] !== 0) {
        str += String.fromCharCode(buf[i++]);
    }
    return str;
}

// Monophonic Faust DSP

/**
* Constructor
*
* @param dsp_instance - the wasm instance
* @param context - the Web Audio context
* @param buffer_size - the buffer_size in frames
*
* @return a valid WebAudio ScriptProcessorNode object or null
*/
faust.zitaRev = function (dsp_instance, context, buffer_size) {

    // Keep JSON parsed object
    var json_object = null;
    try {
        json_object = JSON.parse(getJSONzitaRev());
    } catch (e) {
        faust.error_msg = "Error in JSON.parse: " + e;
        return null;
    }

    var sp;
    try {
        sp = context.createScriptProcessor(buffer_size, parseInt(json_object.inputs), parseInt(json_object.outputs));
    } catch (e) {
        faust.error_msg = "Error in createScriptProcessor: " + e;
        return null;
    }

    sp.json_object = json_object;

    sp.output_handler = null;
    sp.ins = null;
    sp.outs = null;
    sp.compute_handler = null;

    sp.dspInChannnels = [];
    sp.dspOutChannnels = [];

    sp.fPitchwheelLabel = [];
    sp.fCtrlLabel = new Array(128);
    for (var i = 0; i < sp.fCtrlLabel.length; i++) { sp.fCtrlLabel[i] = []; }

    sp.numIn = parseInt(json_object.inputs);
    sp.numOut = parseInt(json_object.outputs);

    // Memory allocator
    sp.ptr_size = 4;
    sp.sample_size = 4;

    sp.factory = dsp_instance.exports;
    sp.HEAP = dsp_instance.exports.memory.buffer;
    sp.HEAP32 = new Int32Array(sp.HEAP);
    sp.HEAPF32 = new Float32Array(sp.HEAP);

    // JSON is as offset 0
    /*
    var HEAPU8 = new Uint8Array(sp.HEAP);
    console.log(Heap2Str(HEAPU8));
    */

    console.log(sp.HEAP);
    console.log(sp.HEAP32);
    console.log(sp.HEAPF32);

    // bargraph
    sp.outputs_timer = 5;
    sp.outputs_items = [];

    // input items
    sp.inputs_items = [];

    // Start of HEAP index

    // DSP is placed first with index 0. Audio buffer start at the end of DSP.
    sp.audio_heap_ptr = parseInt(json_object.size);

    // Setup pointers offset
    sp.audio_heap_ptr_inputs = sp.audio_heap_ptr;
    sp.audio_heap_ptr_outputs = sp.audio_heap_ptr_inputs + (sp.numIn * sp.ptr_size);

    // Setup buffer offset
    sp.audio_heap_inputs = sp.audio_heap_ptr_outputs + (sp.numOut * sp.ptr_size);
    sp.audio_heap_outputs = sp.audio_heap_inputs + (sp.numIn * buffer_size * sp.sample_size);

    // Start of DSP memory : DSP is placed first with index 0
    sp.dsp = 0;

    sp.pathTable = [];

    sp.update_outputs = function ()
    {
        if (sp.outputs_items.length > 0 && sp.output_handler && sp.outputs_timer-- === 0) {
            sp.outputs_timer = 5;
            for (var i = 0; i < sp.outputs_items.length; i++) {
                sp.output_handler(sp.outputs_items[i], sp.factory.getParamValue(sp.dsp, sp.pathTable[sp.outputs_items[i]]));
            }
        }
    }

    sp.compute = function (e)
    {
        var i, j;

        // Read inputs
        for (i = 0; i < sp.numIn; i++) {
            var input = e.inputBuffer.getChannelData(i);
            var dspInput = sp.dspInChannnels[i];
            dspInput.set(input);
        }

        // Possibly call an externally given callback (for instance to synchronize playing a MIDIFile...)
        if (sp.compute_handler) {
            sp.compute_handler(buffer_size);
        }

        // Compute
        sp.factory.compute(sp.dsp, buffer_size, sp.ins, sp.outs);

        // Update bargraph
        sp.update_outputs();

        // Write outputs
        for (i = 0; i < sp.numOut; i++) {
            var output = e.outputBuffer.getChannelData(i);
            var dspOutput = sp.dspOutChannnels[i];
            output.set(dspOutput);
        }
    };

    // JSON parsing
    sp.parse_ui = function (ui)
    {
        for (var i = 0; i < ui.length; i++) {
            sp.parse_group(ui[i]);
        }
    }

    sp.parse_group = function (group)
    {
        if (group.items) {
            sp.parse_items(group.items);
        }
    }

    sp.parse_items = function (items)
    {
        for (var i = 0; i < items.length; i++) {
            sp.parse_item(items[i]);
        }
    }

    sp.parse_item = function (item)
    {
        if (item.type === "vgroup"
            || item.type === "hgroup"
            || item.type === "tgroup") {
            sp.parse_items(item.items);
        } else if (item.type === "hbargraph"
            || item.type === "vbargraph") {
            // Keep bargraph adresses
            sp.outputs_items.push(item.address);
            sp.pathTable[item.address] = parseInt(item.index);
        } else if (item.type === "vslider"
            || item.type === "hslider"
            || item.type === "button"
            || item.type === "checkbox"
            || item.type === "nentry") {
            // Keep inputs adresses
            sp.inputs_items.push(item.address);
            sp.pathTable[item.address] = parseInt(item.index);
            if (item.meta !== undefined) {
                for (var i = 0; i < item.meta.length; i++) {
                    if (item.meta[i].midi !== undefined) {
                        if (item.meta[i].midi.trim() === "pitchwheel") {
                            sp.fPitchwheelLabel.push(item.address);
                        } else if (item.meta[i].midi.trim().split(" ")[0] === "ctrl") {
                            sp.fCtrlLabel[parseInt(item.meta[i].midi.trim().split(" ")[1])]
                                .push({ path:item.address,
                                      min:parseFloat(item.min),
                                      max:parseFloat(item.max) });
                        }
                    }
                }
            }
        }
    }

    sp.initAux = function ()
    {
        var i;

        // Setup web audio context
        console.log("buffer_size %d", buffer_size);
        sp.onaudioprocess = sp.compute;

        if (sp.numIn > 0) {
            sp.ins = sp.audio_heap_ptr_inputs;
            for (i = 0; i < sp.numIn; i++) {
                sp.HEAP32[(sp.ins >> 2) + i] = sp.audio_heap_inputs + ((buffer_size * sp.sample_size) * i);
            }

            // Prepare Ins buffer tables
            var dspInChans = sp.HEAP32.subarray(sp.ins >> 2, (sp.ins + sp.numIn * sp.ptr_size) >> 2);
            for (i = 0; i < sp.numIn; i++) {
                sp.dspInChannnels[i] = sp.HEAPF32.subarray(dspInChans[i] >> 2, (dspInChans[i] + buffer_size * sp.sample_size) >> 2);
            }
        }

        if (sp.numOut > 0) {
            sp.outs = sp.audio_heap_ptr_outputs;
            for (i = 0; i < sp.numOut; i++) {
                sp.HEAP32[(sp.outs >> 2) + i] = sp.audio_heap_outputs + ((buffer_size * sp.sample_size) * i);
            }

            // Prepare Out buffer tables
            var dspOutChans = sp.HEAP32.subarray(sp.outs >> 2, (sp.outs + sp.numOut * sp.ptr_size) >> 2);
            for (i = 0; i < sp.numOut; i++) {
                sp.dspOutChannnels[i] = sp.HEAPF32.subarray(dspOutChans[i] >> 2, (dspOutChans[i] + buffer_size * sp.sample_size) >> 2);
            }
        }

        // Parse JSON UI part
        sp.parse_ui(sp.json_object.ui);

        // Init DSP
        sp.factory.init(sp.dsp, context.sampleRate);
    }

    /*
    Public API to be used to control the WebAudio node.
    */

    /* Return current sample rate */
    sp.getSampleRate = function ()
    {
        return context.sampleRate;
    }

    /* Return instance number of audio inputs. */
    sp.getNumInputs = function ()
    {
        return sp.numIn;
    }

    /* Return instance number of audio outputs. */
    sp.getNumOutputs = function ()
    {
        return sp.numOut;
    }

    /**
    * Global init, doing the following initialization:
    * - static tables initialization
    * - call 'instanceInit': constants and instance state initialisation
    *
    * @param sample_rate - the sampling rate in Hertz
    */
    sp.init = function (sample_rate)
    {
        sp.factory.init(sp.dsp, sample_rate);
    }

    /**
    * Init instance state.
    *
    * @param sample_rate - the sampling rate in Hertz
    */
    sp.instanceInit = function (sample_rate)
    {
        sp.factory.instanceInit(sp.dsp, sample_rate);
    }

    /**
    * Init instance constant state.
    *
    * @param sample_rate - the sampling rate in Hertz
    */
    sp.instanceConstants = function (sample_rate)
    {
        sp.factory.instanceConstants(sp.dsp, sample_rate);
    }

    /* Init default control parameters values. */
    sp.instanceResetUserInterface = function ()
    {
        sp.factory.instanceResetUserInterface(sp.dsp);
    }

    /* Init instance state (delay lines...).*/
    sp.instanceClear = function ()
    {
        sp.factory.instanceClear(sp.dsp);
    }

    /**
    * Trigger the Meta handler with instance specific calls to 'declare' (key, value) metadata.
    *
    * @param handler - the Meta handler as a 'declare' function of type (key, value)
    */
    sp.metadata = function (handler)
    {
        if (json_object.meta) {
            json_object.meta.forEach(function(meta) {
                                     handler.declare(Object.keys(meta)[0], Object.values(meta)[0]);
                                     });
        }
    }

    /**
    * Setup a control output handler with a function of type (path, value)
    * to be used on each generated output value. This handler will be called
    * each audio cycle at the end of the 'compute' method.
    *
    * @param handler - a function of type function(path, value)
    */
    sp.setOutputParamHandler = function (handler)
    {
        sp.output_handler = handler;
    }

    /**
    * Get the current output handler.
    */
    sp.getOutputParamHandler = function ()
    {
        return sp.output_handler;
    }

    /**
    * Controller
    *
    * @param channel - the MIDI channel (0..15, not used for now)
    * @param ctrl - the MIDI controller number (0..127)
    * @param value - the MIDI controller value (0..127)
    */
    sp.ctrlChange = function (channel, ctrl, value)
    {
        if (sp.fCtrlLabel[ctrl] !== []) {
            for (var i = 0; i < sp.fCtrlLabel[ctrl].length; i++) {
            	var path = sp.fCtrlLabel[ctrl][i].path;
            	sp.setParamValue(path, faust.remap(value, 0, 127, sp.fCtrlLabel[ctrl][i].min, sp.fCtrlLabel[ctrl][i].max));
                if (sp.output_handler) {
                    sp.output_handler(path, sp.getParamValue(path));
                }
            }
        }
    }

    /**
    * PitchWeel
    *
    * @param channel - the MIDI channel (0..15, not used for now)
    * @param value - the MIDI controller value (-1..1)
    */
    sp.pitchWheel = function (channel, wheel)
    {
        for (var i = 0; i < sp.fPitchwheelLabel.length; i++) {
    		var path = sp.fPitchwheelLabel[i];
    		sp.setParamValue(path, Math.pow(2.0, wheel/12.0));
            if (sp.output_handler) {
                sp.output_handler(path, sp.getParamValue(path));
            }
        }
    }

    /**
    * Set control value.
    *
    * @param path - the path to the wanted control (retrieved using 'getParams' method)
    * @param val - the float value for the wanted parameter
    */
    sp.setParamValue = function (path, val)
    {
    	sp.factory.setParamValue(sp.dsp, sp.pathTable[path], val);
    }

    /**
    * Get control value.
    *
    * @param path - the path to the wanted control (retrieved using 'controls' method)
    *
    * @return the float value
    */
    sp.getParamValue = function (path)
    {
        return sp.factory.getParamValue(sp.dsp, sp.pathTable[path]);
    }

    /**
    * Get the table of all input parameters paths.
    *
    * @return the table of all input parameter paths.
    */
    sp.getParams = function()
    {
        return sp.inputs_items;
    }

    /**
    * Get DSP JSON description with its UI and metadata
    *
    * @return DSP JSON description
    */
    sp.getJSON = function ()
    {
        return getJSONzitaRev();
    }

    // Init resulting DSP
    sp.initAux();

    return sp;
};

/**
* Create a ScriptProcessorNode Web Audio object
* by loading and compiling the Faust wasm file
*
* @param context - the Web Audio context
* @param buffer_size - the buffer_size in frames
* @param callback - a callback taking the created ScriptProcessorNode as parameter, or null in case of error
*/
faust.createzitaRev = function(context, buffer_size, callback)
{
    var importObject = {
        env: {
            memoryBase: 0,
            tableBase: 0,
                
            // Integer version
            _abs: Math.abs,
            
            // Float version
            _acosf: Math.acos,
            _asinf: Math.asin,
            _atanf: Math.atan,
            _atan2f: Math.atan2,
            _ceilf: Math.ceil,
            _cosf: Math.cos,
            _expf: Math.exp,
            _floorf: Math.floor,
            _fmodf: function(x, y) { return x % y; },
            _logf: Math.log,
            _log10f: Math.log10,
            _max_f: Math.max,
            _min_f: Math.min,
            _remainderf: function(x, y) { return x - Math.round(x/y) * y; },
            _powf: Math.pow,
            _roundf: Math.fround,
            _sinf: Math.sin,
            _sqrtf: Math.sqrt,
            _tanf: Math.tan,
               
            // Double version
            _acos: Math.acos,
            _asin: Math.asin,
            _atan: Math.atan,
            _atan2: Math.atan2,
            _ceil: Math.ceil,
            _cos: Math.cos,
            _exp: Math.exp,
            _floor: Math.floor,
            _fmod: function(x, y) { return x % y; },
            _log: Math.log,
            _log10: Math.log10,
            _max_: Math.max,
            _min_: Math.min,
            _remainder:function(x, y) { return x - Math.round(x/y) * y; },
            _pow: Math.pow,
            _round: Math.fround,
            _sin: Math.sin,
            _sqrt: Math.sqrt,
            _tan: Math.tan,
            
            table: new WebAssembly.Table({ initial: 0, element: 'anyfunc' })
        }
    };

    // HERE WE NEED TO UNDERSTAND WHY "./zitaRev.wasm" DOES NOT WORK !!!
    fetch('./src/pedal-board/pedals/faust-zitaRev-sp-files/zitaRev.wasm')
    .then(dsp_file => dsp_file.arrayBuffer())
    .then(dsp_bytes => WebAssembly.instantiate(dsp_bytes, importObject))
    .then(dsp_module => callback(faust.zitaRev(dsp_module.instance, context, buffer_size)))
    .catch(function(error) { console.log(error); faust.error_msg = "Faust zitaRev cannot be loaded or compiled"; callback(null); });
}
