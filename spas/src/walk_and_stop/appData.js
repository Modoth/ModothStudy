export const AppData = {
    "types": [
        {
            "rigid": 1,
            "color": "#666666"
        },
        {
            "rigid": 0,
            "color": "#e2a621"
        },
        {
            "rigid": 1,
            "color": "#99CC33",
        },
        {
            "rigid": 1,
            "color": "#99CC33"
        },
        {
            "rigid": 1,
            "color": "#ff6666"
        }
    ],
    "background": "transparent",
    "canvasWidth": 300,
    "fps": 30,
    "allowRandom": 1,
    "sessions": [
        {
            "cells": [
                "000000000000",
                "011001111110",
                "001111010010",
                "001000010010",
                "001011010010",
                "001001010000",
                "001001000000",
                "001111111110",
                "000000000000"
            ],
            "objects": [
                {
                    "type": 2,
                    "pos": [
                        4,
                        5
                    ],
                    "failedCondition": {
                        "prop": " 生命"
                    },
                    "initProps": {
                        " 生命": 1
                    }
                },
                {
                    "type": 3,
                    "pos": [
                        7,
                        10
                    ]
                },
                {
                    "type": 4,
                    "pos": [
                        5,
                        7
                    ],
                    "attack": {
                        "other": {
                            " 生命": -1
                        }
                    }
                }
            ],
            "start": 0,
            "end": 1,
            "ppu": 30
        }
    ]
}