var buildInBank = [

    {
    "_id": "1538407686557_bank",
    "label": "Michel",
    "date": "2018-10-01",
    "presets": [{
      "_id": "1538407702016_preset",
      "label": "Vampires",
      "date": "2018-10-01",
      "plugs": [{
        "id": "p_1538407419413",
        "type": "pedal-distomachine",
        "position": {
          "x": 410,
          "y": 186
        },
        "settings": {
          "CG": "4.5",
          "EQ": [4, 13, -8, -8, 15, 12],
          "gain2": 1,
          "LS3Gain": -6,
          "LS3Freq": 720,
          "HP1Q": 0.707099974155426,
          "HP1Freq": 6,
          "gain1": 1,
          "LS2Gain": -6.300000190734863,
          "LS2Freq": 320,
          "LS1Gain": -6,
          "LS1Freq": 720,
          "presence": "8.9",
          "reverb": "2",
          "treble": "5.0",
          "middle": "5.0",
          "bass": "6.7",
          "drive": "6.4",
          "master": "3.7",
          "volume": "7.0",
          "status": "enable",
          "preset": "8"
        }
      }, {
        "id": "p_1538407821353",
        "type": "pedal-mixer",
        "position": {
          "x": 1070.2531380753137,
          "y": 218
        },
        "settings": {
          "nbcanaux": 2,
          "gain": 0.5
        }
      }, {
        "id": "p_1538407758573",
        "type": "pedal-stereofreqshifter",
        "position": {
          "x": 1172,
          "y": 556
        },
        "settings": {
          "/Stereo_Frequency_Shifter/L-R_Offset": "0",
          "/Stereo_Frequency_Shifter/Mix": "0.5",
          "/Stereo_Frequency_Shifter/Shift_Scalar": "36",
          "/Stereo_Frequency_Shifter/Shift": "-0.13500000536441803",
          "/Stereo_Frequency_Shifter/bypass": "0"
        }
      }, {
        "id": "p_1538407720332",
        "type": "pedal-bluedream",
        "position": {
          "x": 377,
          "y": 495
        },
        "settings": {
          "/kpp_bluedream/bass": "-6.900000095367432",
          "/kpp_bluedream/bypass": "0",
          "/kpp_bluedream/drive": "84",
          "/kpp_bluedream/middle": "-3.9000000953674316",
          "/kpp_bluedream/treble": "0.6000000238418579",
          "/kpp_bluedream/voice": "0.7900000214576721",
          "/kpp_bluedream/volume": "0.6899999976158142"
        }
      }, {
        "id": "p_1538407867288",
        "type": "pedal-quadrafuzz",
        "position": {
          "x": 768,
          "y": 501
        },
        "settings": {
          "highgain": 0.5,
          "midhighgain": 0.5,
          "midlowgain": 0.8,
          "lowgain": 0.6,
          "status": "enable"
        }
      }, {
        "id": "p_1538407790807",
        "type": "pedal-zitarev2",
        "position": {
          "x": 1395.0264993026499,
          "y": 336
        },
        "settings": {
          "/zitaRev/Zita_Rev1/Input/In_Delay": "80",
          "/zitaRev/Zita_Rev1/Decay_Times_in_Bands_(see_tooltips)/LF_X": "800",
          "/zitaRev/Zita_Rev1/Decay_Times_in_Bands_(see_tooltips)/Low_RT60": "6",
          "/zitaRev/Zita_Rev1/Decay_Times_in_Bands_(see_tooltips)/Mid_RT60": "6",
          "/zitaRev/Zita_Rev1/Decay_Times_in_Bands_(see_tooltips)/HF_Damping": "18000",
          "/zitaRev/Zita_Rev1/RM_Peaking_Equalizer_1/Eq1_Freq": "2000",
          "/zitaRev/Zita_Rev1/RM_Peaking_Equalizer_1/Eq1_Level": "13",
          "/zitaRev/Zita_Rev1/RM_Peaking_Equalizer_2/Eq2_Freq": "8000",
          "/zitaRev/Zita_Rev1/RM_Peaking_Equalizer_2/Eq2_Level": "14",
          "/zitaRev/Zita_Rev1/Output/Dry/Wet_Mix": "0.699999988079071",
          "/zitaRev/Zita_Rev1/Output/Level": "0",
          "/zitaRev/bypass": "1"
        }
      }, {
        "id": "p_1538747359909",
        "type": "pedal-deadgate",
        "position": {
          "x": 180,
          "y": 254
        },
        "settings": {
          "/kpp_distruction/Dead_Zone": "-120",
          "/kpp_distruction/Noise_Gate": "-93"
        }
      }],
      "connexions": [{
        "in": {
          "id": "p_1538407758573",
          "inputnumber": 0
        },
        "out": "p_1538407419413"
      }, {
        "in": {
          "id": "pedalOut",
          "inputnumber": 0
        },
        "out": "p_1538407790807"
      }, {
        "in": {
          "id": "p_1538407790807",
          "inputnumber": 0
        },
        "out": "p_1538407821353"
      }, {
        "in": {
          "id": "p_1538407867288",
          "inputnumber": 0
        },
        "out": "p_1538407720332"
      }, {
        "in": {
          "id": "p_1538407419413",
          "inputnumber": 0
        },
        "out": "p_1538407867288"
      }, {
        "in": {
          "id": "p_1538407821353",
          "inputnumber": 1
        },
        "out": "p_1538407419413"
      }, {
        "in": {
          "id": "p_1538407821353",
          "inputnumber": 0
        },
        "out": "p_1538407758573"
      }, {
        "in": {
          "id": "p_1538747359909",
          "inputnumber": 0
        },
        "out": "pedalIn1"
      }, {
        "in": {
          "id": "p_1538407720332",
          "inputnumber": 0
        },
        "out": "p_1538747359909"
      }]
    }, {
      "_id": "1538408550291_preset",
      "label": "Pitch Fuzz Me",
      "date": "2018-10-01",
      "plugs": [{
        "id": "p_1538408015829",
        "type": "pedal-metalmachine",
        "position": {
          "x": 703,
          "y": 117
        },
        "settings": {
          "presence": "5.0",
          "reverb": "0.7",
          "treble": "2.5",
          "middle": "6.9",
          "bass": "8.7",
          "drive": "5.9",
          "master": "6.3",
          "volume": "4.6",
          "status": "enable",
          "preampPos": "after",
          "filterstate": false,
          "preset": "2",
          "LS1Freq": 720,
          "LS1Gain": -6,
          "LS2Freq": 320,
          "LS2Gain": -10.199999809265137,
          "LS3Freq": 720,
          "LS3Gain": -6,
          "gain1": 1,
          "gain2": 1,
          "HP1Freq": 6,
          "HP1Q": 0.707099974155426,
          "EQ": [12, 8, -6, -10, 7, 2],
          "CG": "8.2"
        }
      }, {
        "id": "p_1538408024345",
        "type": "pedal-dualpitchshifter",
        "position": {
          "x": 387,
          "y": 118
        },
        "settings": {
          "/Dual_Pitch_Shifter/Mix": "0.49000000953674316",
          "/Dual_Pitch_Shifter/Shift_L": "-5.099999904632568",
          "/Dual_Pitch_Shifter/Shift_R": "-12",
          "/Dual_Pitch_Shifter/Window_Size": "95",
          "/Dual_Pitch_Shifter/bypass": "0"
        }
      }, {
        "id": "p_1538408176499",
        "type": "pedal-deadgate",
        "position": {
          "x": 106,
          "y": 118
        },
        "settings": {
          "/kpp_distruction/Dead_Zone": "-120",
          "/kpp_distruction/Noise_Gate": "-86"
        }
      }, {
        "id": "p_1538408201452",
        "type": "pedal-weirdphaser",
        "position": {
          "x": 220,
          "y": 652
        },
        "settings": {
          "/Weird_Phaser/Feedback": "0.23000000417232513",
          "/Weird_Phaser/L-R_Offset": "0.6629999876022339",
          "/Weird_Phaser/Rate_Scalar": "5.677000045776367",
          "/Weird_Phaser/Rate": "0.6010000109672546",
          "/Weird_Phaser/bypass": "1"
        }
      }, {
        "id": "p_1538408374217",
        "type": "pedal-zitarev2",
        "position": {
          "x": 532,
          "y": 636
        },
        "settings": {
          "/zitaRev/Zita_Rev1/Input/In_Delay": "80",
          "/zitaRev/Zita_Rev1/Decay_Times_in_Bands_(see_tooltips)/LF_X": "800",
          "/zitaRev/Zita_Rev1/Decay_Times_in_Bands_(see_tooltips)/Low_RT60": "6",
          "/zitaRev/Zita_Rev1/Decay_Times_in_Bands_(see_tooltips)/Mid_RT60": "6",
          "/zitaRev/Zita_Rev1/Decay_Times_in_Bands_(see_tooltips)/HF_Damping": "18000",
          "/zitaRev/Zita_Rev1/RM_Peaking_Equalizer_1/Eq1_Freq": "2000",
          "/zitaRev/Zita_Rev1/RM_Peaking_Equalizer_1/Eq1_Level": "13",
          "/zitaRev/Zita_Rev1/RM_Peaking_Equalizer_2/Eq2_Freq": "8000",
          "/zitaRev/Zita_Rev1/RM_Peaking_Equalizer_2/Eq2_Level": "14",
          "/zitaRev/Zita_Rev1/Output/Dry/Wet_Mix": "0.699999988079071",
          "/zitaRev/Zita_Rev1/Output/Level": "0",
          "/zitaRev/bypass": "1"
        }
      }, {
        "id": "p_1538408601950",
        "type": "pedal-channelmixer",
        "position": {
          "x": 1014,
          "y": 533
        },
        "settings": {
          "pan": 0,
          "gain": 0.58
        }
      }],
      "connexions": [{
        "in": {
          "id": "p_1538408015829",
          "inputnumber": 0
        },
        "out": "p_1538408024345"
      }, {
        "in": {
          "id": "p_1538408176499",
          "inputnumber": 0
        },
        "out": "pedalIn1"
      }, {
        "in": {
          "id": "p_1538408024345",
          "inputnumber": 0
        },
        "out": "p_1538408176499"
      }, {
        "in": {
          "id": "p_1538408201452",
          "inputnumber": 0
        },
        "out": "p_1538408015829"
      }, {
        "in": {
          "id": "p_1538408374217",
          "inputnumber": 0
        },
        "out": "p_1538408201452"
      }, {
        "in": {
          "id": "p_1538408601950",
          "inputnumber": 0
        },
        "out": "p_1538408374217"
      }, {
        "in": {
          "id": "pedalOut",
          "inputnumber": 0
        },
        "out": "p_1538408601950"
      }]
    }, {
      "_id": "1538409030519_preset",
      "label": "Dreamy sound",
      "date": "2018-10-01",
      "plugs": [{
        "id": "p_1538408713556",
        "type": "pedal-pingpongdelay",
        "position": {
          "x": 1118,
          "y": 179
        },
        "settings": {
          "mix": 0.5,
          "time": 0.11,
          "feedback": 0.31,
          "status": "enable"
        }
      }, {
        "id": "p_1538408721793",
        "type": "pedal-bluedream",
        "position": {
          "x": 410,
          "y": 348
        },
        "settings": {
          "/kpp_bluedream/bass": "-6.900000095367432",
          "/kpp_bluedream/bypass": "0",
          "/kpp_bluedream/drive": "64",
          "/kpp_bluedream/middle": "-3.9000000953674316",
          "/kpp_bluedream/treble": "0.6000000238418579",
          "/kpp_bluedream/voice": "0.3499999940395355",
          "/kpp_bluedream/volume": "0.49000000953674316"
        }
      }, {
        "id": "p_1538408735540",
        "type": "pedal-stereofreqshifter",
        "position": {
          "x": 211,
          "y": 189
        },
        "settings": {
          "/Stereo_Frequency_Shifter/L-R_Offset": "0.6290000081062317",
          "/Stereo_Frequency_Shifter/Mix": "0.6899999976158142",
          "/Stereo_Frequency_Shifter/Shift_Scalar": "66.9000015258789",
          "/Stereo_Frequency_Shifter/Shift": "-0.08799999952316284",
          "/Stereo_Frequency_Shifter/bypass": "0"
        }
      }, {
        "id": "p_1538408937240",
        "type": "pedal-zitarev2",
        "position": {
          "x": 944,
          "y": 552
        },
        "settings": {
          "/zitaRev/Zita_Rev1/Input/In_Delay": "77",
          "/zitaRev/Zita_Rev1/Decay_Times_in_Bands_(see_tooltips)/LF_X": "658",
          "/zitaRev/Zita_Rev1/Decay_Times_in_Bands_(see_tooltips)/Low_RT60": "6.900000095367432",
          "/zitaRev/Zita_Rev1/Decay_Times_in_Bands_(see_tooltips)/Mid_RT60": "6.900000095367432",
          "/zitaRev/Zita_Rev1/Decay_Times_in_Bands_(see_tooltips)/HF_Damping": "18000",
          "/zitaRev/Zita_Rev1/RM_Peaking_Equalizer_1/Eq1_Freq": "1884",
          "/zitaRev/Zita_Rev1/RM_Peaking_Equalizer_1/Eq1_Level": "10.800000190734863",
          "/zitaRev/Zita_Rev1/RM_Peaking_Equalizer_2/Eq2_Freq": "7538",
          "/zitaRev/Zita_Rev1/RM_Peaking_Equalizer_2/Eq2_Level": "7.900000095367432",
          "/zitaRev/Zita_Rev1/Output/Dry/Wet_Mix": "0.05000000074505806",
          "/zitaRev/Zita_Rev1/Output/Level": "3.5999999046325684",
          "/zitaRev/bypass": "0"
        }
      }, {
        "id": "p_1538408701507",
        "type": "pedal-cleanmachine",
        "position": {
          "x": 574,
          "y": 126
        },
        "settings": {
          "CG": "6.7",
          "EQ": [-2, 10, -10, -20, 17, 3],
          "Q4": "0.0",
          "Q3": "0.0",
          "Q2": "0.0",
          "Q1": "0.0",
          "F4": 5696,
          "F3": 2382,
          "F2": 569,
          "F1": 147,
          "HCF": 12000,
          "LCF": 256,
          "presence": "8.0",
          "reverb": "2.0",
          "treble": "5.0",
          "middle": "5.0",
          "bass": "5.0",
          "drive": "0.0",
          "master": "6.5",
          "volume": "5.9",
          "status": "enable",
          "preset": "9"
        }
      }, {
        "id": "p_1538747483021",
        "type": "pedal-deadgate",
        "position": {
          "x": 158.75,
          "y": 451.25
        },
        "settings": {
          "/kpp_distruction/Dead_Zone": "-101",
          "/kpp_distruction/Noise_Gate": "-80"
        }
      }],
      "connexions": [{
        "in": {
          "id": "p_1538408713556",
          "inputnumber": 0
        },
        "out": "p_1538408701507"
      }, {
        "in": {
          "id": "p_1538408721793",
          "inputnumber": 0
        },
        "out": "p_1538408735540"
      }, {
        "in": {
          "id": "p_1538408701507",
          "inputnumber": 0
        },
        "out": "p_1538408721793"
      }, {
        "in": {
          "id": "p_1538408937240",
          "inputnumber": 0
        },
        "out": "p_1538408713556"
      }, {
        "in": {
          "id": "pedalOut",
          "inputnumber": 0
        },
        "out": "p_1538408937240"
      }, {
        "in": {
          "id": "p_1538747483021",
          "inputnumber": 0
        },
        "out": "pedalIn1"
      }, {
        "in": {
          "id": "p_1538408735540",
          "inputnumber": 0
        },
        "out": "p_1538747483021"
      }]
    }, {
      "_id": "1538752058643_preset",
      "label": "Get Lucky",
      "date": "2018-10-05",
      "plugs": [{
        "id": "p_1538751871498",
        "type": "pedal-distomachine",
        "position": {
          "x": 676,
          "y": 59
        },
        "settings": {
          "CG": "4.5",
          "EQ": [4, 13, -8, -8, 15, 12],
          "gain2": 1,
          "LS3Gain": -6,
          "LS3Freq": 720,
          "HP1Q": 0.707099974155426,
          "HP1Freq": 6,
          "gain1": 1,
          "LS2Gain": -6.300000190734863,
          "LS2Freq": 320,
          "LS1Gain": -6,
          "LS1Freq": 720,
          "presence": "8.9",
          "reverb": "2",
          "treble": "5.0",
          "middle": "5.0",
          "bass": "6.7",
          "drive": "6.4",
          "master": "3.7",
          "volume": "7.0",
          "status": "enable",
          "preset": "8"
        }
      }, {
        "id": "p_1538751876327",
        "type": "pedal-metalmachine",
        "position": {
          "x": 636,
          "y": 224
        },
        "settings": {
          "presence": "5.0",
          "reverb": "3.3",
          "treble": "5.2",
          "middle": "4.4",
          "bass": "8.1",
          "drive": "6.7",
          "master": 3.666666666666667,
          "volume": "5.0",
          "status": "enable",
          "preampPos": "before",
          "filterstate": true,
          "preset": "8",
          "LS1Freq": 720,
          "LS1Gain": -6,
          "LS2Freq": 320,
          "LS2Gain": -6.300000190734863,
          "LS3Freq": 720,
          "LS3Gain": -1.2000000476837158,
          "gain1": 0.28999999165534973,
          "gain2": 0.1899999976158142,
          "HP1Freq": 6,
          "HP1Q": 0.707099974155426,
          "EQ": [12, 12, -8, -8, 12, 12],
          "CG": "0.1"
        }
      }, {
        "id": "p_1538751886551",
        "type": "pedal-cleanmachine",
        "position": {
          "x": 653,
          "y": 400
        },
        "settings": {
          "CG": "4.2",
          "EQ": [12, -2, -10, -20, 2, 11],
          "Q4": "1.0",
          "Q3": "1.0",
          "Q2": "23.7",
          "Q1": "0.0",
          "F4": 6368,
          "F3": 2402,
          "F2": 792,
          "F1": 186,
          "HCF": 18461,
          "LCF": 345,
          "presence": "10.0",
          "reverb": "2.0",
          "treble": "5.9",
          "middle": "1.3",
          "bass": "8.0",
          "drive": "0.7",
          "master": "10.0",
          "volume": "6.6",
          "status": "enable",
          "preset": "11"
        }
      }, {
        "id": "p_1538751896420",
        "type": "pedal-deadgate",
        "position": {
          "x": 330,
          "y": 391
        },
        "settings": {
          "/kpp_distruction/Dead_Zone": "-120",
          "/kpp_distruction/Noise_Gate": "-120"
        }
      }, {
        "id": "p_1538751909591",
        "type": "pedal-mixer",
        "position": {
          "x": 1530,
          "y": 225.00003051757812
        },
        "settings": {
          "nbcanaux": 3,
          "gain": 0.5
        }
      }],
      "connexions": [{
        "in": {
          "id": "p_1538751896420",
          "inputnumber": 0
        },
        "out": "pedalIn1"
      }, {
        "in": {
          "id": "p_1538751876327",
          "inputnumber": 0
        },
        "out": "pedalIn1"
      }, {
        "in": {
          "id": "p_1538751871498",
          "inputnumber": 0
        },
        "out": "pedalIn1"
      }, {
        "in": {
          "id": "p_1538751886551",
          "inputnumber": 0
        },
        "out": "p_1538751896420"
      }, {
        "in": {
          "id": "p_1538751909591",
          "inputnumber": 0
        },
        "out": "p_1538751871498"
      }, {
        "in": {
          "id": "p_1538751909591",
          "inputnumber": 1
        },
        "out": "p_1538751876327"
      }, {
        "in": {
          "id": "p_1538751909591",
          "inputnumber": 2
        },
        "out": "p_1538751886551"
      }, {
        "in": {
          "id": "pedalOut",
          "inputnumber": 0
        },
        "out": "p_1538751909591"
      }]
    }]
  },

  // END OF MICHEL'S BANK
  {
    "_id": "1536938961161_bank",
    "label": "Blues",
    "date": "2018-09-14",
    "presets": [{
        "_id": "1536938992395_preset",
        "label": "Michel 1",
        "date": "2018-09-14",
        "plugs": [{
            "id": "p_1536939008157",
            "type": "pedal-distomachine",
            "position": {
              "x": 422,
              "y": 142
            },
            "settings": {
              "CG": "4.5",
              "EQ": [
                4,
                13,
                -8,
                -8,
                15,
                12
              ],
              "gain2": 1,
              "LS3Gain": -6,
              "LS3Freq": 720,
              "HP1Q": 0.707099974155426,
              "HP1Freq": 6,
              "gain1": 1,
              "LS2Gain": -6.300000190734863,
              "LS2Freq": 320,
              "LS1Gain": -6,
              "LS1Freq": 720,
              "presence": "8.9",
              "reverb": "2",
              "treble": "5.0",
              "middle": "5.0",
              "bass": "6.7",
              "drive": "6.4",
              "master": "3.7",
              "volume": "7.0",
              "status": "enable",
              "preset": "8"
            }
          },
          {
            "id": "p_1536939011858",
            "type": "pedal-pingpongdelay",
            "position": {
              "x": 1124,
              "y": 218
            },
            "settings": {
              "mix": 0.41,
              "time": 0.12,
              "feedback": 0.35,
              "status": "enable"
            }
          }
        ],
        "connexions": [{
            "in": {
              "id": "p_1536939011858",
              "inputnumber": 0
            },
            "out": "p_1536939008157"
          },
          {
            "in": {
              "id": "pedalOut",
              "inputnumber": 0
            },
            "out": "p_1536939011858"
          },
          {
            "in": {
              "id": "p_1536939008157",
              "inputnumber": 0
            },
            "out": "pedalIn1"
          }
        ]
      },
      {
        "_id": "1536939149576_preset",
        "label": "Michel 2",
        "date": "2018-09-14",
        "plugs": [{
            "id": "p_1536939008157",
            "type": "pedal-distomachine",
            "position": {
              "x": 295,
              "y": 134
            },
            "settings": {
              "CG": "4.5",
              "EQ": [
                4,
                13,
                -8,
                -8,
                15,
                12
              ],
              "gain2": 1,
              "LS3Gain": -6,
              "LS3Freq": 720,
              "HP1Q": 0.707099974155426,
              "HP1Freq": 6,
              "gain1": 1,
              "LS2Gain": -6.300000190734863,
              "LS2Freq": 320,
              "LS1Gain": -6,
              "LS1Freq": 720,
              "presence": "8.9",
              "reverb": "2",
              "treble": "5.0",
              "middle": "5.0",
              "bass": "6.7",
              "drive": "6.4",
              "master": "3.7",
              "volume": "7.0",
              "status": "enable",
              "preset": "8"
            }
          },
          {
            "id": "p_1536939011858",
            "type": "pedal-pingpongdelay",
            "position": {
              "x": 1033,
              "y": 120
            },
            "settings": {
              "mix": 0.41,
              "time": 0.12,
              "feedback": 0.35,
              "status": "enable"
            }
          },
          {
            "id": "p_1536939062599",
            "type": "pedal-mixer",
            "position": {
              "x": 1263,
              "y": 212
            },
            "settings": {
              "nbcanaux": 2,
              "gain": 0.5
            }
          },
          {
            "id": "p_1536939093654",
            "type": "pedal-metalmachine",
            "position": {
              "x": 591.25,
              "y": 418.75
            },
            "settings": {
              "presence": "5.0",
              "reverb": "1.2",
              "treble": "5.0",
              "middle": "5.9",
              "bass": "9.6",
              "drive": "7.7",
              "master": 7.000000000000001,
              "volume": "5.0",
              "status": "enable",
              "preampPos": "before",
              "filterstate": true,
              "preset": "4",
              "LS1Freq": 720,
              "LS1Gain": -6,
              "LS2Freq": 320,
              "LS2Gain": -6.300000190734863,
              "LS3Freq": 720,
              "LS3Gain": -6,
              "gain1": 1,
              "gain2": 1,
              "HP1Freq": 6,
              "HP1Q": 0.707099974155426,
              "EQ": [
                4,
                7,
                -3,
                -5,
                4,
                12
              ],
              "CG": "9.5"
            }
          }
        ],
        "connexions": [{
            "in": {
              "id": "p_1536939011858",
              "inputnumber": 0
            },
            "out": "p_1536939008157"
          },
          {
            "in": {
              "id": "p_1536939008157",
              "inputnumber": 0
            },
            "out": "pedalIn1"
          },
          {
            "in": {
              "id": "pedalOut",
              "inputnumber": 0
            },
            "out": "p_1536939062599"
          },
          {
            "in": {
              "id": "p_1536939062599",
              "inputnumber": 0
            },
            "out": "p_1536939011858"
          },
          {
            "in": {
              "id": "p_1536939093654",
              "inputnumber": 0
            },
            "out": "pedalIn1"
          },
          {
            "in": {
              "id": "p_1536939062599",
              "inputnumber": 1
            },
            "out": "p_1536939093654"
          }
        ]
      }
    ]
  },
  {
    "_id": "1536939208839_bank",
    "label": "Metal",
    "date": "2018-09-14",
    "presets": [{
      "_id": "1536939223513_preset",
      "label": "Classic Metal",
      "date": "2018-09-14",
      "plugs": [{
          "id": "p_1536939227108",
          "type": "pedal-metalmachine",
          "position": {
            "x": 636,
            "y": 311
          },
          "settings": {
            "presence": "6.0",
            "reverb": "0.7",
            "treble": "3.8",
            "middle": "8.0",
            "bass": "8.7",
            "drive": "5.9",
            "master": "6.0",
            "volume": "3.9",
            "status": "enable",
            "preampPos": "after",
            "filterstate": false,
            "preset": "1",
            "LS1Freq": 720,
            "LS1Gain": -6,
            "LS2Freq": 320,
            "LS2Gain": -10.199999809265137,
            "LS3Freq": 720,
            "LS3Gain": -6,
            "gain1": 1,
            "gain2": 1,
            "HP1Freq": 6,
            "HP1Q": 0.707099974155426,
            "EQ": [
              12,
              8,
              -6,
              -10,
              7,
              2
            ],
            "CG": "9.2"
          }
        },
        {
          "id": "p_1536939230545",
          "type": "pedal-deadgate",
          "position": {
            "x": 253,
            "y": 301
          },
          "settings": {
            "/kpp_distruction/Dead_Zone": "-120",
            "/kpp_distruction/Noise_Gate": "-76"
          }
        }
      ],
      "connexions": [{
          "in": {
            "id": "p_1536939230545",
            "inputnumber": 0
          },
          "out": "pedalIn1"
        },
        {
          "in": {
            "id": "p_1536939227108",
            "inputnumber": 0
          },
          "out": "p_1536939230545"
        },
        {
          "in": {
            "id": "pedalOut",
            "inputnumber": 0
          },
          "out": "p_1536939227108"
        }
      ]
    }]
  },
  {
    "_id": "1536939619112_bank",
    "label": "Pink Floyd",
    "date": "2018-09-14",
    "presets": [{
      "_id": "1536939630658_preset",
      "label": "Classic clean",
      "date": "2018-09-14",
      "plugs": [{
          "id": "p_1536939304666",
          "type": "pedal-pingpongdelay",
          "position": {
            "x": 1486.25,
            "y": 285
          },
          "settings": {
            "mix": 0.5,
            "time": 0.21,
            "feedback": 0.35,
            "status": "enable"
          }
        },
        {
          "id": "p_1536939325867",
          "type": "pedal-weirdphaser",
          "position": {
            "x": 533.75,
            "y": 390
          },
          "settings": {
            "/Weird_Phaser/Feedback": "0.6499999761581421",
            "/Weird_Phaser/L-R_Offset": "0.609000027179718",
            "/Weird_Phaser/Rate_Scalar": "15.125",
            "/Weird_Phaser/Rate": "0",
            "/Weird_Phaser/bypass": "0"
          }
        },
        {
          "id": "p_1536939500274",
          "type": "pedal-distomachine",
          "position": {
            "x": 795,
            "y": 331
          },
          "settings": {
            "CG": "4.5",
            "EQ": [
              4,
              13,
              -8,
              -8,
              15,
              12
            ],
            "gain2": 1,
            "LS3Gain": -6,
            "LS3Freq": 720,
            "HP1Q": 0.707099974155426,
            "HP1Freq": 6,
            "gain1": 1,
            "LS2Gain": -6.300000190734863,
            "LS2Freq": 320,
            "LS1Gain": -6,
            "LS1Freq": 720,
            "presence": "8.9",
            "reverb": "2",
            "treble": "5.0",
            "middle": "5.0",
            "bass": "6.7",
            "drive": "6.4",
            "master": "3.7",
            "volume": 3.4000000000000004,
            "status": "enable",
            "preset": "8"
          }
        }
      ],
      "connexions": [{
          "in": {
            "id": "pedalOut",
            "inputnumber": 0
          },
          "out": "p_1536939304666"
        },
        {
          "in": {
            "id": "p_1536939325867",
            "inputnumber": 0
          },
          "out": "pedalIn1"
        },
        {
          "in": {
            "id": "p_1536939500274",
            "inputnumber": 0
          },
          "out": "p_1536939325867"
        },
        {
          "in": {
            "id": "p_1536939304666",
            "inputnumber": 0
          },
          "out": "p_1536939500274"
        }
      ]
    }]
  },
  {
    "_id": "1536940605534_bank",
    "label": "Police",
    "date": "2018-09-14",
    "presets": [{
        "_id": "1536940616450_preset",
        "label": "Walking on the moon",
        "date": "2018-09-14",
        "plugs": [{
            "id": "p_1536939915794",
            "type": "pedal-weirdphaser",
            "position": {
              "x": 1196,
              "y": 152
            },
            "settings": {
              "/Weird_Phaser/Feedback": "0.699999988079071",
              "/Weird_Phaser/L-R_Offset": "0.9049999713897705",
              "/Weird_Phaser/Rate_Scalar": "36.45199966430664",
              "/Weird_Phaser/Rate": "0.06199999898672104",
              "/Weird_Phaser/bypass": "0"
            }
          },
          {
            "id": "p_1536940488811",
            "type": "pedal-distomachine",
            "position": {
              "x": 598,
              "y": 244
            },
            "settings": {
              "CG": "4.5",
              "EQ": [
                4,
                13,
                -8,
                -8,
                15,
                12
              ],
              "gain2": 1,
              "LS3Gain": -6,
              "LS3Freq": 720,
              "HP1Q": 0.707099974155426,
              "HP1Freq": 6,
              "gain1": 1,
              "LS2Gain": -6.300000190734863,
              "LS2Freq": 320,
              "LS1Gain": -6,
              "LS1Freq": 720,
              "presence": "8.9",
              "reverb": 0.9,
              "treble": "5.0",
              "middle": "5.0",
              "bass": "6.7",
              "drive": "6.4",
              "master": 3.7,
              "volume": "7.0",
              "status": "enable",
              "preset": "8"
            }
          }
        ],
        "connexions": [{
            "in": {
              "id": "p_1536940488811",
              "inputnumber": 0
            },
            "out": "pedalIn1"
          },
          {
            "in": {
              "id": "p_1536939915794",
              "inputnumber": 0
            },
            "out": "p_1536940488811"
          },
          {
            "in": {
              "id": "pedalOut",
              "inputnumber": 0
            },
            "out": "p_1536939915794"
          }
        ]
      },
      {
        "_id": "1536941774084_preset",
        "label": "Tea in Sahara",
        "date": "2018-09-14",
        "plugs": [{
            "id": "p_1536941670692",
            "type": "pedal-distomachine",
            "position": {
              "x": 657,
              "y": 183
            },
            "settings": {
              "CG": "4.5",
              "EQ": [
                4,
                13,
                -8,
                -8,
                15,
                12
              ],
              "gain2": 1,
              "LS3Gain": -6,
              "LS3Freq": 720,
              "HP1Q": 0.707099974155426,
              "HP1Freq": 6,
              "gain1": 1,
              "LS2Gain": -6.300000190734863,
              "LS2Freq": 320,
              "LS1Gain": -6,
              "LS1Freq": 720,
              "presence": "8.9",
              "reverb": "2",
              "treble": "5.0",
              "middle": "5.0",
              "bass": "6.7",
              "drive": "6.4",
              "master": "3.7",
              "volume": "7.0",
              "status": "enable",
              "preset": "8"
            }
          },
          {
            "id": "p_1536941689545",
            "type": "pedal-deadgate",
            "position": {
              "x": 452.5,
              "y": 378.75
            },
            "settings": {
              "/kpp_distruction/Dead_Zone": "-120",
              "/kpp_distruction/Noise_Gate": "-81"
            }
          },
          {
            "id": "p_1536941714807",
            "type": "pedal-pingpongdelay",
            "position": {
              "x": 1322.5,
              "y": 366.25
            },
            "settings": {
              "mix": 0.34,
              "time": 0.15,
              "feedback": 0.35,
              "status": "enable"
            }
          }
        ],
        "connexions": [{
            "in": {
              "id": "p_1536941689545",
              "inputnumber": 0
            },
            "out": "pedalIn1"
          },
          {
            "in": {
              "id": "p_1536941670692",
              "inputnumber": 0
            },
            "out": "p_1536941689545"
          },
          {
            "in": {
              "id": "p_1536941714807",
              "inputnumber": 0
            },
            "out": "p_1536941670692"
          },
          {
            "in": {
              "id": "pedalOut",
              "inputnumber": 0
            },
            "out": "p_1536941714807"
          }
        ]
      }
    ]
  },
  {
    "_id": "1536941220511_bank",
    "label": "Clean",
    "date": "2018-09-14",
    "presets": [{
        "_id": "1536941234145_preset",
        "label": "Acoustic guitar",
        "date": "2018-09-14",
        "plugs": [{
            "id": "p_1536941243554",
            "type": "pedal-cleanmachine",
            "position": {
              "x": 589,
              "y": 138
            },
            "settings": {
              "CG": "6.3",
              "EQ": [
                -2,
                -1,
                -2,
                4,
                11,
                3
              ],
              "Q4": 20,
              "Q3": 55,
              "Q2": 29,
              "Q1": 0,
              "F4": 5848,
              "F3": 2904,
              "F2": 300,
              "F1": 204,
              "HCF": 17165,
              "LCF": 242,
              "presence": 8,
              "reverb": "2.8",
              "treble": 2.4000000000000004,
              "middle": 6.5,
              "bass": 7.2,
              "drive": "0.0",
              "master": "8.3",
              "volume": "7.1",
              "status": "enable",
              "preset": "2"
            }
          },
          {
            "id": "p_1536941362224",
            "type": "pedal-deadgate",
            "position": {
              "x": 352,
              "y": 197
            },
            "settings": {
              "/kpp_distruction/Dead_Zone": "-120",
              "/kpp_distruction/Noise_Gate": "-83"
            }
          }
        ],
        "connexions": [{
            "in": {
              "id": "pedalOut",
              "inputnumber": 0
            },
            "out": "p_1536941243554"
          },
          {
            "in": {
              "id": "p_1536941362224",
              "inputnumber": 0
            },
            "out": "pedalIn1"
          },
          {
            "in": {
              "id": "p_1536941243554",
              "inputnumber": 0
            },
            "out": "p_1536941362224"
          }
        ]
      },
      {
        "_id": "1536941982789_preset",
        "label": "A forest",
        "date": "2018-09-14",
        "plugs": [{
            "id": "p_1536941689545",
            "type": "pedal-deadgate",
            "position": {
              "x": 158,
              "y": 164
            },
            "settings": {
              "/kpp_distruction/Dead_Zone": "-120",
              "/kpp_distruction/Noise_Gate": "-120"
            }
          },
          {
            "id": "p_1536941714807",
            "type": "pedal-pingpongdelay",
            "position": {
              "x": 1322.5,
              "y": 366.25
            },
            "settings": {
              "mix": 0.34,
              "time": 0.15,
              "feedback": 0.35,
              "status": "enable"
            }
          },
          {
            "id": "p_1536941791827",
            "type": "pedal-wahvox",
            "position": {
              "x": 350,
              "y": 288
            },
            "settings": {
              "qfactor": 3,
              "frequency": 3,
              "mode": 1,
              "effect": 49,
              "status": "disable",
              "boost": "disable",
              "qMin": 2,
              "qMax": 7,
              "freqMin": 450,
              "freqMax": 1600
            }
          },
          {
            "id": "p_1536941815845",
            "type": "pedal-cleanmachine",
            "position": {
              "x": 698,
              "y": 145
            },
            "settings": {
              "CG": "6.7",
              "EQ": [
                -2,
                10,
                -10,
                -20,
                17,
                3
              ],
              "Q4": "0.0",
              "Q3": "0.0",
              "Q2": "0.0",
              "Q1": "0.0",
              "F4": 5696,
              "F3": 2382,
              "F2": 569,
              "F1": 147,
              "HCF": 12000,
              "LCF": 256,
              "presence": "8.0",
              "reverb": "2.0",
              "treble": "5.0",
              "middle": "5.0",
              "bass": "5.0",
              "drive": "0.0",
              "master": "6.5",
              "volume": "5.9",
              "status": "enable",
              "preset": "9"
            }
          },
          {
            "id": "p_1536941904388",
            "type": "pedal-stereoflanger",
            "position": {
              "x": 1328,
              "y": 140
            },
            "settings": {
              "feedback": 0.5,
              "delay": 0.003,
              "depth": 0.005,
              "frequency": 0.15,
              "status": "enable"
            }
          }
        ],
        "connexions": [{
            "in": {
              "id": "p_1536941689545",
              "inputnumber": 0
            },
            "out": "pedalIn1"
          },
          {
            "in": {
              "id": "pedalOut",
              "inputnumber": 0
            },
            "out": "p_1536941714807"
          },
          {
            "in": {
              "id": "p_1536941791827",
              "inputnumber": 0
            },
            "out": "p_1536941689545"
          },
          {
            "in": {
              "id": "p_1536941815845",
              "inputnumber": 0
            },
            "out": "p_1536941791827"
          },
          {
            "in": {
              "id": "p_1536941904388",
              "inputnumber": 0
            },
            "out": "p_1536941815845"
          },
          {
            "in": {
              "id": "p_1536941714807",
              "inputnumber": 0
            },
            "out": "p_1536941904388"
          }
        ]
      }
    ]
  },
  {
    "_id": "1536942038165_bank",
    "label": "Rock",
    "date": "2018-09-14",
    "presets": [{
        "_id": "1536942267673_preset",
        "label": "Angus and Malcolm",
        "date": "2018-09-14",
        "plugs": [{
            "id": "p_1536942053270",
            "type": "pedal-metalmachine",
            "position": {
              "x": 498,
              "y": 119
            },
            "settings": {
              "presence": "5.0",
              "reverb": "0.7",
              "treble": "3.8",
              "middle": "8.0",
              "bass": "8.4",
              "drive": "5.2",
              "master": "7",
              "volume": "6.5",
              "status": "enable",
              "preampPos": "before",
              "filterstate": true,
              "preset": "0",
              "LS1Freq": 720,
              "LS1Gain": -6,
              "LS2Freq": 320,
              "LS2Gain": -10.199999809265137,
              "LS3Freq": 720,
              "LS3Gain": -6,
              "gain1": 1,
              "gain2": 1,
              "HP1Freq": 6,
              "HP1Q": 0.707099974155426,
              "EQ": [
                12,
                8,
                -6,
                -10,
                7,
                2
              ],
              "CG": "9.2"
            }
          },
          {
            "id": "p_1536942140672",
            "type": "pedal-distomachine",
            "position": {
              "x": 596.25,
              "y": 442.5
            },
            "settings": {
              "CG": "9.2",
              "EQ": [
                19,
                8,
                -6,
                -10,
                7,
                2
              ],
              "gain2": 1,
              "LS3Gain": -6,
              "LS3Freq": 720,
              "HP1Q": 0.707099974155426,
              "HP1Freq": 6,
              "gain1": 1,
              "LS2Gain": -10.199999809265137,
              "LS2Freq": 320,
              "LS1Gain": -6,
              "LS1Freq": 720,
              "presence": "9.4",
              "reverb": "0.7",
              "treble": "3.8",
              "middle": "8.0",
              "bass": "8.7",
              "drive": "5.2",
              "master": "5.5",
              "volume": "2",
              "status": "enable",
              "preset": "5"
            }
          },
          {
            "id": "p_1536942154756",
            "type": "pedal-mixer",
            "position": {
              "x": 1266,
              "y": 245
            },
            "settings": {
              "nbcanaux": 2,
              "gain": 0.99
            }
          }
        ],
        "connexions": [{
            "in": {
              "id": "p_1536942053270",
              "inputnumber": 0
            },
            "out": "pedalIn1"
          },
          {
            "in": {
              "id": "p_1536942140672",
              "inputnumber": 0
            },
            "out": "pedalIn1"
          },
          {
            "in": {
              "id": "p_1536942154756",
              "inputnumber": 0
            },
            "out": "p_1536942053270"
          },
          {
            "in": {
              "id": "p_1536942154756",
              "inputnumber": 1
            },
            "out": "p_1536942140672"
          },
          {
            "in": {
              "id": "pedalOut",
              "inputnumber": 0
            },
            "out": "p_1536942154756"
          }
        ]
      },
      {
        "_id": "1536942604954_preset",
        "label": "ZZ-Top",
        "date": "2018-09-14",
        "plugs": [{
            "id": "p_1536942053270",
            "type": "pedal-metalmachine",
            "position": {
              "x": 498,
              "y": 119
            },
            "settings": {
              "presence": "5.0",
              "reverb": "0.7",
              "treble": "2.5",
              "middle": "6.9",
              "bass": "8.7",
              "drive": "5.9",
              "master": "6.3",
              "volume": "4.6",
              "status": "enable",
              "preampPos": "after",
              "filterstate": false,
              "preset": "2",
              "LS1Freq": 720,
              "LS1Gain": -6,
              "LS2Freq": 320,
              "LS2Gain": -10.199999809265137,
              "LS3Freq": 720,
              "LS3Gain": -6,
              "gain1": 1,
              "gain2": 1,
              "HP1Freq": 6,
              "HP1Q": 0.707099974155426,
              "EQ": [
                12,
                8,
                -6,
                -10,
                7,
                2
              ],
              "CG": "8.2"
            }
          },
          {
            "id": "p_1536942140672",
            "type": "pedal-distomachine",
            "position": {
              "x": 607,
              "y": 347
            },
            "settings": {
              "CG": "9.2",
              "EQ": [
                19,
                8,
                -6,
                -10,
                7,
                2
              ],
              "gain2": 1,
              "LS3Gain": -6,
              "LS3Freq": 720,
              "HP1Q": 0.707099974155426,
              "HP1Freq": 6,
              "gain1": 1,
              "LS2Gain": -10.199999809265137,
              "LS2Freq": 320,
              "LS1Gain": -6,
              "LS1Freq": 720,
              "presence": "9.4",
              "reverb": "0.7",
              "treble": "3.8",
              "middle": "8.0",
              "bass": "8.7",
              "drive": "5.2",
              "master": "5.5",
              "volume": "2",
              "status": "enable",
              "preset": "5"
            }
          },
          {
            "id": "p_1536942154756",
            "type": "pedal-mixer",
            "position": {
              "x": 1266,
              "y": 245
            },
            "settings": {
              "nbcanaux": 2,
              "gain": 0.99
            }
          },
          {
            "id": "p_1536942566510",
            "type": "pedal-deadgate",
            "position": {
              "x": 175,
              "y": 103
            },
            "settings": {
              "/kpp_distruction/Dead_Zone": "-88",
              "/kpp_distruction/Noise_Gate": "-86"
            }
          }
        ],
        "connexions": [{
            "in": {
              "id": "p_1536942140672",
              "inputnumber": 0
            },
            "out": "pedalIn1"
          },
          {
            "in": {
              "id": "p_1536942154756",
              "inputnumber": 0
            },
            "out": "p_1536942053270"
          },
          {
            "in": {
              "id": "p_1536942154756",
              "inputnumber": 1
            },
            "out": "p_1536942140672"
          },
          {
            "in": {
              "id": "pedalOut",
              "inputnumber": 0
            },
            "out": "p_1536942154756"
          },
          {
            "in": {
              "id": "p_1536942566510",
              "inputnumber": 0
            },
            "out": "pedalIn1"
          },
          {
            "in": {
              "id": "p_1536942053270",
              "inputnumber": 0
            },
            "out": "p_1536942566510"
          }
        ]
      },
      {
        "_id": "1536943589545_preset",
        "label": "Van Halen",
        "date": "2018-09-14",
        "plugs": [{
            "id": "p_1536942053270",
            "type": "pedal-metalmachine",
            "position": {
              "x": 449,
              "y": 119
            },
            "settings": {
              "presence": "5.0",
              "reverb": "0.7",
              "treble": "2.5",
              "middle": "6.9",
              "bass": "8.7",
              "drive": "5.9",
              "master": "6.3",
              "volume": "4.6",
              "status": "enable",
              "preampPos": "after",
              "filterstate": false,
              "preset": "2",
              "LS1Freq": 720,
              "LS1Gain": -6,
              "LS2Freq": 320,
              "LS2Gain": -10.199999809265137,
              "LS3Freq": 720,
              "LS3Gain": -6,
              "gain1": 1,
              "gain2": 1,
              "HP1Freq": 6,
              "HP1Q": 0.707099974155426,
              "EQ": [
                12,
                8,
                -6,
                -10,
                7,
                2
              ],
              "CG": "8.2"
            }
          },
          {
            "id": "p_1536942566510",
            "type": "pedal-deadgate",
            "position": {
              "x": 175,
              "y": 103
            },
            "settings": {
              "/kpp_distruction/Dead_Zone": "-88",
              "/kpp_distruction/Noise_Gate": "-76"
            }
          },
          {
            "id": "p_1536942840999",
            "type": "pedal-pingpongdelay",
            "position": {
              "x": 1366,
              "y": 442
            },
            "settings": {
              "mix": 0.5,
              "time": 0.09,
              "feedback": 0.26,
              "status": "enable"
            }
          },
          {
            "id": "p_1536942974845",
            "type": "pedal-stereoflanger",
            "position": {
              "x": 1107.5,
              "y": 376.25
            },
            "settings": {
              "feedback": 0.36,
              "delay": 0.0059,
              "depth": 0.0025,
              "frequency": 0.25,
              "status": "enable"
            }
          },
          {
            "id": "p_1536943120698",
            "type": "pedal-distomachine",
            "position": {
              "x": 481,
              "y": 428
            },
            "settings": {
              "CG": "1.5",
              "EQ": [
                19,
                8,
                -6,
                -10,
                7,
                2
              ],
              "gain2": 1,
              "LS3Gain": -6,
              "LS3Freq": 720,
              "HP1Q": 0.707099974155426,
              "HP1Freq": 6,
              "gain1": 1,
              "LS2Gain": -10.199999809265137,
              "LS2Freq": 320,
              "LS1Gain": -6,
              "LS1Freq": 720,
              "presence": "9.4",
              "reverb": "0.7",
              "treble": "3.8",
              "middle": "7.6",
              "bass": "8.7",
              "drive": "8",
              "master": "2.8",
              "volume": "1.8",
              "status": "enable",
              "preset": "3"
            }
          },
          {
            "id": "p_1536943145728",
            "type": "pedal-mixer",
            "position": {
              "x": 1406.25,
              "y": 195
            },
            "settings": {
              "nbcanaux": 2,
              "gain": 0.5
            }
          }
        ],
        "connexions": [{
            "in": {
              "id": "p_1536942566510",
              "inputnumber": 0
            },
            "out": "pedalIn1"
          },
          {
            "in": {
              "id": "pedalOut",
              "inputnumber": 0
            },
            "out": "p_1536942840999"
          },
          {
            "in": {
              "id": "p_1536942053270",
              "inputnumber": 0
            },
            "out": "p_1536942566510"
          },
          {
            "in": {
              "id": "p_1536942840999",
              "inputnumber": 0
            },
            "out": "p_1536942974845"
          },
          {
            "in": {
              "id": "p_1536943145728",
              "inputnumber": 0
            },
            "out": "p_1536942053270"
          },
          {
            "in": {
              "id": "p_1536943145728",
              "inputnumber": 1
            },
            "out": "p_1536943120698"
          },
          {
            "in": {
              "id": "p_1536942974845",
              "inputnumber": 0
            },
            "out": "p_1536943145728"
          },
          {
            "in": {
              "id": "p_1536943120698",
              "inputnumber": 0
            },
            "out": "p_1536942566510"
          }
        ]
      }
    ]
  }, {
    "_id": "1537180386323_bank",
    "label": "synth&drum",
    "date": "2018-09-17",
    "presets": [{
      "_id": "1537180397090_preset",
      "label": "minilogue wave",
      "date": "2018-09-17",
      "plugs": [{
          "id": "p_1537179579192",
          "type": "pedal-minilogue",
          "position": {
            "x": 239,
            "y": 69
          },
          "settings": {
            "egint": 3500,
            "voicedepth": 0,
            "ringmodulation": 0,
            "noise": 0.1,
            "osc2Octave": 2,
            "osc1Octave": 2,
            "egrelease": 1,
            "egsustain": 0.5,
            "egdecay": 1,
            "egattack": 0.5,
            "amprelease": 0.001,
            "ampsustain": 0.5,
            "ampdecay": 1,
            "ampattack": 0.001,
            "osc2shape": 0.5,
            "osc1shape": 0.5,
            "osc2gain": 8,
            "osc1gain": 8,
            "pitch2": 1,
            "pitch1": 1,
            "mix": 0.5,
            "time": 0.5,
            "feedback": 0.5,
            "highpass": 30,
            "lowpass": 2000,
            "resonance": 0.1,
            "mastergain": 5,
            "lforate": 0,
            "lfoint": 20,
            "wave1": "sawtooth",
            "status": "disable",
            "wave2": "sawtooth",
            "lfodest": "cutoff",
            "mode": "poly"
          }
        },
        {
          "id": "p_1537179590080",
          "type": "pedal-mixer",
          "position": {
            "x": 1572.0001220703125,
            "y": 302
          },
          "settings": {
            "nbcanaux": 3,
            "gain": 0.5
          }
        },
        {
          "id": "p_1537179612894",
          "type": "pedal-stereofreqshifter",
          "position": {
            "x": 203.0001220703125,
            "y": 424
          },
          "settings": {
            "/Stereo_Frequency_Shifter/L-R_Offset": "0",
            "/Stereo_Frequency_Shifter/Mix": "0.5",
            "/Stereo_Frequency_Shifter/Shift_Scalar": "1",
            "/Stereo_Frequency_Shifter/Shift": "0",
            "/Stereo_Frequency_Shifter/bypass": "0"
          }
        },
        {
          "id": "p_1537179647129",
          "type": "pedal-drummachine",
          "position": {
            "x": 386,
            "y": 575
          },
          "settings": {
            "defaut": "dark"
          }
        },
        {
          "id": "p_1537179659817",
          "type": "pedal-pingpongdelay",
          "position": {
            "x": 1091.0001220703125,
            "y": 576
          },
          "settings": {
            "mix": 0.33,
            "time": 0.5,
            "feedback": 0.5,
            "status": "enable"
          }
        },
        {
          "id": "p_1537179736634",
          "type": "pedal-quadrafuzz",
          "position": {
            "x": 984,
            "y": 77
          },
          "settings": {
            "highgain": 0.8200000000000001,
            "midhighgain": 0.16,
            "midlowgain": 0.22,
            "lowgain": 0.77,
            "status": "enable"
          }
        },
        {
          "id": "p_1537179601554",
          "type": "pedal-cleanmachine",
          "position": {
            "x": 741.0001220703125,
            "y": 399
          },
          "settings": {
            "CG": "5.4",
            "EQ": [
              -2,
              -1,
              2,
              2,
              -7,
              -13
            ],
            "Q4": 11,
            "Q3": 42,
            "Q2": 49,
            "Q1": 0,
            "F4": 4680,
            "F3": 1915,
            "F2": 569,
            "F1": 147,
            "HCF": 7000,
            "LCF": 90,
            "presence": 5,
            "reverb": "2.0",
            "treble": 5,
            "middle": 5,
            "bass": 5,
            "drive": "10.0",
            "master": "0.7",
            "volume": 7.9,
            "status": "enable",
            "preset": "4"
          }
        },
        {
          "id": "p_1537180314750",
          "type": "pedal-zitarev2",
          "position": {
            "x": 1213.0001220703125,
            "y": 94
          },
          "settings": {
            "/zitaRev/Zita_Rev1/Input/In_Delay": "80",
            "/zitaRev/Zita_Rev1/Decay_Times_in_Bands_(see_tooltips)/LF_X": "800",
            "/zitaRev/Zita_Rev1/Decay_Times_in_Bands_(see_tooltips)/Low_RT60": "6",
            "/zitaRev/Zita_Rev1/Decay_Times_in_Bands_(see_tooltips)/Mid_RT60": "6",
            "/zitaRev/Zita_Rev1/Decay_Times_in_Bands_(see_tooltips)/HF_Damping": "18000",
            "/zitaRev/Zita_Rev1/RM_Peaking_Equalizer_1/Eq1_Freq": "2000",
            "/zitaRev/Zita_Rev1/RM_Peaking_Equalizer_1/Eq1_Level": "13",
            "/zitaRev/Zita_Rev1/RM_Peaking_Equalizer_2/Eq2_Freq": "8000",
            "/zitaRev/Zita_Rev1/RM_Peaking_Equalizer_2/Eq2_Level": "14",
            "/zitaRev/Zita_Rev1/Output/Dry/Wet_Mix": "0.699999988079071",
            "/zitaRev/Zita_Rev1/Output/Level": "0",
            "/zitaRev/bypass": "0"
          }
        }
      ],
      "connexions": [{
          "in": {
            "id": "p_1537179612894",
            "inputnumber": 0
          },
          "out": "pedalIn1"
        },
        {
          "in": {
            "id": "p_1537179601554",
            "inputnumber": 0
          },
          "out": "p_1537179612894"
        },
        {
          "in": {
            "id": "p_1537179736634",
            "inputnumber": 0
          },
          "out": "p_1537179579192"
        },
        {
          "in": {
            "id": "p_1537179659817",
            "inputnumber": 0
          },
          "out": "p_1537179647129"
        },
        {
          "in": {
            "id": "p_1537179590080",
            "inputnumber": 0
          },
          "out": "p_1537179601554"
        },
        {
          "in": {
            "id": "p_1537179590080",
            "inputnumber": 1
          },
          "out": "p_1537179659817"
        },
        {
          "in": {
            "id": "pedalOut",
            "inputnumber": 0
          },
          "out": "p_1537179590080"
        },
        {
          "in": {
            "id": "p_1537180314750",
            "inputnumber": 0
          },
          "out": "p_1537179736634"
        },
        {
          "in": {
            "id": "p_1537179590080",
            "inputnumber": 2
          },
          "out": "p_1537180314750"
        }
      ]
    }]
  }
]