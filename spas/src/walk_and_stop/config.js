export class Config {
    constructor() {
        this.appData = {
            "options": {
                "canvasWidth": 300,
                "fps": 60,
                "allowRandom": 1
            },
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
                    "cellTypes": [
                        {
                            "rigid": 1,
                            "color": "#666666"
                        },
                        {
                            "rigid": 0,
                            "color": "transparent"
                        }
                    ],
                    "objects": [
                        {
                            "rigid": 1,
                            "pos": [
                                4,
                                5
                            ],
                            "color": "#99CC33"
                        },
                        {
                            "pos": [
                                7,
                                10
                            ],
                            "color": "#99CC33"
                        }
                    ],
                    "start": 0,
                    "end": 1,
                    "viewSize": 10,
                    "background": "#3399CC"
                }
            ]
        }
    }
}