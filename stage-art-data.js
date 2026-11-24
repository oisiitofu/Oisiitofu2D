'use strict';
// Native sprite geometry; collision top/ends map to these pixels.
const StageLegacyPreview="assets/ready/stage-picker-sanctum-5f49562d4db7b394.webp";
const StageArtData={
 "sky": {
  "backgroundSource": "assets/stage-v2-sky-background.png",
  "background": "assets/ready/stage-v2-sky-background-5478986a32ea3d0a.webp",
  "main": {
   "image": "assets/ready/stage-v2-sky-main-4a392e3872112fe9.webp",
   "nativeImage": "assets/stage-v2-sky-main.png",
   "width": 946,
   "height": 258,
   "walkY": 28,
   "surfaceLeft": 20,
   "surfaceRight": 901,
   "source": "assets/stage-v2-platforms-a-source.png",
   "rect": {
    "left": 4,
    "top": 114,
    "width": 946,
    "height": 258
   }
  },
  "small": {
   "image": "assets/ready/stage-v2-sky-small-63f8114bcd8ebe00.webp",
   "nativeImage": "assets/stage-v2-sky-small.png",
   "width": 296,
   "height": 172,
   "walkY": 21,
   "surfaceLeft": 3,
   "surfaceRight": 280,
   "source": "assets/stage-v2-platforms-a-source.png",
   "rect": {
    "left": 950,
    "top": 140,
    "width": 296,
    "height": 172
   }
  },
  "preview": "assets/ready/stage-picker-sky-ff7db7d8e84b85a0.webp"
 },
 "adventure": {
  "backgroundSource": "assets/stage-v2-adventure-background.png",
  "background": "assets/ready/stage-v2-adventure-background-f49a3f758429944a.webp",
  "main": {
   "image": "assets/ready/stage-v2-adventure-main-959d719423531866.webp",
   "nativeImage": "assets/stage-v2-adventure-main.png",
   "width": 948,
   "height": 261,
   "walkY": 32,
   "surfaceLeft": 23,
   "surfaceRight": 928,
   "source": "assets/stage-v2-platforms-a-source.png",
   "rect": {
    "left": 2,
    "top": 527,
    "width": 948,
    "height": 261
   }
  },
  "small": {
   "image": "assets/ready/stage-v2-adventure-small-10092d6292d4ca60.webp",
   "nativeImage": "assets/stage-v2-adventure-small.png",
   "width": 297,
   "height": 205,
   "walkY": 21,
   "surfaceLeft": 14,
   "surfaceRight": 283,
   "source": "assets/stage-v2-platforms-a-source.png",
   "rect": {
    "left": 955,
    "top": 553,
    "width": 297,
    "height": 205
   }
  },
  "preview": "assets/ready/stage-picker-adventure-51cf9876f5a14cbd.webp"
 },
 "waltz": {
  "backgroundSource": "assets/stage-v2-waltz-background.png",
  "background": "assets/ready/stage-v2-waltz-background-e7ddf1d6a02a4d0d.webp",
  "main": {
   "image": "assets/ready/stage-v2-waltz-main-85ff80ee94f92662.webp",
   "nativeImage": "assets/stage-v2-waltz-main.png",
   "width": 940,
   "height": 259,
   "walkY": 31,
   "surfaceLeft": 21,
   "surfaceRight": 918,
   "source": "assets/stage-v2-platforms-a-source.png",
   "rect": {
    "left": 8,
    "top": 919,
    "width": 940,
    "height": 259
   }
  },
  "small": {
   "image": "assets/ready/stage-v2-waltz-small-d0751b39a0e4735d.webp",
   "nativeImage": "assets/stage-v2-waltz-small.png",
   "width": 293,
   "height": 167,
   "walkY": 24,
   "surfaceLeft": 12,
   "surfaceRight": 280,
   "source": "assets/stage-v2-platforms-a-source.png",
   "rect": {
    "left": 956,
    "top": 944,
    "width": 293,
    "height": 167
   }
  },
  "preview": "assets/ready/stage-picker-waltz-acb12892f3a86a12.webp"
 },
 "jazz": {
  "backgroundSource": "assets/stage-v2-jazz-background.png",
  "background": "assets/ready/stage-v2-jazz-background-7a6d36b4e9425c8c.webp",
  "main": {
   "image": "assets/ready/stage-v2-jazz-main-c016feae00f2fd8c.webp",
   "nativeImage": "assets/stage-v2-jazz-main.png",
   "width": 899,
   "height": 256,
   "walkY": 22,
   "surfaceLeft": 20,
   "surfaceRight": 877,
   "source": "assets/stage-v2-platforms-b-source.png",
   "rect": {
    "left": 8,
    "top": 148,
    "width": 899,
    "height": 256
   }
  },
  "small": {
   "image": "assets/ready/stage-v2-jazz-small-a1638dea07b8f7a2.webp",
   "nativeImage": "assets/stage-v2-jazz-small.png",
   "width": 329,
   "height": 186,
   "walkY": 25,
   "surfaceLeft": 12,
   "surfaceRight": 315,
   "source": "assets/stage-v2-platforms-b-source.png",
   "rect": {
    "left": 914,
    "top": 153,
    "width": 329,
    "height": 186
   }
  },
  "preview": "assets/ready/stage-picker-jazz-2168360edc8a803f.webp"
 },
 "japan": {
  "backgroundSource": "assets/stage-v2-japan-background.png",
  "background": "assets/ready/stage-v2-japan-background-603b886381deafc7.webp",
  "main": {
   "image": "assets/ready/stage-v2-japan-main-80e9334ec612fa71.webp",
   "nativeImage": "assets/stage-v2-japan-main.png",
   "width": 892,
   "height": 271,
   "walkY": 26,
   "surfaceLeft": 21,
   "surfaceRight": 870,
   "source": "assets/stage-v2-platforms-b-source.png",
   "rect": {
    "left": 8,
    "top": 526,
    "width": 892,
    "height": 271
   }
  },
  "small": {
   "image": "assets/ready/stage-v2-japan-small-e6c14ba4f9856e51.webp",
   "nativeImage": "assets/stage-v2-japan-small.png",
   "width": 333,
   "height": 227,
   "walkY": 27,
   "surfaceLeft": 13,
   "surfaceRight": 321,
   "source": "assets/stage-v2-platforms-b-source.png",
   "rect": {
    "left": 912,
    "top": 533,
    "width": 333,
    "height": 227
   }
  },
  "preview": "assets/ready/stage-picker-japan-587bd7b7936d05c8.webp"
 },
 "cyber": {
  "backgroundSource": "assets/stage-v2-cyber-background.png",
  "background": "assets/ready/stage-v2-cyber-background-a74c05e02c8a7411.webp",
  "main": {
   "image": "assets/ready/stage-v2-cyber-main-d61f7c87d7501069.webp",
   "nativeImage": "assets/stage-v2-cyber-main.png",
   "width": 900,
   "height": 222,
   "walkY": 28,
   "surfaceLeft": 22,
   "surfaceRight": 884,
   "source": "assets/stage-v2-platforms-b-source.png",
   "rect": {
    "left": 9,
    "top": 917,
    "width": 900,
    "height": 222
   }
  },
  "small": {
   "image": "assets/ready/stage-v2-cyber-small-6b52b0e22f34e0e0.webp",
   "nativeImage": "assets/stage-v2-cyber-small.png",
   "width": 323,
   "height": 201,
   "walkY": 33,
   "surfaceLeft": 13,
   "surfaceRight": 309,
   "source": "assets/stage-v2-platforms-b-source.png",
   "rect": {
    "left": 922,
    "top": 924,
    "width": 323,
    "height": 201
   }
  },
  "preview": "assets/ready/stage-picker-cyber-d863987d740592a7.webp"
 },
 "fire": {
  "backgroundSource": "assets/stage-v2-fire-background.png",
  "background": "assets/ready/stage-v2-fire-background-cd5ab29711319e11.webp",
  "main": {
   "image": "assets/ready/stage-v2-fire-main-2f39661cb065657e.webp",
   "nativeImage": "assets/stage-v2-fire-main.png",
   "width": 902,
   "height": 235,
   "walkY": 24,
   "surfaceLeft": 24,
   "surfaceRight": 883,
   "source": "assets/stage-v2-platforms-c-source.png",
   "rect": {
    "left": 16,
    "top": 165,
    "width": 902,
    "height": 235
   }
  },
  "small": {
   "image": "assets/ready/stage-v2-fire-small-10d77e5735075f3c.webp",
   "nativeImage": "assets/stage-v2-fire-small.png",
   "width": 302,
   "height": 204,
   "walkY": 27,
   "surfaceLeft": 11,
   "surfaceRight": 289,
   "source": "assets/stage-v2-platforms-c-source.png",
   "rect": {
    "left": 936,
    "top": 165,
    "width": 302,
    "height": 204
   }
  },
  "preview": "assets/ready/stage-picker-fire-a360aed27d9f280c.webp"
 },
 "festival": {
  "backgroundSource": "assets/stage-v2-festival-background.png",
  "background": "assets/ready/stage-v2-festival-background-01c617fe46d32a8a.webp",
  "main": {
   "image": "assets/ready/stage-v2-festival-main-84588f91472229dc.webp",
   "nativeImage": "assets/stage-v2-festival-main.png",
   "width": 918,
   "height": 212,
   "walkY": 21,
   "surfaceLeft": 24,
   "surfaceRight": 897,
   "source": "assets/stage-v2-platforms-c-source.png",
   "rect": {
    "left": 14,
    "top": 560,
    "width": 918,
    "height": 212
   }
  },
  "small": {
   "image": "assets/ready/stage-v2-festival-small-f34e3e5a59a8cb5b.webp",
   "nativeImage": "assets/stage-v2-festival-small.png",
   "width": 300,
   "height": 200,
   "walkY": 25,
   "surfaceLeft": 14,
   "surfaceRight": 286,
   "source": "assets/stage-v2-platforms-c-source.png",
   "rect": {
    "left": 941,
    "top": 559,
    "width": 300,
    "height": 200
   }
  },
  "preview": "assets/ready/stage-picker-festival-31209b5e517fe021.webp"
 },
 "beauty": {
  "backgroundSource": "assets/stage-v2-beauty-background.png",
  "background": "assets/ready/stage-v2-beauty-background-5bc6a50d02b64a16.webp",
  "main": {
   "image": "assets/ready/stage-v2-beauty-main-e5e9e172c037475c.webp",
   "nativeImage": "assets/stage-v2-beauty-main.png",
   "width": 913,
   "height": 266,
   "walkY": 23,
   "surfaceLeft": 23,
   "surfaceRight": 891,
   "source": "assets/stage-v2-platforms-c-source.png",
   "rect": {
    "left": 15,
    "top": 911,
    "width": 913,
    "height": 266
   }
  },
  "small": {
   "image": "assets/ready/stage-v2-beauty-small-a6c0e2828f48988c.webp",
   "nativeImage": "assets/stage-v2-beauty-small.png",
   "width": 309,
   "height": 206,
   "walkY": 32,
   "surfaceLeft": 12,
   "surfaceRight": 296,
   "source": "assets/stage-v2-platforms-c-source.png",
   "rect": {
    "left": 936,
    "top": 911,
    "width": 309,
    "height": 206
   }
  },
  "preview": "assets/ready/stage-picker-beauty-00f078c317040964.webp"
 },
 "factory": {
  "backgroundSource": "assets/stage-v3-factory-background.png",
  "background": "assets/ready/stage-v3-factory-background-736c2400493b4d1c.webp",
  "main": {
   "image": "assets/ready/stage-v3-factory-main-69397946e98f0b32.webp",
   "nativeImage": "assets/stage-v3-factory-main.png",
   "width": 1517,
   "height": 266,
   "walkY": 33,
   "surfaceLeft": 6,
   "surfaceRight": 1511,
   "source": "assets/stage-v3-factory-platforms.png",
   "rect": {
    "left": 10,
    "top": 186,
    "width": 1517,
    "height": 266
   }
  },
  "small": {
   "image": "assets/ready/stage-v3-factory-small-b36540434446f476.webp",
   "nativeImage": "assets/stage-v3-factory-small.png",
   "width": 704,
   "height": 306,
   "walkY": 36,
   "surfaceLeft": 8,
   "surfaceRight": 694,
   "source": "assets/stage-v3-factory-platforms.png",
   "rect": {
    "left": 417,
    "top": 624,
    "width": 704,
    "height": 306
   }
  },
  "preview": "assets/ready/stage-picker-factory-cba0ef6f870ae242.webp"
 },
 "sports": {
  "backgroundSource": "assets/stage-v3-sports-background.png",
  "background": "assets/ready/stage-v3-sports-background-79f3328c29d2b813.webp",
  "main": {
   "image": "assets/ready/stage-v3-sports-main-71740a1ef48980d8.webp",
   "nativeImage": "assets/stage-v3-sports-main.png",
   "width": 1754,
   "height": 216,
   "walkY": 66,
   "surfaceLeft": 6,
   "surfaceRight": 1745,
   "source": "assets/stage-v3-sports-platforms.png",
   "rect": {
    "left": 10,
    "top": 185,
    "width": 1754,
    "height": 216
   }
  },
  "small": {
   "image": "assets/ready/stage-v3-sports-small-20950ae3b007b5b0.webp",
   "nativeImage": "assets/stage-v3-sports-small.png",
   "width": 802,
   "height": 164,
   "walkY": 43,
   "surfaceLeft": 5,
   "surfaceRight": 792,
   "source": "assets/stage-v3-sports-platforms.png",
   "rect": {
    "left": 486,
    "top": 588,
    "width": 802,
    "height": 164
   }
  },
  "preview": "assets/ready/stage-picker-sports-bbdca95b63f104e9.webp"
 },
 "abyss": {
  "backgroundSource": "assets/stage-v4-abyss-background.png",
  "background": "assets/ready/stage-v4-abyss-background-cb14d8d3addcd0b7.webp",
  "main": {
   "image": "assets/ready/stage-v4-abyss-main-449c3707608adfae.webp",
   "nativeImage": "assets/stage-v4-abyss-main.png",
   "width": 1479,
   "height": 303,
   "walkY": 22,
   "surfaceLeft": 17,
   "surfaceRight": 1461,
   "source": "assets/stage-v4-abyss-platforms.png",
   "rect": {
    "left": 29,
    "top": 142,
    "width": 1479,
    "height": 303
   }
  },
  "small": {
   "image": "assets/ready/stage-v4-abyss-small-861bb90e9fd37d18.webp",
   "nativeImage": "assets/stage-v4-abyss-small.png",
   "width": 830,
   "height": 217,
   "walkY": 21,
   "surfaceLeft": 12,
   "surfaceRight": 819,
   "source": "assets/stage-v4-abyss-platforms.png",
   "rect": {
    "left": 353,
    "top": 726,
    "width": 830,
    "height": 217
   }
  },
  "preview": "assets/ready/stage-picker-abyss-69a1a1690a477964.webp"
 },
 "aurora": {
  "backgroundSource": "assets/stage-v4-aurora-background.png",
  "background": "assets/ready/stage-v4-aurora-background-7d6929c76dee212e.webp",
  "main": {
   "image": "assets/ready/stage-v4-aurora-main-e5623e741676aaf1.webp",
   "nativeImage": "assets/stage-v4-aurora-main.png",
   "width": 1448,
   "height": 239,
   "walkY": 18,
   "surfaceLeft": 11,
   "surfaceRight": 1435,
   "source": "assets/stage-v4-aurora-platforms.png",
   "rect": {
    "left": 45,
    "top": 208,
    "width": 1448,
    "height": 239
   }
  },
  "small": {
   "image": "assets/ready/stage-v4-aurora-small-942e96cccc6a4151.webp",
   "nativeImage": "assets/stage-v4-aurora-small.png",
   "width": 748,
   "height": 220,
   "walkY": 16,
   "surfaceLeft": 11,
   "surfaceRight": 736,
   "source": "assets/stage-v4-aurora-platforms.png",
   "rect": {
    "left": 395,
    "top": 758,
    "width": 748,
    "height": 220
   }
  },
  "preview": "assets/ready/stage-picker-aurora-540907fb352d0dad.webp"
 },
 "archive": {
  "backgroundSource": "assets/stage-v4-archive-background.png",
  "background": "assets/ready/stage-v4-archive-background-65a9daf76cc411d9.webp",
  "main": {
   "image": "assets/ready/stage-v4-archive-main-8aeff1df94f7bdd7.webp",
   "nativeImage": "assets/stage-v4-archive-main.png",
   "width": 1507,
   "height": 291,
   "walkY": 28,
   "surfaceLeft": 15,
   "surfaceRight": 1489,
   "source": "assets/stage-v4-archive-platforms.png",
   "rect": {
    "left": 15,
    "top": 172,
    "width": 1507,
    "height": 291
   }
  },
  "small": {
   "image": "assets/ready/stage-v4-archive-small-6f27e0b135d52489.webp",
   "nativeImage": "assets/stage-v4-archive-small.png",
   "width": 805,
   "height": 188,
   "walkY": 28,
   "surfaceLeft": 12,
   "surfaceRight": 791,
   "source": "assets/stage-v4-archive-platforms.png",
   "rect": {
    "left": 366,
    "top": 713,
    "width": 805,
    "height": 188
   }
  },
  "preview": "assets/ready/stage-picker-archive-029cf06424a89226.webp"
 },
 "origami": {
  "backgroundSource": "assets/stage-v4-origami-background.png",
  "background": "assets/ready/stage-v4-origami-background-215ffc491bf7c29b.webp",
  "main": {
   "image": "assets/ready/stage-v4-origami-main-5eeb776696caadd5.webp",
   "nativeImage": "assets/stage-v4-origami-main.png",
   "width": 1520,
   "height": 192,
   "walkY": 13,
   "surfaceLeft": 12,
   "surfaceRight": 1508,
   "source": "assets/stage-v4-origami-platforms.png",
   "rect": {
    "left": 8,
    "top": 191,
    "width": 1520,
    "height": 192
   }
  },
  "small": {
   "image": "assets/ready/stage-v4-origami-small-1e5937899ad433df.webp",
   "nativeImage": "assets/stage-v4-origami-small.png",
   "width": 831,
   "height": 141,
   "walkY": 13,
   "surfaceLeft": 12,
   "surfaceRight": 819,
   "source": "assets/stage-v4-origami-platforms.png",
   "rect": {
    "left": 352,
    "top": 729,
    "width": 831,
    "height": 141
   }
  },
  "preview": "assets/ready/stage-picker-origami-3850d5b5eb50e069.webp"
 },
 "mycelium": {
  "backgroundSource": "assets/stage-v4-mycelium-background.png",
  "background": "assets/ready/stage-v4-mycelium-background-a423b72f75463c57.webp",
  "main": {
   "image": "assets/ready/stage-v4-mycelium-main-0eb153dfd80da357.webp",
   "nativeImage": "assets/stage-v4-mycelium-main.png",
   "width": 1460,
   "height": 309,
   "walkY": 14,
   "surfaceLeft": 12,
   "surfaceRight": 1449,
   "source": "assets/stage-v4-mycelium-platforms.png",
   "rect": {
    "left": 38,
    "top": 133,
    "width": 1460,
    "height": 309
   }
  },
  "small": {
   "image": "assets/ready/stage-v4-mycelium-small-617288daf5c8f63a.webp",
   "nativeImage": "assets/stage-v4-mycelium-small.png",
   "width": 788,
   "height": 245,
   "walkY": 15,
   "surfaceLeft": 13,
   "surfaceRight": 776,
   "source": "assets/stage-v4-mycelium-platforms.png",
   "rect": {
    "left": 373,
    "top": 697,
    "width": 788,
    "height": 245
   }
  },
  "preview": "assets/ready/stage-picker-mycelium-b25cac5f6d3e627e.webp"
 },
 "rail": {
  "backgroundSource": "assets/stage-v4-rail-background.png",
  "background": "assets/ready/stage-v4-rail-background-17b56892cfc3aa2c.webp",
  "main": {
   "image": "assets/ready/stage-v4-rail-main-4be4ac1deedbf186.webp",
   "nativeImage": "assets/stage-v4-rail-main.png",
   "width": 1487,
   "height": 348,
   "walkY": 13,
   "surfaceLeft": 25,
   "surfaceRight": 1460,
   "source": "assets/stage-v4-rail-platforms.png",
   "rect": {
    "left": 25,
    "top": 129,
    "width": 1487,
    "height": 348
   }
  },
  "small": {
   "image": "assets/ready/stage-v4-rail-small-194dda4a78d07dba.webp",
   "nativeImage": "assets/stage-v4-rail-small.png",
   "width": 730,
   "height": 292,
   "walkY": 11,
   "surfaceLeft": 9,
   "surfaceRight": 720,
   "source": "assets/stage-v4-rail-platforms.png",
   "rect": {
    "left": 402,
    "top": 694,
    "width": 730,
    "height": 292
   }
  },
  "preview": "assets/ready/stage-picker-rail-c4cb19fa971f3b0e.webp"
 },
 "salt": {
  "backgroundSource": "assets/stage-v5-salt-background.png",
  "background": "assets/ready/stage-v5-salt-background-c1cdb67faec74515.webp",
  "preview": "assets/ready/stage-picker-salt-7a6a2638b35d30fa.webp",
  "main": {
   "source": "assets/stage-v5-salt-main.png",
   "image": "assets/ready/stage-v5-salt-main-ef0b4320594b0174.webp",
   "width": 1472,
   "height": 299,
   "surfaceLeft": 29,
   "surfaceRight": 1440,
   "walkY": 12,
   "verticalScale": 0.35
  },
  "small": {
   "source": "assets/stage-v5-salt-small.png",
   "image": "assets/ready/stage-v5-salt-small-2c9353f0f698c890.webp",
   "width": 708,
   "height": 134,
   "surfaceLeft": 26,
   "surfaceRight": 683,
   "walkY": 14,
   "verticalScale": 0.32
  }
 },
 "porcelain": {
  "backgroundSource": "assets/stage-v5-porcelain-background.png",
  "background": "assets/ready/stage-v5-porcelain-background-990546bd5cdd80ad.webp",
  "preview": "assets/ready/stage-picker-porcelain-64d795fc4092e48d.webp",
  "main": {
   "source": "assets/stage-v5-porcelain-main.png",
   "image": "assets/ready/stage-v5-porcelain-main-86f0d818ff8c72f3.webp",
   "width": 1428,
   "height": 282,
   "surfaceLeft": 14,
   "surfaceRight": 1414,
   "walkY": 11
  },
  "small": {
   "source": "assets/stage-v5-porcelain-small.png",
   "image": "assets/ready/stage-v5-porcelain-small-3c4260e64ec0fd26.webp",
   "width": 736,
   "height": 137,
   "surfaceLeft": 16,
   "surfaceRight": 720,
   "walkY": 13
  }
 },
 "shadow": {
  "backgroundSource": "assets/stage-v5-shadow-background.png",
  "background": "assets/ready/stage-v5-shadow-background-b591ac6647265c06.webp",
  "preview": "assets/ready/stage-picker-shadow-19550c1a2cc75d86.webp",
  "main": {
   "source": "assets/stage-v5-shadow-main.png",
   "image": "assets/ready/stage-v5-shadow-main-90c2db08aadbf8bd.webp",
   "width": 1468,
   "height": 273,
   "surfaceLeft": 15,
   "surfaceRight": 1453,
   "walkY": 10
  },
  "small": {
   "source": "assets/stage-v5-shadow-small.png",
   "image": "assets/ready/stage-v5-shadow-small-a58a3531068a8bf8.webp",
   "width": 762,
   "height": 116,
   "surfaceLeft": 15,
   "surfaceRight": 747,
   "walkY": 10
  }
 },
 "hollow": {
  "backgroundSource": "assets/stage-v5-hollow-background.png",
  "background": "assets/ready/stage-v5-hollow-background-c6012741c516a290.webp",
  "preview": "assets/ready/stage-picker-hollow-6d6a4b79d8439a22.webp",
  "main": {
   "source": "assets/stage-v5-hollow-main.png",
   "image": "assets/ready/stage-v5-hollow-main-b0189761e9855985.webp",
   "width": 1480,
   "height": 277,
   "surfaceLeft": 32,
   "surfaceRight": 1449,
   "walkY": 13
  },
  "small": {
   "source": "assets/stage-v5-hollow-small.png",
   "image": "assets/ready/stage-v5-hollow-small-41f12f8ecd439777.webp",
   "width": 808,
   "height": 116,
   "surfaceLeft": 51,
   "surfaceRight": 763,
   "walkY": 42
  }
 },
 "crystal": {
  "backgroundSource": "assets/stage-v7-crystal-background.png",
  "background": "assets/ready/stage-v7-crystal-background-87d2858591dbb60d.webp",
  "preview": "assets/ready/stage-picker-crystal-a0dc3d586aeb86d7.webp",
  "main": {
   "source": "assets/stage-v6-crystal-main.png",
   "image": "assets/ready/stage-v6-crystal-main-ce29a4c5ef73f828.webp",
   "width": 1516,
   "height": 229,
   "surfaceLeft": 11,
   "surfaceRight": 1504,
   "walkY": 9
  },
  "small": {
   "source": "assets/stage-v6-crystal-small.png",
   "image": "assets/ready/stage-v6-crystal-small-0ecec02ad7ab5728.webp",
   "width": 725,
   "height": 169,
   "surfaceLeft": 8,
   "surfaceRight": 716,
   "walkY": 9,
   "verticalScale": 0.54
  }
 },
 "dusk": {
  "backgroundSource": "assets/stage-v6-dusk-background.png",
  "background": "assets/ready/stage-v6-dusk-background-c5976b0717c1a907.webp",
  "preview": "assets/ready/stage-picker-dusk-670d671d0b0c2a2c.webp",
  "main": {
   "source": "assets/stage-v6-dusk-main.png",
   "image": "assets/ready/stage-v6-dusk-main-d50fa89d701b3af4.webp",
   "width": 1524,
   "height": 376,
   "surfaceLeft": 92,
   "surfaceRight": 1431,
   "walkY": 14
  },
  "small": {
   "source": "assets/stage-v6-dusk-small.png",
   "image": "assets/ready/stage-v6-dusk-small-aa197c084e5c1636.webp",
   "width": 707,
   "height": 187,
   "surfaceLeft": 15,
   "surfaceRight": 690,
   "walkY": 11,
   "verticalScale": 0.48
  }
 },
 "chrono": {
  "backgroundSource": "assets/stage-v7-chrono-background.png",
  "background": "assets/ready/stage-v7-chrono-background-843cfb21915a4621.webp",
  "preview": "assets/ready/stage-picker-chrono-854087e9a2f76b9f.webp",
  "main": {
   "source": "assets/stage-v7-chrono-main.png",
   "image": "assets/ready/stage-v7-chrono-main-52e3c691c96657d3.webp",
   "width": 1536,
   "height": 298,
   "surfaceLeft": 13,
   "surfaceRight": 1522,
   "walkY": 10
  },
  "small": {
   "source": "assets/stage-v7-chrono-small.png",
   "image": "assets/ready/stage-v7-chrono-small-6cfe296e368e76c2.webp",
   "width": 555,
   "height": 183,
   "surfaceLeft": 11,
   "surfaceRight": 544,
   "walkY": 10
  }
 },
 "windhill": {
  "backgroundSource": "assets/stage-v6-windhill-background.png",
  "background": "assets/ready/stage-v6-windhill-background-a9fb83834a073604.webp",
  "preview": "assets/ready/stage-picker-windhill-deaa4fd76ff93e62.webp",
  "main": {
   "source": "assets/stage-v6-windhill-main.png",
   "image": "assets/ready/stage-v6-windhill-main-4882d4bda18654db.webp",
   "width": 1529,
   "height": 281,
   "surfaceLeft": 31,
   "surfaceRight": 1497,
   "walkY": 32
  },
  "small": {
   "source": "assets/stage-v6-windhill-small.png",
   "image": "assets/ready/stage-v6-windhill-small-687f3f6bd3e5564b.webp",
   "width": 787,
   "height": 205,
   "surfaceLeft": 26,
   "surfaceRight": 761,
   "walkY": 25
  }
 },
 "gaur": {
  "backgroundSource": "assets/stage-v7-gaur-background.png",
  "background": "assets/ready/stage-v7-gaur-background-8ca98a3c8ed2bc35.webp",
  "preview": "assets/ready/stage-picker-gaur-ea15bab4b8bee514.webp",
  "main": {
   "source": "assets/stage-v7-gaur-main.png",
   "image": "assets/ready/stage-v7-gaur-main-9d7547d7820548fe.webp",
   "width": 2164,
   "height": 394,
   "surfaceLeft": 42,
   "surfaceRight": 2118,
   "walkY": 80
  },
  "small": {
   "source": "assets/stage-v7-gaur-small.png",
   "image": "assets/ready/stage-v7-gaur-small-c16305d4b6da0175.webp",
   "width": 1095,
   "height": 217,
   "surfaceLeft": 53,
   "surfaceRight": 1040,
   "walkY": 83
  }
 },
 "hylia": {
  "backgroundSource": "assets/stage-v8-hylia-background.png",
  "background": "assets/ready/stage-v8-hylia-background-295106ce2a1bd70e.webp",
  "preview": "assets/ready/stage-picker-hylia-60e3dbb9ef74cb48.webp",
  "main": {
   "source": "assets/stage-v8-hylia-main.png",
   "image": "assets/ready/stage-v8-hylia-main-11d71990040d819b.webp",
   "width": 1536,
   "height": 364,
   "surfaceLeft": 15,
   "surfaceRight": 1524,
   "walkY": 58,
   "verticalScale": 0.56
  },
  "small": {
   "source": "assets/stage-v8-hylia-small.png",
   "image": "assets/ready/stage-v8-hylia-small-6c2c45839cc0228b.webp",
   "width": 1350,
   "height": 146,
   "surfaceLeft": 26,
   "surfaceRight": 1325,
   "walkY": 28
  }
 },
 "cityruins": {
  "backgroundSource": "assets/stage-v8-cityruins-background.png",
  "background": "assets/ready/stage-v8-cityruins-background-84f61dd82cdeeaf6.webp",
  "preview": "assets/ready/stage-picker-cityruins-f92959cfceddba4a.webp",
  "main": {
   "source": "assets/stage-v8-cityruins-main.png",
   "image": "assets/ready/stage-v8-cityruins-main-dc3bfefe7b54cc1a.webp",
   "width": 1501,
   "height": 453,
   "surfaceLeft": 9,
   "surfaceRight": 1492,
   "walkY": 71,
   "verticalScale": 0.57
  },
  "small": {
   "source": "assets/stage-v8-cityruins-small.png",
   "image": "assets/ready/stage-v8-cityruins-small-a0dea0b679996f1b.webp",
   "width": 821,
   "height": 213,
   "surfaceLeft": 12,
   "surfaceRight": 808,
   "walkY": 46
  }
 },
 "rolante": {
  "backgroundSource": "assets/stage-v9-rolante-background.png",
  "background": "assets/ready/stage-v9-rolante-background-772098ae0589a04d.webp",
  "preview": "assets/ready/stage-picker-rolante-4d7a6d545a3742c4.webp",
  "main": {
   "source": "assets/stage-v9-rolante-main.png",
   "image": "assets/ready/stage-v9-rolante-main-442bc4ee7fc4d7e8.webp",
   "width": 1510,
   "height": 452,
   "surfaceLeft": 18,
   "surfaceRight": 1491,
   "walkY": 67,
   "verticalScale": 0.55
  },
  "small": {
   "source": "assets/stage-v9-rolante-small.png",
   "image": "assets/ready/stage-v9-rolante-small-ebdf7fd2ddccd2fb.webp",
   "width": 722,
   "height": 241,
   "surfaceLeft": 15,
   "surfaceRight": 707,
   "walkY": 46
  }
 },
 "crossing": {
  "backgroundSource": "assets/stage-v9-crossing-background.png",
  "background": "assets/ready/stage-v9-crossing-background-5368b0dce1c8402a.webp",
  "preview": "assets/ready/stage-picker-crossing-a3901d0e89e01942.webp",
  "main": {
   "source": "assets/stage-v9-crossing-main.png",
   "image": "assets/ready/stage-v9-crossing-main-dc31c7c86b625b6c.webp",
   "width": 1528,
   "height": 437,
   "surfaceLeft": 10,
   "surfaceRight": 1518,
   "walkY": 112,
   "verticalScale": 0.5
  },
  "small": {
   "source": "assets/stage-v9-crossing-small.png",
   "image": "assets/ready/stage-v9-crossing-small-30257e421218a39e.webp",
   "width": 818,
   "height": 212,
   "surfaceLeft": 10,
   "surfaceRight": 808,
   "walkY": 14,
   "verticalScale": 0.5
  }
 },
 "floatisles": {
  "backgroundSource": "assets/stage-v9-floatisles-background.png",
  "background": "assets/ready/stage-v9-floatisles-background-5f9919f81c93b07d.webp",
  "preview": "assets/ready/stage-picker-floatisles-9a4c36a04ac4650a.webp",
  "main": {
   "source": "assets/stage-v9-floatisles-main.png",
   "image": "assets/ready/stage-v9-floatisles-main-a1aa28371599d350.webp",
   "width": 1518,
   "height": 344,
   "surfaceLeft": 23,
   "surfaceRight": 1488,
   "walkY": 57,
   "verticalScale": 0.62
  },
  "small": {
   "source": "assets/stage-v9-floatisles-small.png",
   "image": "assets/ready/stage-v9-floatisles-small-09f5e8f86092d079.webp",
   "width": 759,
   "height": 216,
   "surfaceLeft": 17,
   "surfaceRight": 743,
   "walkY": 34
  }
 },
 "argentum": {
  "backgroundSource": "assets/stage-v9-argentum-background.png",
  "background": "assets/ready/stage-v9-argentum-background-441d29808c8aaa58.webp",
  "preview": "assets/ready/stage-picker-argentum-ee3d521a2f23dde2.webp",
  "main": {
   "source": "assets/stage-v9-argentum-main.png",
   "image": "assets/ready/stage-v9-argentum-main-132cd385a9931037.webp",
   "width": 1533,
   "height": 387,
   "surfaceLeft": 14,
   "surfaceRight": 1517,
   "walkY": 123,
   "verticalScale": 0.56
  },
  "small": {
   "source": "assets/stage-v9-argentum-small.png",
   "image": "assets/ready/stage-v9-argentum-small-85a21cdab39ff703.webp",
   "width": 766,
   "height": 230,
   "surfaceLeft": 14,
   "surfaceRight": 751,
   "walkY": 71
  }
 },
 "stone": {
  "backgroundSource": "assets/stage-v10-stone-background.png",
  "background": "assets/ready/stage-v10-stone-background-f2cb6adfff446776.webp",
  "preview": "assets/ready/stage-picker-stone-a44df06b109a58e9.webp",
  "main": {
   "source": "assets/stage-v10-stone-main.png",
   "image": "assets/ready/stage-v10-stone-main-f664d10ad3ea028e.webp",
   "width": 1525,
   "height": 369,
   "surfaceLeft": 7,
   "surfaceRight": 1516,
   "walkY": 9,
   "verticalScale": 0.6
  },
  "small": {
   "source": "assets/stage-v10-stone-small.png",
   "image": "assets/ready/stage-v10-stone-small-b03bfb0cbeccac86.webp",
   "width": 807,
   "height": 228,
   "surfaceLeft": 7,
   "surfaceRight": 799,
   "walkY": 9
  }
 },
 "tartarus": {
  "backgroundSource": "assets/stage-v10-tartarus-background.png",
  "background": "assets/ready/stage-v10-tartarus-background-f22833d54e62c2ab.webp",
  "preview": "assets/ready/stage-picker-tartarus-783ca0814dec5922.webp",
  "main": {
   "source": "assets/stage-v10-tartarus-main.png",
   "image": "assets/ready/stage-v10-tartarus-main-d2aa3a658d6ae78c.webp",
   "width": 1518,
   "height": 293,
   "surfaceLeft": 7,
   "surfaceRight": 1509,
   "walkY": 9,
   "verticalScale": 0.65
  },
  "small": {
   "source": "assets/stage-v10-tartarus-small.png",
   "image": "assets/ready/stage-v10-tartarus-small-d5b57b08eb4f6f6f.webp",
   "width": 699,
   "height": 169,
   "surfaceLeft": 8,
   "surfaceRight": 691,
   "walkY": 9
  }
 },
 "shrine": {
  "backgroundSource": "assets/stage-v10-shrine-background.png",
  "background": "assets/ready/stage-v10-shrine-background-55ee8ff2f04c2fa7.webp",
  "preview": "assets/ready/stage-picker-shrine-f5f94c8146c691f1.webp",
  "main": {
   "source": "assets/stage-v10-shrine-main.png",
   "image": "assets/ready/stage-v10-shrine-main-4a79df0d0f8c1307.webp",
   "width": 1517,
   "height": 304,
   "surfaceLeft": 26,
   "surfaceRight": 1490,
   "walkY": 10,
   "verticalScale": 0.6
  },
  "small": {
   "source": "assets/stage-v10-shrine-small.png",
   "image": "assets/ready/stage-v10-shrine-small-4d5956910d0d0e5b.webp",
   "width": 576,
   "height": 216,
   "surfaceLeft": 22,
   "surfaceRight": 553,
   "walkY": 10
  }
 },
 "meteobelt": {
  "backgroundSource": "assets/stage-v10-meteobelt-background.png",
  "background": "assets/ready/stage-v10-meteobelt-background-23e101f42fd4e3c8.webp",
  "preview": "assets/ready/stage-picker-meteobelt-0c55f3a9513945db.webp",
  "main": {
   "source": "assets/stage-v10-meteobelt-main.png",
   "image": "assets/ready/stage-v10-meteobelt-main-a96ad35d5e3dcad6.webp",
   "width": 1511,
   "height": 371,
   "surfaceLeft": 7,
   "surfaceRight": 1502,
   "walkY": 9,
   "verticalScale": 0.62
  },
  "small": {
   "source": "assets/stage-v10-meteobelt-small.png",
   "image": "assets/ready/stage-v10-meteobelt-small-a85fa717de10824c.webp",
   "width": 568,
   "height": 184,
   "surfaceLeft": 7,
   "surfaceRight": 560,
   "walkY": 9
  }
 },
 "swordcity": {
  "backgroundSource": "assets/stage-v11-swordcity-background.png",
  "background": "assets/ready/stage-v11-swordcity-background-d93b11555b4493d7.webp",
  "preview": "assets/ready/stage-picker-swordcity-3dce47e8ddc03755.webp",
  "main": {
   "source": "assets/stage-v11-swordcity-main.png",
   "image": "assets/ready/stage-v11-swordcity-main-09e397b4d1b95c4c.webp",
   "width": 1478,
   "height": 298,
   "surfaceLeft": 7,
   "surfaceRight": 1470,
   "walkY": 10,
   "verticalScale": 0.66
  },
  "small": {
   "source": "assets/stage-v11-swordcity-small.png",
   "image": "assets/ready/stage-v11-swordcity-small-a131ca11e7c5a0da.webp",
   "width": 826,
   "height": 142,
   "surfaceLeft": 7,
   "surfaceRight": 818,
   "walkY": 48
  }
 },
 "inkplaza": {
  "backgroundSource": "assets/stage-v11-inkplaza-background.png",
  "background": "assets/ready/stage-v11-inkplaza-background-0bf75797b358454e.webp",
  "preview": "assets/ready/stage-picker-inkplaza-40adfdccf0830739.webp",
  "main": {
   "source": "assets/stage-v11-inkplaza-main.png",
   "image": "assets/ready/stage-v11-inkplaza-main-3b188429810128b8.webp",
   "width": 1518,
   "height": 400,
   "surfaceLeft": 12,
   "surfaceRight": 1505,
   "walkY": 208,
   "verticalScale": 0.57
  },
  "small": {
   "source": "assets/stage-v11-inkplaza-small.png",
   "image": "assets/ready/stage-v11-inkplaza-small-789ee06ad20fe480.webp",
   "width": 868,
   "height": 209,
   "surfaceLeft": 10,
   "surfaceRight": 857,
   "walkY": 54
  }
 },
 "snowdin": {
  "backgroundSource": "assets/stage-v11-snowdin-background.png",
  "background": "assets/ready/stage-v11-snowdin-background-3bb205f096f56c82.webp",
  "preview": "assets/ready/stage-picker-snowdin-6f409e7da096ea21.webp",
  "main": {
   "source": "assets/stage-v11-snowdin-main.png",
   "image": "assets/ready/stage-v11-snowdin-main-213e598845217cad.webp",
   "width": 1514,
   "height": 302,
   "surfaceLeft": 24,
   "surfaceRight": 1489,
   "walkY": 11,
   "verticalScale": 0.59
  },
  "small": {
   "source": "assets/stage-v11-snowdin-small.png",
   "image": "assets/ready/stage-v11-snowdin-small-23b43cbdc930a72d.webp",
   "width": 828,
   "height": 184,
   "surfaceLeft": 15,
   "surfaceRight": 812,
   "walkY": 10
  }
 },
 "kamiki": {
  "backgroundSource": "assets/stage-v11-kamiki-background.png",
  "background": "assets/ready/stage-v11-kamiki-background-b5bbd7b4e6cc0b78.webp",
  "preview": "assets/ready/stage-picker-kamiki-cc5e14b5d1bd4e37.webp",
  "main": {
   "source": "assets/stage-v11-kamiki-main.png",
   "image": "assets/ready/stage-v11-kamiki-main-5965da948c1654d4.webp",
   "width": 1505,
   "height": 382,
   "surfaceLeft": 13,
   "surfaceRight": 1489,
   "walkY": 53,
   "verticalScale": 0.61
  },
  "small": {
   "source": "assets/stage-v11-kamiki-small.png",
   "image": "assets/ready/stage-v11-kamiki-small-3b0f1c9ff09e03bd.webp",
   "width": 820,
   "height": 177,
   "surfaceLeft": 14,
   "surfaceRight": 806,
   "walkY": 21
  }
 },
 "avalon": {
  "backgroundSource": "assets/stage-v12-avalon-background.png",
  "background": "assets/ready/stage-v12-avalon-background-58642c357fac6b8e.webp",
  "preview": "assets/ready/stage-picker-avalon-f4e5cba7ae3b88e2.webp",
  "main": {
   "source": "assets/stage-v12-avalon-main.png",
   "image": "assets/ready/stage-v12-avalon-main-2bb28bbe03952ae6.webp",
   "width": 1732,
   "height": 375,
   "surfaceLeft": 68,
   "surfaceRight": 1664,
   "walkY": 11,
   "verticalScale": 0.61
  },
  "small": {
   "source": "assets/stage-v12-avalon-small.png",
   "image": "assets/ready/stage-v12-avalon-small-c7e97a076c25db92.webp",
   "width": 924,
   "height": 201,
   "surfaceLeft": 14,
   "surfaceRight": 909,
   "walkY": 22
  }
 },
 "ripple": {
  "backgroundSource": "assets/stage-v12-ripple-background.png",
  "background": "assets/ready/stage-v12-ripple-background-015e7cde1fd9c18d.webp",
  "preview": "assets/ready/stage-picker-ripple-472b7eb1ea2c5ead.webp",
  "main": {
   "source": "assets/stage-v12-ripple-main.png",
   "image": "assets/ready/stage-v12-ripple-main-f9e65e60098cefe6.webp",
   "width": 1757,
   "height": 294,
   "surfaceLeft": 84,
   "surfaceRight": 1670,
   "walkY": 11,
   "verticalScale": 0.65
  },
  "small": {
   "source": "assets/stage-v12-ripple-small.png",
   "image": "assets/ready/stage-v12-ripple-small-ad2b355a8f0aa442.webp",
   "width": 950,
   "height": 186,
   "surfaceLeft": 48,
   "surfaceRight": 902,
   "walkY": 13
  }
 },
 "chemical": {
  "backgroundSource": "assets/stage-v12-chemical-background.png",
  "background": "assets/ready/stage-v12-chemical-background-1aa3fe948a6cc764.webp",
  "preview": "assets/ready/stage-picker-chemical-d411a45e3c14e31e.webp",
  "main": {
   "source": "assets/stage-v12-chemical-main.png",
   "image": "assets/ready/stage-v12-chemical-main-f336a7284b129ed7.webp",
   "width": 1722,
   "height": 349,
   "surfaceLeft": 63,
   "surfaceRight": 1659,
   "walkY": 11,
   "verticalScale": 0.57
  },
  "small": {
   "source": "assets/stage-v12-chemical-small.png",
   "image": "assets/ready/stage-v12-chemical-small-42dec682d9acaa3f.webp",
   "width": 970,
   "height": 205,
   "surfaceLeft": 39,
   "surfaceRight": 931,
   "walkY": 9
  }
 },
 "monastery": {
  "backgroundSource": "assets/stage-v12-monastery-background.png",
  "background": "assets/ready/stage-v12-monastery-background-76973ede24422755.webp",
  "preview": "assets/ready/stage-picker-monastery-dcae3713235e2d13.webp",
  "main": {
   "source": "assets/stage-v12-monastery-main.png",
   "image": "assets/ready/stage-v12-monastery-main-dc615685f98301f2.webp",
   "width": 1752,
   "height": 344,
   "surfaceLeft": 85,
   "surfaceRight": 1666,
   "walkY": 9,
   "verticalScale": 0.61
  },
  "small": {
   "source": "assets/stage-v12-monastery-small.png",
   "image": "assets/ready/stage-v12-monastery-small-a4d62357d2fcdbbe.webp",
   "width": 960,
   "height": 209,
   "surfaceLeft": 34,
   "surfaceRight": 925,
   "walkY": 9
  }
 },
 "grandship": {
  "backgroundSource": "assets/stage-v13-grandship-background.png",
  "background": "assets/ready/stage-v13-grandship-background-71a44ba1cdeac6aa.webp",
  "preview": "assets/ready/stage-picker-grandship-63c97f35c8c7c9b3.webp",
  "main": {
   "source": "assets/stage-v13-grandship-main.png",
   "image": "assets/ready/stage-v13-grandship-main-2704db67369d01e9.webp",
   "width": 1527,
   "height": 311,
   "surfaceLeft": 45,
   "surfaceRight": 1482,
   "walkY": 11,
   "verticalScale": 0.61
  },
  "small": {
   "source": "assets/stage-v13-grandship-small.png",
   "image": "assets/ready/stage-v13-grandship-small-38ba1618fb9b2765.webp",
   "width": 754,
   "height": 212,
   "surfaceLeft": 25,
   "surfaceRight": 728,
   "walkY": 10
  }
 },
 "cogito": {
  "backgroundSource": "assets/stage-v13-cogito-background.png",
  "background": "assets/ready/stage-v13-cogito-background-7823fa813066a556.webp",
  "preview": "assets/ready/stage-picker-cogito-451a2a559e2c75e6.webp",
  "main": {
   "source": "assets/stage-v13-cogito-main.png",
   "image": "assets/ready/stage-v13-cogito-main-00736b14028e0b29.webp",
   "width": 1493,
   "height": 239,
   "surfaceLeft": 40,
   "surfaceRight": 1451,
   "walkY": 12,
   "verticalScale": 0.6
  },
  "small": {
   "source": "assets/stage-v13-cogito-small.png",
   "image": "assets/ready/stage-v13-cogito-small-1be5215582b92c2f.webp",
   "width": 761,
   "height": 156,
   "surfaceLeft": 30,
   "surfaceRight": 730,
   "walkY": 12
  }
 },
 "batical": {
  "backgroundSource": "assets/stage-v13-batical-background.png",
  "background": "assets/ready/stage-v13-batical-background-a0c38775f992ffa3.webp",
  "preview": "assets/ready/stage-picker-batical-aec89a5ca80b4991.webp",
  "main": {
   "source": "assets/stage-v13-batical-main.png",
   "image": "assets/ready/stage-v13-batical-main-830dd26a69d47c19.webp",
   "width": 1503,
   "height": 284,
   "surfaceLeft": 21,
   "surfaceRight": 1481,
   "walkY": 9,
   "verticalScale": 0.57
  },
  "small": {
   "source": "assets/stage-v13-batical-small.png",
   "image": "assets/ready/stage-v13-batical-small-e31a407af8cd0673.webp",
   "width": 772,
   "height": 244,
   "surfaceLeft": 24,
   "surfaceRight": 746,
   "walkY": 30
  }
 },
 "hexa": {
  "backgroundSource": "assets/stage-v13-hexa-background.png",
  "background": "assets/ready/stage-v13-hexa-background-a7b62b1a549e8c81.webp",
  "preview": "assets/ready/stage-picker-hexa-ef8e56f0fbaccbc2.webp",
  "main": {
   "source": "assets/stage-v13-hexa-main.png",
   "image": "assets/ready/stage-v13-hexa-main-b6a3854f3c6e333c.webp",
   "width": 1495,
   "height": 377,
   "surfaceLeft": 11,
   "surfaceRight": 1484,
   "walkY": 9,
   "verticalScale": 0.62
  },
  "small": {
   "source": "assets/stage-v13-hexa-small.png",
   "image": "assets/ready/stage-v13-hexa-small-82b729c64ff35363.webp",
   "width": 800,
   "height": 156,
   "surfaceLeft": 26,
   "surfaceRight": 774,
   "walkY": 10
  }
 },
 "kamuro": {
  "backgroundSource": "assets/stage-v14-kamuro-background.png",
  "background": "assets/ready/stage-v14-kamuro-background-f2e441b3f0043bb1.webp",
  "preview": "assets/ready/stage-picker-kamuro-ab0f71cc6fff6b48.webp",
  "main": {
   "source": "assets/stage-v14-kamuro-main.png",
   "image": "assets/ready/stage-v14-kamuro-main-eccba20f9dbfdf7b.webp",
   "width": 1524,
   "height": 214,
   "surfaceLeft": 57,
   "surfaceRight": 1466,
   "walkY": 10,
   "verticalScale": 0.63
  },
  "small": {
   "source": "assets/stage-v14-kamuro-small.png",
   "image": "assets/ready/stage-v14-kamuro-small-bb7703e59e2bf873.webp",
   "width": 794,
   "height": 138,
   "surfaceLeft": 29,
   "surfaceRight": 764,
   "walkY": 8
  }
 },
 "rpd": {
  "backgroundSource": "assets/stage-v14-rpd-background.png",
  "background": "assets/ready/stage-v14-rpd-background-1b8ed90eceb3cec1.webp",
  "preview": "assets/ready/stage-picker-rpd-6291a490ea2d1be8.webp",
  "main": {
   "source": "assets/stage-v14-rpd-main.png",
   "image": "assets/ready/stage-v14-rpd-main-a4d369fc51ff9578.webp",
   "width": 1524,
   "height": 326,
   "surfaceLeft": 65,
   "surfaceRight": 1458,
   "walkY": 9,
   "verticalScale": 0.65
  },
  "small": {
   "source": "assets/stage-v14-rpd-small.png",
   "image": "assets/ready/stage-v14-rpd-small-8300fc860e14ca06.webp",
   "width": 808,
   "height": 195,
   "surfaceLeft": 15,
   "surfaceRight": 792,
   "walkY": 9
  }
 },
 "sylvalum": {
  "backgroundSource": "assets/stage-v14-sylvalum-background.png",
  "background": "assets/ready/stage-v14-sylvalum-background-73d394433724bd60.webp",
  "preview": "assets/ready/stage-picker-sylvalum-c05b7f6836f6db9f.webp",
  "main": {
   "source": "assets/stage-v14-sylvalum-main.png",
   "image": "assets/ready/stage-v14-sylvalum-main-487a38f7c884aedd.webp",
   "width": 1504,
   "height": 331,
   "surfaceLeft": 37,
   "surfaceRight": 1466,
   "walkY": 11,
   "verticalScale": 0.61
  },
  "small": {
   "source": "assets/stage-v14-sylvalum-small.png",
   "image": "assets/ready/stage-v14-sylvalum-small-6441168dac8398d2.webp",
   "width": 778,
   "height": 164,
   "surfaceLeft": 26,
   "surfaceRight": 750,
   "walkY": 9
  }
 },
 "booster": {
  "backgroundSource": "assets/stage-v14-booster-background.png",
  "background": "assets/ready/stage-v14-booster-background-94f0abee1d911f5b.webp",
  "preview": "assets/ready/stage-picker-booster-2ace61328e5838bd.webp",
  "main": {
   "source": "assets/stage-v14-booster-main.png",
   "image": "assets/ready/stage-v14-booster-main-60d0c1b5b0bed08b.webp",
   "width": 1526,
   "height": 218,
   "surfaceLeft": 50,
   "surfaceRight": 1475,
   "walkY": 9,
   "verticalScale": 0.61
  },
  "small": {
   "source": "assets/stage-v14-booster-small.png",
   "image": "assets/ready/stage-v14-booster-small-7bbef2706b3dac8d.webp",
   "width": 777,
   "height": 191,
   "surfaceLeft": 26,
   "surfaceRight": 751,
   "walkY": 10
  }
 },
 "bellhill": {
  "backgroundSource": "assets/stage-v15-bellhill-background.png",
  "background": "assets/ready/stage-v15-bellhill-background-4ad8f0ed59ab60cd.webp",
  "preview": "assets/ready/stage-picker-bellhill-35241fb07f8b1bc8.webp",
  "main": {
   "source": "assets/stage-v15-bellhill-main.png",
   "image": "assets/ready/stage-v15-bellhill-main-023fe9501ed3f788.webp",
   "width": 1495,
   "height": 247,
   "surfaceLeft": 29,
   "surfaceRight": 1469,
   "walkY": 13,
   "verticalScale": 0.64
  },
  "small": {
   "source": "assets/stage-v15-bellhill-small.png",
   "image": "assets/ready/stage-v15-bellhill-small-42208726284f89ac.webp",
   "width": 774,
   "height": 190,
   "surfaceLeft": 19,
   "surfaceRight": 755,
   "walkY": 38
  }
 },
 "ebisu": {
  "backgroundSource": "assets/stage-v15-ebisu-background.png",
  "background": "assets/ready/stage-v15-ebisu-background-027b8086b32f5901.webp",
  "preview": "assets/ready/stage-picker-ebisu-66b9b7d6f7b20b61.webp",
  "main": {
   "source": "assets/stage-v15-ebisu-main.png",
   "image": "assets/ready/stage-v15-ebisu-main-31bde7baaa58b3d4.webp",
   "width": 1523,
   "height": 331,
   "surfaceLeft": 52,
   "surfaceRight": 1471,
   "walkY": 9,
   "verticalScale": 0.6
  },
  "small": {
   "source": "assets/stage-v15-ebisu-small.png",
   "image": "assets/ready/stage-v15-ebisu-small-c4fe01c09875ca72.webp",
   "width": 882,
   "height": 148,
   "surfaceLeft": 42,
   "surfaceRight": 839,
   "walkY": 10
  }
 },
 "celadon": {
  "backgroundSource": "assets/stage-v15-celadon-background.png",
  "background": "assets/ready/stage-v15-celadon-background-68d88a93b64b6516.webp",
  "preview": "assets/ready/stage-picker-celadon-2d4fcb5b777cad0b.webp",
  "main": {
   "source": "assets/stage-v15-celadon-main.png",
   "image": "assets/ready/stage-v15-celadon-main-282fa286b63286c7.webp",
   "width": 1495,
   "height": 279,
   "surfaceLeft": 45,
   "surfaceRight": 1449,
   "walkY": 9,
   "verticalScale": 0.6
  },
  "small": {
   "source": "assets/stage-v15-celadon-small.png",
   "image": "assets/ready/stage-v15-celadon-small-677a6e9d8ff0abb2.webp",
   "width": 779,
   "height": 177,
   "surfaceLeft": 25,
   "surfaceRight": 752,
   "walkY": 9
  }
 },
 "inaba": {
  "backgroundSource": "assets/stage-v15-inaba-background.png",
  "background": "assets/ready/stage-v15-inaba-background-1071b0ddd5bdd475.webp",
  "preview": "assets/ready/stage-picker-inaba-c59fea27b3e8f6c6.webp",
  "main": {
   "source": "assets/stage-v15-inaba-main.png",
   "image": "assets/ready/stage-v15-inaba-main-ce9b08b78da4bb35.webp",
   "width": 1536,
   "height": 324,
   "surfaceLeft": 37,
   "surfaceRight": 1499,
   "walkY": 10,
   "verticalScale": 0.65
  },
  "small": {
   "source": "assets/stage-v15-inaba-small.png",
   "image": "assets/ready/stage-v15-inaba-small-5318ffaad6613291.webp",
   "width": 831,
   "height": 196,
   "surfaceLeft": 8,
   "surfaceRight": 822,
   "walkY": 9
  }
 },
 "kurken": {
  "backgroundSource": "assets/stage-v16-kurken-background.png",
  "background": "assets/ready/stage-v16-kurken-background-a60db7336442da47.webp",
  "preview": "assets/ready/stage-picker-kurken-248dcf1fe1296774.webp",
  "main": {
   "source": "assets/stage-v16-kurken-main.png",
   "image": "assets/ready/stage-v16-kurken-main-95731de3e861cd93.webp",
   "width": 1502,
   "height": 326,
   "surfaceLeft": 12,
   "surfaceRight": 1489,
   "walkY": 11,
   "verticalScale": 0.62
  },
  "small": {
   "source": "assets/stage-v16-kurken-small.png",
   "image": "assets/ready/stage-v16-kurken-small-9e81c0b4024614e1.webp",
   "width": 777,
   "height": 139,
   "surfaceLeft": 8,
   "surfaceRight": 768,
   "walkY": 9
  }
 },
 "castaway": {
  "backgroundSource": "assets/stage-v16-castaway-background.png",
  "background": "assets/ready/stage-v16-castaway-background-5fe13499081b6288.webp",
  "preview": "assets/ready/stage-picker-castaway-87923f12c5a944d6.webp",
  "main": {
   "source": "assets/stage-v16-castaway-main.png",
   "image": "assets/ready/stage-v16-castaway-main-aaa1f9a096fd0191.webp",
   "width": 1522,
   "height": 292,
   "surfaceLeft": 52,
   "surfaceRight": 1471,
   "walkY": 19,
   "verticalScale": 0.63
  },
  "small": {
   "source": "assets/stage-v16-castaway-small.png",
   "image": "assets/ready/stage-v16-castaway-small-c24d4759d0aff1dd.webp",
   "width": 758,
   "height": 201,
   "surfaceLeft": 24,
   "surfaceRight": 736,
   "walkY": 10
  }
 },
 "suoh": {
  "backgroundSource": "assets/stage-v16-suoh-background.png",
  "background": "assets/ready/stage-v16-suoh-background-3ad2fa92c2cd8117.webp",
  "preview": "assets/ready/stage-picker-suoh-5c5c89abe60a4666.webp",
  "main": {
   "source": "assets/stage-v16-suoh-main.png",
   "image": "assets/ready/stage-v16-suoh-main-cd947fbf13cdb1e0.webp",
   "width": 1524,
   "height": 233,
   "surfaceLeft": 41,
   "surfaceRight": 1483,
   "walkY": 13,
   "verticalScale": 0.61
  },
  "small": {
   "source": "assets/stage-v16-suoh-small.png",
   "image": "assets/ready/stage-v16-suoh-small-ba8e7d356d8b8e5f.webp",
   "width": 778,
   "height": 157,
   "surfaceLeft": 37,
   "surfaceRight": 740,
   "walkY": 9
  }
 },
 "liurnia": {
  "backgroundSource": "assets/stage-v16-liurnia-background.png",
  "background": "assets/ready/stage-v16-liurnia-background-119a5f096a7503d7.webp",
  "preview": "assets/ready/stage-picker-liurnia-dcac08cf2b2b0a6a.webp",
  "main": {
   "source": "assets/stage-v16-liurnia-main.png",
   "image": "assets/ready/stage-v16-liurnia-main-586ff61b9666579b.webp",
   "width": 1523,
   "height": 364,
   "surfaceLeft": 18,
   "surfaceRight": 1507,
   "walkY": 9,
   "verticalScale": 0.62
  },
  "small": {
   "source": "assets/stage-v16-liurnia-small.png",
   "image": "assets/ready/stage-v16-liurnia-small-d92a98527ec3ef7c.webp",
   "width": 765,
   "height": 196,
   "surfaceLeft": 12,
   "surfaceRight": 754,
   "walkY": 9
  }
 },
 "astral": {
  "backgroundSource": "assets/stage-v17-astral-background.png",
  "background": "assets/ready/stage-v17-astral-background-2dbf5b5d71806994.webp",
  "preview": "assets/ready/stage-picker-astral-5f936de1180f3ba5.webp",
  "main": {
   "source": "assets/stage-v17-astral-main.png",
   "image": "assets/ready/stage-v17-astral-main-c8a49584636afda5.webp",
   "width": 1507,
   "height": 304,
   "surfaceLeft": 18,
   "surfaceRight": 1486,
   "walkY": 9,
   "verticalScale": 0.63
  },
  "small": {
   "source": "assets/stage-v17-astral-small.png",
   "image": "assets/ready/stage-v17-astral-small-4251bd5edbe15973.webp",
   "width": 774,
   "height": 174,
   "surfaceLeft": 17,
   "surfaceRight": 764,
   "walkY": 8
  }
 },
 "sol": {
  "backgroundSource": "assets/stage-v17-sol-background.png",
  "background": "assets/ready/stage-v17-sol-background-d88f01b473bd682b.webp",
  "preview": "assets/ready/stage-picker-sol-d9ce6e373090deef.webp",
  "main": {
   "source": "assets/stage-v17-sol-main.png",
   "image": "assets/ready/stage-v17-sol-main-649a7e848a56617b.webp",
   "width": 1514,
   "height": 312,
   "surfaceLeft": 49,
   "surfaceRight": 1465,
   "walkY": 9,
   "verticalScale": 0.63
  },
  "small": {
   "source": "assets/stage-v17-sol-small.png",
   "image": "assets/ready/stage-v17-sol-small-5a7b2819f96929e9.webp",
   "width": 776,
   "height": 175,
   "surfaceLeft": 27,
   "surfaceRight": 751,
   "walkY": 9
  }
 },
 "diamond": {
  "backgroundSource": "assets/stage-v17-diamond-background.png",
  "background": "assets/ready/stage-v17-diamond-background-5ccf2c4446e072da.webp",
  "preview": "assets/ready/stage-picker-diamond-38bbb47e5eaa7535.webp",
  "main": {
   "source": "assets/stage-v17-diamond-main.png",
   "image": "assets/ready/stage-v17-diamond-main-9cf51b3b16f04bf3.webp",
   "width": 1510,
   "height": 318,
   "surfaceLeft": 19,
   "surfaceRight": 1490,
   "walkY": 11,
   "verticalScale": 0.59
  },
  "small": {
   "source": "assets/stage-v17-diamond-small.png",
   "image": "assets/ready/stage-v17-diamond-small-7f09b3ec15a9ffb3.webp",
   "width": 756,
   "height": 151,
   "surfaceLeft": 11,
   "surfaceRight": 744,
   "walkY": 9
  }
 },
 "barudo": {
  "backgroundSource": "assets/stage-v17-barudo-background.png",
  "background": "assets/ready/stage-v17-barudo-background-c0550601481cd6be.webp",
  "preview": "assets/ready/stage-picker-barudo-61fff75af22295ad.webp",
  "main": {
   "source": "assets/stage-v17-barudo-main.png",
   "image": "assets/ready/stage-v17-barudo-main-a87eb6e7d484dff2.webp",
   "width": 1524,
   "height": 315,
   "surfaceLeft": 18,
   "surfaceRight": 1507,
   "walkY": 10,
   "verticalScale": 0.63
  },
  "small": {
   "source": "assets/stage-v17-barudo-small.png",
   "image": "assets/ready/stage-v17-barudo-small-a7397014eb624e6d.webp",
   "width": 779,
   "height": 190,
   "surfaceLeft": 16,
   "surfaceRight": 761,
   "walkY": 9
  }
 },
 "sanderson": {
  "backgroundSource": "assets/stage-v18-sanderson-background.png",
  "background": "assets/ready/stage-v18-sanderson-background-2a74a44777d0cbce.webp",
  "preview": "assets/ready/stage-picker-sanderson-f64b442c25044861.webp",
  "main": {
   "source": "assets/stage-v18-sanderson-main.png",
   "image": "assets/ready/stage-v18-sanderson-main-f6162222e3d0315a.webp",
   "width": 1509,
   "height": 328,
   "surfaceLeft": 57,
   "surfaceRight": 1451,
   "walkY": 9,
   "verticalScale": 0.66
  },
  "small": {
   "source": "assets/stage-v18-sanderson-small.png",
   "image": "assets/ready/stage-v18-sanderson-small-b4f1e4b023bcfe5a.webp",
   "width": 816,
   "height": 118,
   "surfaceLeft": 21,
   "surfaceRight": 794,
   "walkY": 10
  }
 },
 "aumaan": {
  "backgroundSource": "assets/stage-v18-aumaan-background.png",
  "background": "assets/ready/stage-v18-aumaan-background-ceff214d79a13496.webp",
  "preview": "assets/ready/stage-picker-aumaan-b9212ada70b4f610.webp",
  "main": {
   "source": "assets/stage-v18-aumaan-main.png",
   "image": "assets/ready/stage-v18-aumaan-main-cf01612b795f8eef.webp",
   "width": 1520,
   "height": 259,
   "surfaceLeft": 59,
   "surfaceRight": 1460,
   "walkY": 11,
   "verticalScale": 0.62
  },
  "small": {
   "source": "assets/stage-v18-aumaan-small.png",
   "image": "assets/ready/stage-v18-aumaan-small-97cc4acdb7b18b49.webp",
   "width": 792,
   "height": 136,
   "surfaceLeft": 22,
   "surfaceRight": 769,
   "walkY": 10
  }
 },
 "meridian": {
  "backgroundSource": "assets/stage-v18-meridian-background.png",
  "background": "assets/ready/stage-v18-meridian-background-dee5fc99a75b07e0.webp",
  "preview": "assets/ready/stage-picker-meridian-4a7ceb46977585ad.webp",
  "main": {
   "source": "assets/stage-v18-meridian-main.png",
   "image": "assets/ready/stage-v18-meridian-main-86254b88ee7d6f39.webp",
   "width": 1512,
   "height": 296,
   "surfaceLeft": 32,
   "surfaceRight": 1479,
   "walkY": 10,
   "verticalScale": 0.62
  },
  "small": {
   "source": "assets/stage-v18-meridian-small.png",
   "image": "assets/ready/stage-v18-meridian-small-dbf6ad416dec478e.webp",
   "width": 757,
   "height": 189,
   "surfaceLeft": 20,
   "surfaceRight": 736,
   "walkY": 8
  }
 },
 "calaglia": {
  "backgroundSource": "assets/stage-v18-calaglia-background.png",
  "background": "assets/ready/stage-v18-calaglia-background-a2cd759a0e92d93f.webp",
  "preview": "assets/ready/stage-picker-calaglia-3ee55e06643ace7c.webp",
  "main": {
   "source": "assets/stage-v18-calaglia-main.png",
   "image": "assets/ready/stage-v18-calaglia-main-6e78b615f693de2d.webp",
   "width": 1524,
   "height": 284,
   "surfaceLeft": 33,
   "surfaceRight": 1489,
   "walkY": 12,
   "verticalScale": 0.6
  },
  "small": {
   "source": "assets/stage-v18-calaglia-small.png",
   "image": "assets/ready/stage-v18-calaglia-small-6eb8d76cfdbbfc38.webp",
   "width": 782,
   "height": 175,
   "surfaceLeft": 17,
   "surfaceRight": 768,
   "walkY": 9
  }
 },
 "rolent": {
  "backgroundSource": "assets/stage-v19-rolent-background.png",
  "background": "assets/ready/stage-v19-rolent-background-22c5a9fa2d58f6b1.webp",
  "preview": "assets/ready/stage-picker-rolent-80a8a9f5c827d867.webp",
  "main": {
   "source": "assets/stage-v19-rolent-main.png",
   "image": "assets/ready/stage-v19-rolent-main-e5bdbc1e52ce5677.webp",
   "width": 1520,
   "height": 242,
   "surfaceLeft": 15,
   "surfaceRight": 1505,
   "walkY": 10,
   "verticalScale": 0.65
  },
  "small": {
   "source": "assets/stage-v19-rolent-small.png",
   "image": "assets/ready/stage-v19-rolent-small-905e1d308373c4d4.webp",
   "width": 740,
   "height": 193,
   "surfaceLeft": 12,
   "surfaceRight": 726,
   "walkY": 10
  }
 },
 "sakura": {
  "backgroundSource": "assets/stage-v19-sakura-background.png",
  "background": "assets/ready/stage-v19-sakura-background-c13178d4e2a38a75.webp",
  "preview": "assets/ready/stage-picker-sakura-1adcee154944df42.webp",
  "main": {
   "source": "assets/stage-v19-sakura-main.png",
   "image": "assets/ready/stage-v19-sakura-main-c4efa311fbd39e70.webp",
   "width": 1490,
   "height": 309,
   "surfaceLeft": 15,
   "surfaceRight": 1474,
   "walkY": 9,
   "verticalScale": 0.6
  },
  "small": {
   "source": "assets/stage-v19-sakura-small.png",
   "image": "assets/ready/stage-v19-sakura-small-a73cc2307b2f2f30.webp",
   "width": 766,
   "height": 155,
   "surfaceLeft": 30,
   "surfaceRight": 734,
   "walkY": 9
  }
 },
 "hagure": {
  "backgroundSource": "assets/stage-v19-hagure-background.png",
  "background": "assets/ready/stage-v19-hagure-background-478ea66951401391.webp",
  "preview": "assets/ready/stage-picker-hagure-3098587425511a1c.webp",
  "main": {
   "source": "assets/stage-v19-hagure-main.png",
   "image": "assets/ready/stage-v19-hagure-main-069bc8f20f15bd5f.webp",
   "width": 1518,
   "height": 257,
   "surfaceLeft": 42,
   "surfaceRight": 1473,
   "walkY": 10,
   "verticalScale": 0.63
  },
  "small": {
   "source": "assets/stage-v19-hagure-small.png",
   "image": "assets/ready/stage-v19-hagure-small-e42ad0aa86864657.webp",
   "width": 809,
   "height": 220,
   "surfaceLeft": 37,
   "surfaceRight": 771,
   "walkY": 8
  }
 },
 "nefcity": {
  "backgroundSource": "assets/stage-v19-nefcity-background.png",
  "background": "assets/ready/stage-v19-nefcity-background-ace53a612b42b5e7.webp",
  "preview": "assets/ready/stage-picker-nefcity-8346f96cf3d67e31.webp",
  "main": {
   "source": "assets/stage-v19-nefcity-main.png",
   "image": "assets/ready/stage-v19-nefcity-main-3e5b309ff6e41997.webp",
   "width": 1526,
   "height": 304,
   "surfaceLeft": 46,
   "surfaceRight": 1479,
   "walkY": 9,
   "verticalScale": 0.61
  },
  "small": {
   "source": "assets/stage-v19-nefcity-small.png",
   "image": "assets/ready/stage-v19-nefcity-small-097467d4b237f221.webp",
   "width": 830,
   "height": 148,
   "surfaceLeft": 28,
   "surfaceRight": 801,
   "walkY": 9
  }
 },
 "momoland": {
  "backgroundSource": "assets/stage-v20-momoland-background.png",
  "background": "assets/ready/stage-v20-momoland-background-34fe27e948177cc5.webp",
  "preview": "assets/ready/stage-picker-momoland-97fc2d969445f81e.webp",
  "main": {
   "source": "assets/stage-v20-momoland-main.png",
   "image": "assets/ready/stage-v20-momoland-main-a86d6400b7fd4196.webp",
   "width": 1446,
   "height": 213,
   "surfaceLeft": 27,
   "surfaceRight": 1418,
   "walkY": 9,
   "verticalScale": 0.61
  },
  "small": {
   "source": "assets/stage-v20-momoland-small.png",
   "image": "assets/ready/stage-v20-momoland-small-4a9007283d781081.webp",
   "width": 787,
   "height": 177,
   "surfaceLeft": 25,
   "surfaceRight": 761,
   "walkY": 9
  }
 },
 "mugen": {
  "backgroundSource": "assets/stage-v20-mugen-background.png",
  "background": "assets/ready/stage-v20-mugen-background-b2da276f998e4fbd.webp",
  "preview": "assets/ready/stage-picker-mugen-a238e3ca1e7f8c67.webp",
  "main": {
   "source": "assets/stage-v20-mugen-main.png",
   "image": "assets/ready/stage-v20-mugen-main-a5ad095b70a12e97.webp",
   "width": 1495,
   "height": 300,
   "surfaceLeft": 49,
   "surfaceRight": 1455,
   "walkY": 11,
   "verticalScale": 0.62
  },
  "small": {
   "source": "assets/stage-v20-mugen-small.png",
   "image": "assets/ready/stage-v20-mugen-small-a3e1dc538ed4d23b.webp",
   "width": 623,
   "height": 198,
   "surfaceLeft": 20,
   "surfaceRight": 610,
   "walkY": 13
  }
 },
 "bloodcathedral": {
  "backgroundSource": "assets/stage-v20-bloodcathedral-background.png",
  "background": "assets/ready/stage-v20-bloodcathedral-background-12d125d5e9c1c61a.webp",
  "preview": "assets/ready/stage-picker-bloodcathedral-020b188a0c22711b.webp",
  "main": {
   "source": "assets/stage-v20-bloodcathedral-main.png",
   "image": "assets/ready/stage-v20-bloodcathedral-main-7908e287305024ac.webp",
   "width": 1509,
   "height": 326,
   "surfaceLeft": 36,
   "surfaceRight": 1473,
   "walkY": 9,
   "verticalScale": 0.62
  },
  "small": {
   "source": "assets/stage-v20-bloodcathedral-small.png",
   "image": "assets/ready/stage-v20-bloodcathedral-small-48e219ceda90d338.webp",
   "width": 756,
   "height": 184,
   "surfaceLeft": 17,
   "surfaceRight": 739,
   "walkY": 9
  }
 },
 "hayabusa": {
  "backgroundSource": "assets/stage-v20-hayabusa-background.png",
  "background": "assets/ready/stage-v20-hayabusa-background-32cb87717de63ab8.webp",
  "preview": "assets/ready/stage-picker-hayabusa-c5b081c2f0f207cf.webp",
  "main": {
   "source": "assets/stage-v20-hayabusa-main.png",
   "image": "assets/ready/stage-v20-hayabusa-main-fb1584799cde286f.webp",
   "width": 1490,
   "height": 255,
   "surfaceLeft": 20,
   "surfaceRight": 1469,
   "walkY": 9,
   "verticalScale": 0.61
  },
  "small": {
   "source": "assets/stage-v20-hayabusa-small.png",
   "image": "assets/ready/stage-v20-hayabusa-small-f1a70d1ea8f35eee.webp",
   "width": 750,
   "height": 217,
   "surfaceLeft": 23,
   "surfaceRight": 727,
   "walkY": 9
  }
 },
 "mountainknot": {
  "backgroundSource": "assets/stage-v21-mountainknot-background.png",
  "background": "assets/ready/stage-v21-mountainknot-background-f9eaa97259ac0a77.webp",
  "preview": "assets/ready/stage-picker-mountainknot-3a75239f388e4446.webp",
  "main": {
   "source": "assets/stage-v21-mountainknot-main.png",
   "image": "assets/ready/stage-v21-mountainknot-main-b9d74c9d8ccece47.webp",
   "width": 1528,
   "height": 261,
   "surfaceLeft": 61,
   "surfaceRight": 1467,
   "walkY": 10,
   "verticalScale": 0.61
  },
  "small": {
   "source": "assets/stage-v21-mountainknot-small.png",
   "image": "assets/ready/stage-v21-mountainknot-small-dd8f601759b0c674.webp",
   "width": 830,
   "height": 148,
   "surfaceLeft": 50,
   "surfaceRight": 779,
   "walkY": 10
  }
 },
 "shireninn": {
  "backgroundSource": "assets/stage-v21-shireninn-background.png",
  "background": "assets/ready/stage-v21-shireninn-background-f853303113ed78a2.webp",
  "preview": "assets/ready/stage-picker-shireninn-b6cc3a876a23fd3f.webp",
  "main": {
   "source": "assets/stage-v21-shireninn-main.png",
   "image": "assets/ready/stage-v21-shireninn-main-9bfe77f41ab29e55.webp",
   "width": 1520,
   "height": 263,
   "surfaceLeft": 13,
   "surfaceRight": 1502,
   "walkY": 10,
   "verticalScale": 0.63
  },
  "small": {
   "source": "assets/stage-v21-shireninn-small.png",
   "image": "assets/ready/stage-v21-shireninn-small-205756785f1a1250.webp",
   "width": 771,
   "height": 201,
   "surfaceLeft": 10,
   "surfaceRight": 759,
   "walkY": 9
  }
 },
 "kanai": {
  "backgroundSource": "assets/stage-v21-kanai-background.png",
  "background": "assets/ready/stage-v21-kanai-background-7494314647eecd6a.webp",
  "preview": "assets/ready/stage-picker-kanai-17bce2e4df10e0e9.webp",
  "main": {
   "source": "assets/stage-v21-kanai-main.png",
   "image": "assets/ready/stage-v21-kanai-main-ca12e8c51f310740.webp",
   "width": 1522,
   "height": 366,
   "surfaceLeft": 61,
   "surfaceRight": 1461,
   "walkY": 8,
   "verticalScale": 0.61
  },
  "small": {
   "source": "assets/stage-v21-kanai-small.png",
   "image": "assets/ready/stage-v21-kanai-small-0b75e5d2b49b6482.webp",
   "width": 806,
   "height": 194,
   "surfaceLeft": 24,
   "surfaceRight": 782,
   "walkY": 10
  }
 },
 "jaburo": {
  "backgroundSource": "assets/stage-v21-jaburo-background.png",
  "background": "assets/ready/stage-v21-jaburo-background-b57bd944ee5892e7.webp",
  "preview": "assets/ready/stage-picker-jaburo-10a852171402d908.webp",
  "main": {
   "source": "assets/stage-v21-jaburo-main.png",
   "image": "assets/ready/stage-v21-jaburo-main-2a0be067f9674b78.webp",
   "width": 1530,
   "height": 289,
   "surfaceLeft": 38,
   "surfaceRight": 1491,
   "walkY": 9,
   "verticalScale": 0.61
  },
  "small": {
   "source": "assets/stage-v21-jaburo-small.png",
   "image": "assets/ready/stage-v21-jaburo-small-2f49712b6f230a7d.webp",
   "width": 880,
   "height": 144,
   "surfaceLeft": 32,
   "surfaceRight": 847,
   "walkY": 9
  }
 },
 "hikami": {
  "backgroundSource": "assets/stage-v22-hikami-background.png",
  "background": "assets/ready/stage-v22-hikami-background-1e2290edecfcb263.webp",
  "preview": "assets/ready/stage-picker-hikami-ec3f0cb894ce7c41.webp",
  "main": {
   "source": "assets/stage-v22-hikami-main.png",
   "image": "assets/ready/stage-v22-hikami-main-3ec257c584cafbf5.webp",
   "width": 1515,
   "height": 259,
   "surfaceLeft": 57,
   "surfaceRight": 1456,
   "walkY": 9,
   "verticalScale": 0.64
  },
  "small": {
   "source": "assets/stage-v22-hikami-small.png",
   "image": "assets/ready/stage-v22-hikami-small-9546ebe590e33476.webp",
   "width": 820,
   "height": 159,
   "surfaceLeft": 29,
   "surfaceRight": 791,
   "walkY": 9
  }
 },
 "draculacastle": {
  "backgroundSource": "assets/stage-v22-draculacastle-background.png",
  "background": "assets/ready/stage-v22-draculacastle-background-dfaa16209b9bcf98.webp",
  "preview": "assets/ready/stage-picker-draculacastle-d30f3469730698eb.webp",
  "main": {
   "source": "assets/stage-v22-draculacastle-main.png",
   "image": "assets/ready/stage-v22-draculacastle-main-133ceca91717dc3c.webp",
   "width": 1486,
   "height": 374,
   "surfaceLeft": 11,
   "surfaceRight": 1474,
   "walkY": 9,
   "verticalScale": 0.62
  },
  "small": {
   "source": "assets/stage-v22-draculacastle-small.png",
   "image": "assets/ready/stage-v22-draculacastle-small-61db88364761c950.webp",
   "width": 756,
   "height": 213,
   "surfaceLeft": 12,
   "surfaceRight": 743,
   "walkY": 9
  }
 },
 "rosetower": {
  "backgroundSource": "assets/stage-v22-rosetower-background.png",
  "background": "assets/ready/stage-v22-rosetower-background-83ce8cb269445aef.webp",
  "preview": "assets/ready/stage-picker-rosetower-80163d0fd41583e1.webp",
  "main": {
   "source": "assets/stage-v22-rosetower-main.png",
   "image": "assets/ready/stage-v22-rosetower-main-c3d29c73d217cea9.webp",
   "width": 1524,
   "height": 261,
   "surfaceLeft": 37,
   "surfaceRight": 1487,
   "walkY": 9,
   "verticalScale": 0.62
  },
  "small": {
   "source": "assets/stage-v22-rosetower-small.png",
   "image": "assets/ready/stage-v22-rosetower-small-eea765bd8bb15350.webp",
   "width": 771,
   "height": 234,
   "surfaceLeft": 17,
   "surfaceRight": 752,
   "walkY": 10
  }
 },
 "thors": {
  "backgroundSource": "assets/stage-v22-thors-background.png",
  "background": "assets/ready/stage-v22-thors-background-ac5a965520080283.webp",
  "preview": "assets/ready/stage-picker-thors-3ba26c733b054db1.webp",
  "main": {
   "source": "assets/stage-v22-thors-main.png",
   "image": "assets/ready/stage-v22-thors-main-d73390a2966a0791.webp",
   "width": 1524,
   "height": 265,
   "surfaceLeft": 32,
   "surfaceRight": 1491,
   "walkY": 8,
   "verticalScale": 0.61
  },
  "small": {
   "source": "assets/stage-v22-thors-small.png",
   "image": "assets/ready/stage-v22-thors-small-b80710e8a3fac0a0.webp",
   "width": 770,
   "height": 204,
   "surfaceLeft": 20,
   "surfaceRight": 749,
   "walkY": 9
  }
 },
 "iselia": {
  "backgroundSource": "assets/stage-v23-iselia-background.png",
  "background": "assets/ready/stage-v23-iselia-background-fc72a6ea8d3f3911.webp",
  "preview": "assets/ready/stage-picker-iselia-07a4bf78acf55a53.webp",
  "main": {
   "source": "assets/stage-v23-iselia-main.png",
   "image": "assets/ready/stage-v23-iselia-main-36e42b027f8acd0a.webp",
   "width": 1529,
   "height": 250,
   "surfaceLeft": 31,
   "surfaceRight": 1497,
   "walkY": 9,
   "verticalScale": 0.62
  },
  "small": {
   "source": "assets/stage-v23-iselia-small.png",
   "image": "assets/ready/stage-v23-iselia-small-13da0e2bb985a66d.webp",
   "width": 782,
   "height": 194,
   "surfaceLeft": 17,
   "surfaceRight": 765,
   "walkY": 9
  }
 },
 "primp": {
  "backgroundSource": "assets/stage-v23-primp-background.png",
  "background": "assets/ready/stage-v23-primp-background-bffc4e167eacb1a7.webp",
  "preview": "assets/ready/stage-picker-primp-a3c16d32f3fe59ef.webp",
  "main": {
   "source": "assets/stage-v23-primp-main.png",
   "image": "assets/ready/stage-v23-primp-main-aab4e4ca36a69969.webp",
   "width": 1518,
   "height": 307,
   "surfaceLeft": 27,
   "surfaceRight": 1491,
   "walkY": 10,
   "verticalScale": 0.61
  },
  "small": {
   "source": "assets/stage-v23-primp-small.png",
   "image": "assets/ready/stage-v23-primp-small-dd3c08cfa893a7da.webp",
   "width": 827,
   "height": 233,
   "surfaceLeft": 16,
   "surfaceRight": 809,
   "walkY": 9
  }
 },
 "basel": {
  "backgroundSource": "assets/stage-v23-basel-background.png",
  "background": "assets/ready/stage-v23-basel-background-50897fc1a050cd26.webp",
  "preview": "assets/ready/stage-picker-basel-de182027ee0087d3.webp",
  "main": {
   "source": "assets/stage-v23-basel-main.png",
   "image": "assets/ready/stage-v23-basel-main-2b717d496879da8e.webp",
   "width": 1507,
   "height": 286,
   "surfaceLeft": 35,
   "surfaceRight": 1471,
   "walkY": 9,
   "verticalScale": 0.61
  },
  "small": {
   "source": "assets/stage-v23-basel-small.png",
   "image": "assets/ready/stage-v23-basel-small-fb23f6244a15083b.webp",
   "width": 772,
   "height": 174,
   "surfaceLeft": 28,
   "surfaceRight": 743,
   "walkY": 9
  }
 },
 "palevia": {
  "backgroundSource": "assets/stage-v23-palevia-background.png",
  "background": "assets/ready/stage-v23-palevia-background-e32f83551a8439b2.webp",
  "preview": "assets/ready/stage-picker-palevia-8cf5735fbc052bc0.webp",
  "main": {
   "source": "assets/stage-v23-palevia-main.png",
   "image": "assets/ready/stage-v23-palevia-main-a42f84df7aa76a13.webp",
   "width": 1529,
   "height": 321,
   "surfaceLeft": 27,
   "surfaceRight": 1500,
   "walkY": 9,
   "verticalScale": 0.64
  },
  "small": {
   "source": "assets/stage-v23-palevia-small.png",
   "image": "assets/ready/stage-v23-palevia-small-72cfbc682261a47c.webp",
   "width": 788,
   "height": 167,
   "surfaceLeft": 21,
   "surfaceRight": 766,
   "walkY": 9
  }
 },
 "daikroft": {
  "backgroundSource": "assets/stage-v24-daikroft-background.png",
  "background": "assets/ready/stage-v24-daikroft-background-9954b5e3b2dfb74a.webp",
  "preview": "assets/ready/stage-picker-daikroft-6270bee3c82ae5a5.webp",
  "main": {
   "source": "assets/stage-v24-daikroft-main.png",
   "image": "assets/ready/stage-v24-daikroft-main-41669cfed437ea96.webp",
   "width": 1524,
   "height": 296,
   "surfaceLeft": 41,
   "surfaceRight": 1480,
   "walkY": 9,
   "verticalScale": 0.61
  },
  "small": {
   "source": "assets/stage-v24-daikroft-small.png",
   "image": "assets/ready/stage-v24-daikroft-small-5c02f277f7fbef2e.webp",
   "width": 651,
   "height": 174,
   "surfaceLeft": 35,
   "surfaceRight": 616,
   "walkY": 11
  }
 },
 "metox": {
  "backgroundSource": "assets/stage-v24-metox-background.png",
  "background": "assets/ready/stage-v24-metox-background-5b8193193fadc01b.webp",
  "preview": "assets/ready/stage-picker-metox-15946aabb5a258d3.webp",
  "main": {
   "source": "assets/stage-v24-metox-main.png",
   "image": "assets/ready/stage-v24-metox-main-0695def3a9dd3401.webp",
   "width": 1494,
   "height": 334,
   "surfaceLeft": 13,
   "surfaceRight": 1481,
   "walkY": 9,
   "verticalScale": 0.63
  },
  "small": {
   "source": "assets/stage-v24-metox-small.png",
   "image": "assets/ready/stage-v24-metox-small-7defdcb6252cf441.webp",
   "width": 774,
   "height": 187,
   "surfaceLeft": 12,
   "surfaceRight": 763,
   "walkY": 11
  }
 },
 "hopspeak": {
  "backgroundSource": "assets/stage-v24-hopspeak-background.png",
  "background": "assets/ready/stage-v24-hopspeak-background-ddcd77f7e0a6cf5b.webp",
  "preview": "assets/ready/stage-picker-hopspeak-e39690627cf23860.webp",
  "main": {
   "source": "assets/stage-v24-hopspeak-main.png",
   "image": "assets/ready/stage-v24-hopspeak-main-387e5c5298524d83.webp",
   "width": 1526,
   "height": 326,
   "surfaceLeft": 73,
   "surfaceRight": 1453,
   "walkY": 9,
   "verticalScale": 0.64
  },
  "small": {
   "source": "assets/stage-v24-hopspeak-small.png",
   "image": "assets/ready/stage-v24-hopspeak-small-8ba7c8da487197ec.webp",
   "width": 776,
   "height": 160,
   "surfaceLeft": 38,
   "surfaceRight": 737,
   "walkY": 9
  }
 },
 "qliphoth": {
  "backgroundSource": "assets/stage-v24-qliphoth-background.png",
  "background": "assets/ready/stage-v24-qliphoth-background-cb51f70d578774c8.webp",
  "preview": "assets/ready/stage-picker-qliphoth-9e63cfff21dfd5ea.webp",
  "main": {
   "source": "assets/stage-v24-qliphoth-main.png",
   "image": "assets/ready/stage-v24-qliphoth-main-67a790015b2b2362.webp",
   "width": 1495,
   "height": 283,
   "surfaceLeft": 11,
   "surfaceRight": 1483,
   "walkY": 9,
   "verticalScale": 0.61
  },
  "small": {
   "source": "assets/stage-v24-qliphoth-small.png",
   "image": "assets/ready/stage-v24-qliphoth-small-87ac7ca38132d6c7.webp",
   "width": 775,
   "height": 199,
   "surfaceLeft": 9,
   "surfaceRight": 765,
   "walkY": 10
  }
 },
 "daattower": {
  "backgroundSource": "assets/stage-v25-daattower-background.png",
  "background": "assets/ready/stage-v25-daattower-background-3e748435f308ff65.webp",
  "preview": "assets/ready/stage-picker-daattower-ffea7188b1eb52b0.webp",
  "main": {
   "source": "assets/stage-v25-daattower-main.png",
   "image": "assets/ready/stage-v25-daattower-main-8eab22964f8ad6ad.webp",
   "width": 1526,
   "height": 271,
   "surfaceLeft": 40,
   "surfaceRight": 1485,
   "walkY": 9,
   "verticalScale": 0.61
  },
  "small": {
   "source": "assets/stage-v25-daattower-small.png",
   "image": "assets/ready/stage-v25-daattower-small-f2d4cb799344d706.webp",
   "width": 789,
   "height": 158,
   "surfaceLeft": 15,
   "surfaceRight": 773,
   "walkY": 9
  }
 },
 "teigeki": {
  "backgroundSource": "assets/stage-v25-teigeki-background.png",
  "background": "assets/ready/stage-v25-teigeki-background-e0aeb6085833b355.webp",
  "preview": "assets/ready/stage-picker-teigeki-70a0528dec839014.webp",
  "main": {
   "source": "assets/stage-v25-teigeki-main.png",
   "image": "assets/ready/stage-v25-teigeki-main-7802a23554afa503.webp",
   "width": 1522,
   "height": 270,
   "surfaceLeft": 56,
   "surfaceRight": 1464,
   "walkY": 10,
   "verticalScale": 0.63
  },
  "small": {
   "source": "assets/stage-v25-teigeki-small.png",
   "image": "assets/ready/stage-v25-teigeki-small-796572031080e5c9.webp",
   "width": 820,
   "height": 157,
   "surfaceLeft": 28,
   "surfaceRight": 791,
   "walkY": 9
  }
 },
 "hinoe": {
  "backgroundSource": "assets/stage-v25-hinoe-background.png",
  "background": "assets/ready/stage-v25-hinoe-background-1e17f43fa1d79e81.webp",
  "preview": "assets/ready/stage-picker-hinoe-63f79f84642dfb8d.webp",
  "main": {
   "source": "assets/stage-v25-hinoe-main.png",
   "image": "assets/ready/stage-v25-hinoe-main-b395a34b1f8747be.webp",
   "width": 1522,
   "height": 275,
   "surfaceLeft": 40,
   "surfaceRight": 1482,
   "walkY": 10,
   "verticalScale": 0.64
  },
  "small": {
   "source": "assets/stage-v25-hinoe-small.png",
   "image": "assets/ready/stage-v25-hinoe-small-dcf5f8fc8894b4c1.webp",
   "width": 803,
   "height": 189,
   "surfaceLeft": 25,
   "surfaceRight": 774,
   "walkY": 17
  }
 },
 "lumiere": {
  "backgroundSource": "assets/stage-v25-lumiere-background.png",
  "background": "assets/ready/stage-v25-lumiere-background-738db74b09dd9217.webp",
  "preview": "assets/ready/stage-picker-lumiere-e2d215273d5a442f.webp",
  "main": {
   "source": "assets/stage-v25-lumiere-main.png",
   "image": "assets/ready/stage-v25-lumiere-main-1af916fea0e60157.webp",
   "width": 1504,
   "height": 299,
   "surfaceLeft": 38,
   "surfaceRight": 1466,
   "walkY": 9,
   "verticalScale": 0.62
  },
  "small": {
   "source": "assets/stage-v25-lumiere-small.png",
   "image": "assets/ready/stage-v25-lumiere-small-ff0f6c967e9bd7e3.webp",
   "width": 768,
   "height": 155,
   "surfaceLeft": 21,
   "surfaceRight": 746,
   "walkY": 10
  }
 },
 "portbreeze": {
  "backgroundSource": "assets/stage-v26-portbreeze-background.png",
  "background": "assets/ready/stage-v26-portbreeze-background-a4df4a892d168dd2.webp",
  "preview": "assets/ready/stage-picker-portbreeze-31226d9be324436c.webp",
  "main": {
   "source": "assets/stage-v26-portbreeze-main.png",
   "image": "assets/ready/stage-v26-portbreeze-main-6b692c2b8c63c48b.webp",
   "width": 1511,
   "height": 333,
   "surfaceLeft": 54,
   "surfaceRight": 1457,
   "walkY": 11,
   "verticalScale": 0.62
  },
  "small": {
   "source": "assets/stage-v26-portbreeze-small.png",
   "image": "assets/ready/stage-v26-portbreeze-small-6e3cd36513ec29df.webp",
   "width": 802,
   "height": 162,
   "surfaceLeft": 32,
   "surfaceRight": 769,
   "walkY": 12
  }
 },
 "sakurayw": {
  "backgroundSource": "assets/stage-v26-sakurayw-background.png",
  "background": "assets/ready/stage-v26-sakurayw-background-41eb5a7c0df837f6.webp",
  "preview": "assets/ready/stage-picker-sakurayw-b3c76573f198a499.webp",
  "main": {
   "source": "assets/stage-v26-sakurayw-main.png",
   "image": "assets/ready/stage-v26-sakurayw-main-ff06d67b2518374a.webp",
   "width": 1530,
   "height": 254,
   "surfaceLeft": 72,
   "surfaceRight": 1457,
   "walkY": 9,
   "verticalScale": 0.63
  },
  "small": {
   "source": "assets/stage-v26-sakurayw-small.png",
   "image": "assets/ready/stage-v26-sakurayw-small-b7b3444bf6eaf740.webp",
   "width": 814,
   "height": 151,
   "surfaceLeft": 36,
   "surfaceRight": 777,
   "walkY": 13
  }
 },
 "tearcity": {
  "backgroundSource": "assets/stage-v26-tearcity-background.png",
  "background": "assets/ready/stage-v26-tearcity-background-73e35085be03e4f7.webp",
  "preview": "assets/ready/stage-picker-tearcity-2b4280919958b360.webp",
  "main": {
   "source": "assets/stage-v26-tearcity-main.png",
   "image": "assets/ready/stage-v26-tearcity-main-434df2336433f1f6.webp",
   "width": 1536,
   "height": 316,
   "surfaceLeft": 26,
   "surfaceRight": 1510,
   "walkY": 11,
   "verticalScale": 0.63
  },
  "small": {
   "source": "assets/stage-v26-tearcity-small.png",
   "image": "assets/ready/stage-v26-tearcity-small-55fc43d25f414f4f.webp",
   "width": 820,
   "height": 195,
   "surfaceLeft": 22,
   "surfaceRight": 797,
   "walkY": 9
  }
 },
 "eidos7": {
  "backgroundSource": "assets/stage-v26-eidos7-background.png",
  "background": "assets/ready/stage-v26-eidos7-background-ea4d3a38e1c6cd14.webp",
  "preview": "assets/ready/stage-picker-eidos7-f37c0c0b03caeba1.webp",
  "main": {
   "source": "assets/stage-v26-eidos7-main.png",
   "image": "assets/ready/stage-v26-eidos7-main-aeb74b5e4c4b311b.webp",
   "width": 1493,
   "height": 343,
   "surfaceLeft": 18,
   "surfaceRight": 1478,
   "walkY": 9,
   "verticalScale": 0.61
  },
  "small": {
   "source": "assets/stage-v26-eidos7-small.png",
   "image": "assets/ready/stage-v26-eidos7-small-502655a2332fe5fc.webp",
   "width": 838,
   "height": 161,
   "surfaceLeft": 18,
   "surfaceRight": 821,
   "walkY": 9
  }
 },
 "grandtrad": {
  "backgroundSource": "assets/stage-v27-grandtrad-background.png",
  "background": "assets/ready/stage-v27-grandtrad-background-386854c9c5d17683.webp",
  "preview": "assets/ready/stage-picker-grandtrad-a3134f0a6014df83.webp",
  "main": {
   "source": "assets/stage-v27-grandtrad-main.png",
   "image": "assets/ready/stage-v27-grandtrad-main-1edf19332d2e1767.webp",
   "width": 1514,
   "height": 288,
   "surfaceLeft": 41,
   "surfaceRight": 1472,
   "walkY": 9,
   "verticalScale": 0.62
  },
  "small": {
   "source": "assets/stage-v27-grandtrad-small.png",
   "image": "assets/ready/stage-v27-grandtrad-small-e46b5141bb4f0430.webp",
   "width": 767,
   "height": 209,
   "surfaceLeft": 20,
   "surfaceRight": 745,
   "walkY": 9
  }
 },
 "corruption": {
  "backgroundSource": "assets/stage-v27-corruption-background.png",
  "background": "assets/ready/stage-v27-corruption-background-c46792e819af1aea.webp",
  "preview": "assets/ready/stage-picker-corruption-8e62b5998a8b35bd.webp",
  "main": {
   "source": "assets/stage-v27-corruption-main.png",
   "image": "assets/ready/stage-v27-corruption-main-0fd733abe368e0ab.webp",
   "width": 1536,
   "height": 283,
   "surfaceLeft": 23,
   "surfaceRight": 1514,
   "walkY": 29,
   "verticalScale": 0.63
  },
  "small": {
   "source": "assets/stage-v27-corruption-small.png",
   "image": "assets/ready/stage-v27-corruption-small-b9411357f832997e.webp",
   "width": 768,
   "height": 157,
   "surfaceLeft": 9,
   "surfaceRight": 759,
   "walkY": 9
  }
 },
 "worldsedge": {
  "backgroundSource": "assets/stage-v27-worldsedge-background.png",
  "background": "assets/ready/stage-v27-worldsedge-background-82edccffa27727ef.webp",
  "preview": "assets/ready/stage-picker-worldsedge-5779c90b14038f8b.webp",
  "main": {
   "source": "assets/stage-v27-worldsedge-main.png",
   "image": "assets/ready/stage-v27-worldsedge-main-8795de4eca63b3ed.webp",
   "width": 1529,
   "height": 258,
   "surfaceLeft": 42,
   "surfaceRight": 1486,
   "walkY": 16,
   "verticalScale": 0.64
  },
  "small": {
   "source": "assets/stage-v27-worldsedge-small.png",
   "image": "assets/ready/stage-v27-worldsedge-small-b5e1df0ee28de896.webp",
   "width": 785,
   "height": 161,
   "surfaceLeft": 24,
   "surfaceRight": 760,
   "walkY": 12
  }
 },
 "hulao": {
  "backgroundSource": "assets/stage-v27-hulao-background.png",
  "background": "assets/ready/stage-v27-hulao-background-771c0f946c7b7b6a.webp",
  "preview": "assets/ready/stage-picker-hulao-13d17a122fbf2c0e.webp",
  "main": {
   "source": "assets/stage-v27-hulao-main.png",
   "image": "assets/ready/stage-v27-hulao-main-810f44186edde830.webp",
   "width": 1516,
   "height": 290,
   "surfaceLeft": 30,
   "surfaceRight": 1485,
   "walkY": 10,
   "verticalScale": 0.62
  },
  "small": {
   "source": "assets/stage-v27-hulao-small.png",
   "image": "assets/ready/stage-v27-hulao-small-49692ab17229e73b.webp",
   "width": 767,
   "height": 187,
   "surfaceLeft": 24,
   "surfaceRight": 743,
   "walkY": 9
  }
 },
 "ascent": {
  "backgroundSource": "assets/stage-v28-ascent-background.png",
  "background": "assets/ready/stage-v28-ascent-background-31cd6ff3a15908a9.webp",
  "preview": "assets/ready/stage-picker-ascent-b0edb3ec24f0458c.webp",
  "main": {
   "source": "assets/stage-v28-ascent-main.png",
   "image": "assets/ready/stage-v28-ascent-main-e82f3483465a7dc8.webp",
   "width": 1493,
   "height": 333,
   "surfaceLeft": 11,
   "surfaceRight": 1482,
   "walkY": 10,
   "verticalScale": 0.65
  },
  "small": {
   "source": "assets/stage-v28-ascent-small.png",
   "image": "assets/ready/stage-v28-ascent-small-22971a21dc1e3be5.webp",
   "width": 878,
   "height": 219,
   "surfaceLeft": 13,
   "surfaceRight": 845,
   "walkY": 70
  }
 },
 "mimiga": {
  "backgroundSource": "assets/stage-v28-mimiga-background.png",
  "background": "assets/ready/stage-v28-mimiga-background-b2239dc45d8e003c.webp",
  "preview": "assets/ready/stage-picker-mimiga-6e5c6ea616cb2192.webp",
  "main": {
   "source": "assets/stage-v28-mimiga-main.png",
   "image": "assets/ready/stage-v28-mimiga-main-66b1bdf446f1ed15.webp",
   "width": 1495,
   "height": 243,
   "surfaceLeft": 30,
   "surfaceRight": 1463,
   "walkY": 10,
   "verticalScale": 0.58
  },
  "small": {
   "source": "assets/stage-v28-mimiga-small.png",
   "image": "assets/ready/stage-v28-mimiga-small-e05b43866c4832a0.webp",
   "width": 728,
   "height": 170,
   "surfaceLeft": 24,
   "surfaceRight": 701,
   "walkY": 9
  }
 },
 "onionkingdom": {
  "backgroundSource": "assets/stage-v28-onionkingdom-background.png",
  "background": "assets/ready/stage-v28-onionkingdom-background-b1e5a40a1f3c461b.webp",
  "preview": "assets/ready/stage-picker-onionkingdom-2cba0dd3eb1fd7ee.webp",
  "main": {
   "source": "assets/stage-v28-onionkingdom-main.png",
   "image": "assets/ready/stage-v28-onionkingdom-main-fdc0bbd880d3208b.webp",
   "width": 1526,
   "height": 270,
   "surfaceLeft": 40,
   "surfaceRight": 1484,
   "walkY": 9,
   "verticalScale": 0.66
  },
  "small": {
   "source": "assets/stage-v28-onionkingdom-small.png",
   "image": "assets/ready/stage-v28-onionkingdom-small-02f4b6e1298083a9.webp",
   "width": 768,
   "height": 199,
   "surfaceLeft": 26,
   "surfaceRight": 741,
   "walkY": 8
  }
 },
 "testchamber": {
  "backgroundSource": "assets/stage-v28-testchamber-background.png",
  "background": "assets/ready/stage-v28-testchamber-background-79b533d6e64a58d6.webp",
  "preview": "assets/ready/stage-picker-testchamber-f10ca5933ffaae30.webp",
  "main": {
   "source": "assets/stage-v28-testchamber-main.png",
   "image": "assets/ready/stage-v28-testchamber-main-24c206db5476e718.webp",
   "width": 1522,
   "height": 176,
   "surfaceLeft": 53,
   "surfaceRight": 1468,
   "walkY": 8,
   "verticalScale": 0.55
  },
  "small": {
   "source": "assets/stage-v28-testchamber-small.png",
   "image": "assets/ready/stage-v28-testchamber-small-3f52eb66032d28d9.webp",
   "width": 782,
   "height": 162,
   "surfaceLeft": 7,
   "surfaceRight": 774,
   "walkY": 35
  }
 },
 "akihara": {
  "backgroundSource": "assets/stage-v29-akihara-background.png",
  "background": "assets/ready/stage-v29-akihara-background-dabbac1ccc08f0e3.webp",
  "preview": "assets/ready/stage-picker-akihara-1149edfc8b9f51e1.webp",
  "main": {
   "source": "assets/stage-v29-akihara-main.png",
   "image": "assets/ready/stage-v29-akihara-main-10b42def21167ff0.webp",
   "width": 1531,
   "height": 264,
   "surfaceLeft": 66,
   "surfaceRight": 1465,
   "walkY": 9,
   "verticalScale": 0.59
  },
  "small": {
   "source": "assets/stage-v29-akihara-small.png",
   "image": "assets/ready/stage-v29-akihara-small-721bdd4a4aedb598.webp",
   "width": 824,
   "height": 223,
   "surfaceLeft": 33,
   "surfaceRight": 791,
   "walkY": 8
  }
 },
 "korogantis": {
  "backgroundSource": "assets/stage-v29-korogantis-background.png",
  "background": "assets/ready/stage-v29-korogantis-background-c2a37b4e91703f31.webp",
  "preview": "assets/ready/stage-picker-korogantis-d5a326293287144c.webp",
  "main": {
   "source": "assets/stage-v29-korogantis-main.png",
   "image": "assets/ready/stage-v29-korogantis-main-a7a384d796c58f29.webp",
   "width": 1527,
   "height": 238,
   "surfaceLeft": 58,
   "surfaceRight": 1471,
   "walkY": 11,
   "verticalScale": 0.62
  },
  "small": {
   "source": "assets/stage-v29-korogantis-small.png",
   "image": "assets/ready/stage-v29-korogantis-small-6cfe88f41d30144b.webp",
   "width": 716,
   "height": 187,
   "surfaceLeft": 31,
   "surfaceRight": 688,
   "walkY": 12
  }
 },
 "candyhouse": {
  "backgroundSource": "assets/stage-v29-candyhouse-background.png",
  "background": "assets/ready/stage-v29-candyhouse-background-1289a1a00f3a42c0.webp",
  "preview": "assets/ready/stage-picker-candyhouse-04224845c354991c.webp",
  "main": {
   "source": "assets/stage-v29-candyhouse-main.png",
   "image": "assets/ready/stage-v29-candyhouse-main-4dd5324ee3cecbba.webp",
   "width": 1512,
   "height": 259,
   "surfaceLeft": 37,
   "surfaceRight": 1474,
   "walkY": 10,
   "verticalScale": 0.6
  },
  "small": {
   "source": "assets/stage-v29-candyhouse-small.png",
   "image": "assets/ready/stage-v29-candyhouse-small-f95d9fe4a0095770.webp",
   "width": 760,
   "height": 179,
   "surfaceLeft": 27,
   "surfaceRight": 731,
   "walkY": 10
  }
 },
 "edithold": {
  "backgroundSource": "assets/stage-v29-edithold-background.png",
  "background": "assets/ready/stage-v29-edithold-background-26f57d4c7297f47a.webp",
  "preview": "assets/ready/stage-picker-edithold-aacf21aec3f08314.webp",
  "main": {
   "source": "assets/stage-v29-edithold-main.png",
   "image": "assets/ready/stage-v29-edithold-main-990c9d71327561ac.webp",
   "width": 1528,
   "height": 284,
   "surfaceLeft": 37,
   "surfaceRight": 1490,
   "walkY": 10,
   "verticalScale": 0.61
  },
  "small": {
   "source": "assets/stage-v29-edithold-small.png",
   "image": "assets/ready/stage-v29-edithold-small-2ad7c7e4aee88769.webp",
   "width": 816,
   "height": 246,
   "surfaceLeft": 36,
   "surfaceRight": 780,
   "walkY": 10
  }
 },
 "lichyard": {
  "backgroundSource": "assets/stage-v30-lichyard-background.png",
  "background": "assets/ready/stage-v30-lichyard-background-487f86ca16b604f8.webp",
  "preview": "assets/ready/stage-picker-lichyard-5ab655ef5107e5bf.webp",
  "main": {
   "source": "assets/stage-v30-lichyard-main.png",
   "image": "assets/ready/stage-v30-lichyard-main-3386781eee437204.webp",
   "width": 1518,
   "height": 354,
   "surfaceLeft": 40,
   "surfaceRight": 1479,
   "walkY": 10,
   "verticalScale": 0.65
  },
  "small": {
   "source": "assets/stage-v30-lichyard-small.png",
   "image": "assets/ready/stage-v30-lichyard-small-496eb1e6c37c3c9f.webp",
   "width": 777,
   "height": 196,
   "surfaceLeft": 22,
   "surfaceRight": 753,
   "walkY": 9
  }
 },
 "feybreak": {
  "backgroundSource": "assets/stage-v30-feybreak-background.png",
  "background": "assets/ready/stage-v30-feybreak-background-92effa0199dcc496.webp",
  "preview": "assets/ready/stage-picker-feybreak-fc4c8eaf1a9128a9.webp",
  "main": {
   "source": "assets/stage-v30-feybreak-main.png",
   "image": "assets/ready/stage-v30-feybreak-main-19a4b598d20cc41a.webp",
   "width": 1491,
   "height": 318,
   "surfaceLeft": 18,
   "surfaceRight": 1475,
   "walkY": 10,
   "verticalScale": 0.63
  },
  "small": {
   "source": "assets/stage-v30-feybreak-small.png",
   "image": "assets/ready/stage-v30-feybreak-small-0995306872ddee9b.webp",
   "width": 758,
   "height": 185,
   "surfaceLeft": 18,
   "surfaceRight": 745,
   "walkY": 11
  }
 },
 "rigbarth": {
  "backgroundSource": "assets/stage-v30-rigbarth-background.png",
  "background": "assets/ready/stage-v30-rigbarth-background-53490dbfb97594bd.webp",
  "preview": "assets/ready/stage-picker-rigbarth-2ae8209cb579b098.webp",
  "main": {
   "source": "assets/stage-v30-rigbarth-main.png",
   "image": "assets/ready/stage-v30-rigbarth-main-87274018bee80776.webp",
   "width": 1531,
   "height": 331,
   "surfaceLeft": 42,
   "surfaceRight": 1489,
   "walkY": 10,
   "verticalScale": 0.6
  },
  "small": {
   "source": "assets/stage-v30-rigbarth-small.png",
   "image": "assets/ready/stage-v30-rigbarth-small-a5c57e91fc6b9c85.webp",
   "width": 765,
   "height": 212,
   "surfaceLeft": 27,
   "surfaceRight": 736,
   "walkY": 8
  }
 },
 "sixthstreet": {
  "backgroundSource": "assets/stage-v30-sixthstreet-background.png",
  "background": "assets/ready/stage-v30-sixthstreet-background-19d962d53ba91f46.webp",
  "preview": "assets/ready/stage-picker-sixthstreet-a4eef6f599be36ea.webp",
  "main": {
   "source": "assets/stage-v30-sixthstreet-main.png",
   "image": "assets/ready/stage-v30-sixthstreet-main-a99bd9dc66b8db79.webp",
   "width": 1502,
   "height": 199,
   "surfaceLeft": 48,
   "surfaceRight": 1453,
   "walkY": 9,
   "verticalScale": 0.55
  },
  "small": {
   "source": "assets/stage-v30-sixthstreet-small.png",
   "image": "assets/ready/stage-v30-sixthstreet-small-1aeafead5f19b6aa.webp",
   "width": 780,
   "height": 173,
   "surfaceLeft": 44,
   "surfaceRight": 754,
   "walkY": 10
  }
 },
 "lunarnewyork": {
  "backgroundSource": "assets/stage-v31-lunarnewyork-background.png",
  "background": "assets/ready/stage-v31-lunarnewyork-background-ea98fb5f087e530b.webp",
  "preview": "assets/ready/stage-picker-lunarnewyork-074b23362062bdb0.webp",
  "main": {
   "source": "assets/stage-v31-lunarnewyork-main.png",
   "image": "assets/ready/stage-v31-lunarnewyork-main-2767142081b2c601.webp",
   "width": 1520,
   "height": 293,
   "surfaceLeft": 47,
   "surfaceRight": 1472,
   "walkY": 9,
   "verticalScale": 0.6
  },
  "small": {
   "source": "assets/stage-v31-lunarnewyork-small.png",
   "image": "assets/ready/stage-v31-lunarnewyork-small-242ba6051536f02c.webp",
   "width": 802,
   "height": 142,
   "surfaceLeft": 35,
   "surfaceRight": 767,
   "walkY": 9
  }
 },
 "katayamawater": {
  "backgroundSource": "assets/stage-v31-katayamawater-background.png",
  "background": "assets/ready/stage-v31-katayamawater-background-346b4c816c5aba61.webp",
  "preview": "assets/ready/stage-picker-katayamawater-7f68dae2c7fb2688.webp",
  "main": {
   "source": "assets/stage-v31-katayamawater-main.png",
   "image": "assets/ready/stage-v31-katayamawater-main-89b39536faaa4c2e.webp",
   "width": 1510,
   "height": 209,
   "surfaceLeft": 31,
   "surfaceRight": 1478,
   "walkY": 10,
   "verticalScale": 0.61
  },
  "small": {
   "source": "assets/stage-v31-katayamawater-small.png",
   "image": "assets/ready/stage-v31-katayamawater-small-7fc8c17cbeffd8ac.webp",
   "width": 762,
   "height": 170,
   "surfaceLeft": 27,
   "surfaceRight": 734,
   "walkY": 10
  }
 },
 "dharmtower": {
  "backgroundSource": "assets/stage-v31-dharmtower-background.png",
  "background": "assets/ready/stage-v31-dharmtower-background-f331492b2e1ca718.webp",
  "preview": "assets/ready/stage-picker-dharmtower-2cd6ea5e9be83276.webp",
  "main": {
   "source": "assets/stage-v31-dharmtower-main.png",
   "image": "assets/ready/stage-v31-dharmtower-main-321649cf0486ca20.webp",
   "width": 1491,
   "height": 320,
   "surfaceLeft": 25,
   "surfaceRight": 1469,
   "walkY": 9,
   "verticalScale": 0.62
  },
  "small": {
   "source": "assets/stage-v31-dharmtower-small.png",
   "image": "assets/ready/stage-v31-dharmtower-small-f59f7e12cdb2604d.webp",
   "width": 772,
   "height": 218,
   "surfaceLeft": 18,
   "surfaceRight": 754,
   "walkY": 10
  }
 },
 "districtcourt": {
  "backgroundSource": "assets/stage-v31-districtcourt-background.png",
  "background": "assets/ready/stage-v31-districtcourt-background-e09f573612a016de.webp",
  "preview": "assets/ready/stage-picker-districtcourt-ae2cf0b66f0e26a2.webp",
  "main": {
   "source": "assets/stage-v31-districtcourt-main.png",
   "image": "assets/ready/stage-v31-districtcourt-main-251b83155d40eb74.webp",
   "width": 1492,
   "height": 272,
   "surfaceLeft": 75,
   "surfaceRight": 1418,
   "walkY": 8,
   "verticalScale": 0.59
  },
  "small": {
   "source": "assets/stage-v31-districtcourt-small.png",
   "image": "assets/ready/stage-v31-districtcourt-small-dae78dd6e2170d64.webp",
   "width": 828,
   "height": 189,
   "surfaceLeft": 33,
   "surfaceRight": 793,
   "walkY": 9
  }
 },
 "darkstar": {
  "backgroundSource": "assets/stage-v32-darkstar-background.png",
  "background": "assets/ready/stage-v32-darkstar-background-0169286333911115.webp",
  "preview": "assets/ready/stage-picker-darkstar-283747b6bc522def.webp",
  "main": {
   "source": "assets/stage-v32-darkstar-main.png",
   "image": "assets/ready/stage-v32-darkstar-main-e8fa5b690e3f3368.webp",
   "width": 1499,
   "height": 316,
   "surfaceLeft": 20,
   "surfaceRight": 1479,
   "walkY": 9,
   "verticalScale": 0.58
  },
  "small": {
   "source": "assets/stage-v32-darkstar-small.png",
   "image": "assets/ready/stage-v32-darkstar-small-ff65d03c269f524c.webp",
   "width": 765,
   "height": 161,
   "surfaceLeft": 18,
   "surfaceRight": 745,
   "walkY": 9
  }
 },
 "neoarcadia": {
  "backgroundSource": "assets/stage-v32-neoarcadia-background.png",
  "background": "assets/ready/stage-v32-neoarcadia-background-b9084fc29d156d29.webp",
  "preview": "assets/ready/stage-picker-neoarcadia-fa04a718811696fc.webp",
  "main": {
   "source": "assets/stage-v32-neoarcadia-main.png",
   "image": "assets/ready/stage-v32-neoarcadia-main-9eb09cdc2871b4b4.webp",
   "width": 1527,
   "height": 213,
   "surfaceLeft": 40,
   "surfaceRight": 1487,
   "walkY": 9,
   "verticalScale": 0.62
  },
  "small": {
   "source": "assets/stage-v32-neoarcadia-small.png",
   "image": "assets/ready/stage-v32-neoarcadia-small-6bf9ce91bf14a9ab.webp",
   "width": 764,
   "height": 193,
   "surfaceLeft": 38,
   "surfaceRight": 725,
   "walkY": 8
  }
 },
 "panicfactory": {
  "backgroundSource": "assets/stage-v32-panicfactory-background.png",
  "background": "assets/ready/stage-v32-panicfactory-background-0e45563fde2c3456.webp",
  "preview": "assets/ready/stage-picker-panicfactory-30d844e245e9a4eb.webp",
  "main": {
   "source": "assets/stage-v32-panicfactory-main.png",
   "image": "assets/ready/stage-v32-panicfactory-main-b8a5e9a959203a8c.webp",
   "width": 1520,
   "height": 234,
   "surfaceLeft": 62,
   "surfaceRight": 1457,
   "walkY": 9,
   "verticalScale": 0.62
  },
  "small": {
   "source": "assets/stage-v32-panicfactory-small.png",
   "image": "assets/ready/stage-v32-panicfactory-small-62593603253bb45e.webp",
   "width": 772,
   "height": 190,
   "surfaceLeft": 38,
   "surfaceRight": 730,
   "walkY": 10
  }
 },
 "amatsusora": {
  "backgroundSource": "assets/stage-v32-amatsusora-background.png",
  "background": "assets/ready/stage-v32-amatsusora-background-04a8f299dce4a9f1.webp",
  "preview": "assets/ready/stage-picker-amatsusora-bd6f09fb2aca60a2.webp",
  "main": {
   "source": "assets/stage-v32-amatsusora-main.png",
   "image": "assets/ready/stage-v32-amatsusora-main-1519923493079f4d.webp",
   "width": 1536,
   "height": 276,
   "surfaceLeft": 30,
   "surfaceRight": 1509,
   "walkY": 10,
   "verticalScale": 0.61
  },
  "small": {
   "source": "assets/stage-v32-amatsusora-small.png",
   "image": "assets/ready/stage-v32-amatsusora-small-9ac65c58879bb68e.webp",
   "width": 803,
   "height": 194,
   "surfaceLeft": 31,
   "surfaceRight": 771,
   "walkY": 9
  }
 },
 "woodypig": {
  "backgroundSource": "assets/stage-v33-woodypig-background.png",
  "background": "assets/ready/stage-v33-woodypig-background-aa3d4023e2ca82a2.webp",
  "preview": "assets/ready/stage-picker-woodypig-c625324e498821fc.webp",
  "main": {
   "source": "assets/stage-v33-woodypig-main.png",
   "image": "assets/ready/stage-v33-woodypig-main-0f527df7264674ef.webp",
   "width": 1492,
   "height": 278,
   "surfaceLeft": 15,
   "surfaceRight": 1477,
   "walkY": 10,
   "verticalScale": 0.61
  },
  "small": {
   "source": "assets/stage-v33-woodypig-small.png",
   "image": "assets/ready/stage-v33-woodypig-small-d02b36e4c59813e8.webp",
   "width": 797,
   "height": 137,
   "surfaceLeft": 13,
   "surfaceRight": 782,
   "walkY": 9
  }
 },
 "fiestaelevadora": {
  "backgroundSource": "assets/stage-v33-fiestaelevadora-background.png",
  "background": "assets/ready/stage-v33-fiestaelevadora-background-6be44ea89dd79d40.webp",
  "preview": "assets/ready/stage-picker-fiestaelevadora-c609bb3211050bbc.webp",
  "main": {
   "source": "assets/stage-v33-fiestaelevadora-main.png",
   "image": "assets/ready/stage-v33-fiestaelevadora-main-286d29aa3f367a26.webp",
   "width": 1534,
   "height": 236,
   "surfaceLeft": 72,
   "surfaceRight": 1461,
   "walkY": 10,
   "verticalScale": 0.64
  },
  "small": {
   "source": "assets/stage-v33-fiestaelevadora-small.png",
   "image": "assets/ready/stage-v33-fiestaelevadora-small-5ed9efcc418e1aa6.webp",
   "width": 728,
   "height": 224,
   "surfaceLeft": 42,
   "surfaceRight": 685,
   "walkY": 28
  }
 },
 "junglehorse": {
  "backgroundSource": "assets/stage-v33-junglehorse-background.png",
  "background": "assets/ready/stage-v33-junglehorse-background-18940151365c355d.webp",
  "preview": "assets/ready/stage-picker-junglehorse-22d748161eddde10.webp",
  "main": {
   "source": "assets/stage-v33-junglehorse-main.png",
   "image": "assets/ready/stage-v33-junglehorse-main-a9d4f035eb066991.webp",
   "width": 1495,
   "height": 279,
   "surfaceLeft": 17,
   "surfaceRight": 1477,
   "walkY": 10,
   "verticalScale": 0.58
  },
  "small": {
   "source": "assets/stage-v33-junglehorse-small.png",
   "image": "assets/ready/stage-v33-junglehorse-small-c068443e059ae010.webp",
   "width": 763,
   "height": 187,
   "surfaceLeft": 17,
   "surfaceRight": 746,
   "walkY": 9
  }
 },
 "deemopiano": {
  "backgroundSource": "assets/stage-v33-deemopiano-background.png",
  "background": "assets/ready/stage-v33-deemopiano-background-97fdafebf6985012.webp",
  "preview": "assets/ready/stage-picker-deemopiano-373ac44bde0d8771.webp",
  "main": {
   "source": "assets/stage-v33-deemopiano-main.png",
   "image": "assets/ready/stage-v33-deemopiano-main-ee4385a73d90eb18.webp",
   "width": 1536,
   "height": 302,
   "surfaceLeft": 29,
   "surfaceRight": 1506,
   "walkY": 9,
   "verticalScale": 0.56
  },
  "small": {
   "source": "assets/stage-v33-deemopiano-small.png",
   "image": "assets/ready/stage-v33-deemopiano-small-1270701af0b81ce4.webp",
   "width": 786,
   "height": 174,
   "surfaceLeft": 23,
   "surfaceRight": 762,
   "walkY": 8
  }
 },
 "devilscrossing": {
  "backgroundSource": "assets/stage-v34-devilscrossing-background.png",
  "background": "assets/ready/stage-v34-devilscrossing-background-ecade96f26c972c4.webp",
  "preview": "assets/ready/stage-picker-devilscrossing-94f7a84144d41081.webp",
  "main": {
   "source": "assets/stage-v34-devilscrossing-main.png",
   "image": "assets/ready/stage-v34-devilscrossing-main-74764a12a993d04e.webp",
   "width": 1531,
   "height": 284,
   "surfaceLeft": 39,
   "surfaceRight": 1492,
   "walkY": 10,
   "verticalScale": 0.61
  },
  "small": {
   "source": "assets/stage-v34-devilscrossing-small.png",
   "image": "assets/ready/stage-v34-devilscrossing-small-e726fa96da516677.webp",
   "width": 765,
   "height": 201,
   "surfaceLeft": 27,
   "surfaceRight": 736,
   "walkY": 9
  }
 },
 "buckler": {
  "backgroundSource": "assets/stage-v34-buckler-background.png",
  "background": "assets/ready/stage-v34-buckler-background-2f05af2f55ad0a5d.webp",
  "preview": "assets/ready/stage-picker-buckler-09f655fa8c37f31b.webp",
  "main": {
   "source": "assets/stage-v34-buckler-main.png",
   "image": "assets/ready/stage-v34-buckler-main-228e03341e86873d.webp",
   "width": 1511,
   "height": 278,
   "surfaceLeft": 67,
   "surfaceRight": 1441,
   "walkY": 9,
   "verticalScale": 0.58
  },
  "small": {
   "source": "assets/stage-v34-buckler-small.png",
   "image": "assets/ready/stage-v34-buckler-small-9cc197654448c54c.webp",
   "width": 761,
   "height": 207,
   "surfaceLeft": 23,
   "surfaceRight": 736,
   "walkY": 10
  }
 },
 "whitehousereborn": {
  "backgroundSource": "assets/stage-v34-whitehousereborn-background.png",
  "background": "assets/ready/stage-v34-whitehousereborn-background-1d6ca31372fcfea9.webp",
  "preview": "assets/ready/stage-picker-whitehousereborn-8919890dd7058248.webp",
  "main": {
   "source": "assets/stage-v34-whitehousereborn-main.png",
   "image": "assets/ready/stage-v34-whitehousereborn-main-21a507ba9363ae53.webp",
   "width": 1503,
   "height": 295,
   "surfaceLeft": 20,
   "surfaceRight": 1481,
   "walkY": 9,
   "verticalScale": 0.62
  },
  "small": {
   "source": "assets/stage-v34-whitehousereborn-small.png",
   "image": "assets/ready/stage-v34-whitehousereborn-small-0dcca2019ba39609.webp",
   "width": 762,
   "height": 140,
   "surfaceLeft": 16,
   "surfaceRight": 745,
   "walkY": 9
  }
 },
 "nsanitybeach": {
  "backgroundSource": "assets/stage-v34-nsanitybeach-background.png",
  "background": "assets/ready/stage-v34-nsanitybeach-background-debce5ce9364d58a.webp",
  "preview": "assets/ready/stage-picker-nsanitybeach-09860a06532d3084.webp",
  "main": {
   "source": "assets/stage-v34-nsanitybeach-main.png",
   "image": "assets/ready/stage-v34-nsanitybeach-main-dde28ed7732dbe99.webp",
   "width": 1518,
   "height": 253,
   "surfaceLeft": 34,
   "surfaceRight": 1485,
   "walkY": 9,
   "verticalScale": 0.6
  },
  "small": {
   "source": "assets/stage-v34-nsanitybeach-small.png",
   "image": "assets/ready/stage-v34-nsanitybeach-small-72a5faa70be11e4d.webp",
   "width": 768,
   "height": 178,
   "surfaceLeft": 23,
   "surfaceRight": 739,
   "walkY": 10
  }
 },
 "crosscastle": {
  "backgroundSource": "assets/stage-v35-crosscastle-background.png",
  "background": "assets/ready/stage-v35-crosscastle-background-2b2a74318d18b28a.webp",
  "preview": "assets/ready/stage-picker-crosscastle-3a0b7ef71d215b80.webp",
  "main": {
   "source": "assets/stage-v35-crosscastle-main.png",
   "image": "assets/ready/stage-v35-crosscastle-main-7d060467d2db6229.webp",
   "width": 1513,
   "height": 304,
   "surfaceLeft": 31,
   "surfaceRight": 1480,
   "walkY": 9,
   "verticalScale": 0.63
  },
  "small": {
   "source": "assets/stage-v35-crosscastle-small.png",
   "image": "assets/ready/stage-v35-crosscastle-small-02a266abb92f2189.webp",
   "width": 780,
   "height": 193,
   "surfaceLeft": 19,
   "surfaceRight": 761,
   "walkY": 10
  }
 },
 "titania": {
  "backgroundSource": "assets/stage-v35-titania-background.png",
  "background": "assets/ready/stage-v35-titania-background-ead6807c818f2ded.webp",
  "preview": "assets/ready/stage-picker-titania-4c823f3c868fc485.webp",
  "main": {
   "source": "assets/stage-v35-titania-main.png",
   "image": "assets/ready/stage-v35-titania-main-9934ef6d2204a0f1.webp",
   "width": 1535,
   "height": 295,
   "surfaceLeft": 26,
   "surfaceRight": 1507,
   "walkY": 18,
   "verticalScale": 0.62
  },
  "small": {
   "source": "assets/stage-v35-titania-small.png",
   "image": "assets/ready/stage-v35-titania-small-dc080425006560a0.webp",
   "width": 766,
   "height": 183,
   "surfaceLeft": 27,
   "surfaceRight": 739,
   "walkY": 9
  }
 },
 "asgardhills": {
  "backgroundSource": "assets/stage-v35-asgardhills-background.png",
  "background": "assets/ready/stage-v35-asgardhills-background-b038a63ef632d875.webp",
  "preview": "assets/ready/stage-picker-asgardhills-ac7d7b955e05ae6e.webp",
  "main": {
   "source": "assets/stage-v35-asgardhills-main.png",
   "image": "assets/ready/stage-v35-asgardhills-main-f5617e760881b38d.webp",
   "width": 1510,
   "height": 213,
   "surfaceLeft": 25,
   "surfaceRight": 1486,
   "walkY": 9,
   "verticalScale": 0.6
  },
  "small": {
   "source": "assets/stage-v35-asgardhills-small.png",
   "image": "assets/ready/stage-v35-asgardhills-small-28cfac4492da7aa7.webp",
   "width": 750,
   "height": 179,
   "surfaceLeft": 32,
   "surfaceRight": 717,
   "walkY": 11
  }
 },
 "cresta": {
  "backgroundSource": "assets/stage-v35-cresta-background.png",
  "background": "assets/ready/stage-v35-cresta-background-29c915e2745c93e4.webp",
  "preview": "assets/ready/stage-picker-cresta-168869e197b86e54.webp",
  "main": {
   "source": "assets/stage-v35-cresta-main.png",
   "image": "assets/ready/stage-v35-cresta-main-0bd2d6654780ec6e.webp",
   "width": 1480,
   "height": 245,
   "surfaceLeft": 28,
   "surfaceRight": 1453,
   "walkY": 10,
   "verticalScale": 0.59
  },
  "small": {
   "source": "assets/stage-v35-cresta-small.png",
   "image": "assets/ready/stage-v35-cresta-small-a79dc8504d149e55.webp",
   "width": 784,
   "height": 198,
   "surfaceLeft": 29,
   "surfaceRight": 755,
   "walkY": 11
  }
 },
 "springvalley": {
  "backgroundSource": "assets/stage-v36-springvalley-background.png",
  "background": "assets/ready/stage-v36-springvalley-background-2e5e48ac4c8df5d1.webp",
  "preview": "assets/ready/stage-picker-springvalley-d4a44a9074da0e71.webp",
  "main": {
   "source": "assets/stage-v36-springvalley-main.png",
   "image": "assets/ready/stage-v36-springvalley-main-9aece4fe6de60ce6.webp",
   "width": 1515,
   "height": 303,
   "surfaceLeft": 40,
   "surfaceRight": 1478,
   "walkY": 14,
   "verticalScale": 0.61
  },
  "small": {
   "source": "assets/stage-v36-springvalley-small.png",
   "image": "assets/ready/stage-v36-springvalley-small-42f42ca96a9881cc.webp",
   "width": 748,
   "height": 190,
   "surfaceLeft": 32,
   "surfaceRight": 719,
   "walkY": 18
  }
 },
 "fruitdojo": {
  "backgroundSource": "assets/stage-v36-fruitdojo-background.png",
  "background": "assets/ready/stage-v36-fruitdojo-background-6309e618cd6f55dd.webp",
  "preview": "assets/ready/stage-picker-fruitdojo-18e85af52e219eb5.webp",
  "main": {
   "source": "assets/stage-v36-fruitdojo-main.png",
   "image": "assets/ready/stage-v36-fruitdojo-main-e8bf65e60e4e2cce.webp",
   "width": 1530,
   "height": 255,
   "surfaceLeft": 63,
   "surfaceRight": 1466,
   "walkY": 9,
   "verticalScale": 0.57
  },
  "small": {
   "source": "assets/stage-v36-fruitdojo-small.png",
   "image": "assets/ready/stage-v36-fruitdojo-small-0d8be977cfb59b24.webp",
   "width": 799,
   "height": 169,
   "surfaceLeft": 37,
   "surfaceRight": 761,
   "walkY": 9
  }
 },
 "bunkum": {
  "backgroundSource": "assets/stage-v36-bunkum-background.png",
  "background": "assets/ready/stage-v36-bunkum-background-5908e0fdee7d0a4f.webp",
  "preview": "assets/ready/stage-picker-bunkum-49c4fdb2250f746b.webp",
  "main": {
   "source": "assets/stage-v36-bunkum-main.png",
   "image": "assets/ready/stage-v36-bunkum-main-d51ddde50c28474e.webp",
   "width": 1530,
   "height": 218,
   "surfaceLeft": 23,
   "surfaceRight": 1508,
   "walkY": 9,
   "verticalScale": 0.64
  },
  "small": {
   "source": "assets/stage-v36-bunkum-small.png",
   "image": "assets/ready/stage-v36-bunkum-small-1a13fd93ea3ffa30.webp",
   "width": 782,
   "height": 162,
   "surfaceLeft": 37,
   "surfaceRight": 744,
   "walkY": 10
  }
 },
 "timestation": {
  "backgroundSource": "assets/stage-v36-timestation-background.png",
  "background": "assets/ready/stage-v36-timestation-background-addc4bfecde428a5.webp",
  "preview": "assets/ready/stage-picker-timestation-a76f671a0a6857aa.webp",
  "main": {
   "source": "assets/stage-v36-timestation-main.png",
   "image": "assets/ready/stage-v36-timestation-main-0c754df6ef3287fe.webp",
   "width": 1496,
   "height": 207,
   "surfaceLeft": 55,
   "surfaceRight": 1439,
   "walkY": 10,
   "verticalScale": 0.56
  },
  "small": {
   "source": "assets/stage-v36-timestation-small.png",
   "image": "assets/ready/stage-v36-timestation-small-4532ad641b667499.webp",
   "width": 772,
   "height": 171,
   "surfaceLeft": 43,
   "surfaceRight": 728,
   "walkY": 15
  }
 },
 "hitoyori": {
  "backgroundSource": "assets/stage-v37-hitoyori-background.png",
  "background": "assets/ready/stage-v37-hitoyori-background-598d29afb53c3007.webp",
  "preview": "assets/ready/stage-picker-hitoyori-806f78e799390641.webp",
  "main": {
   "source": "assets/stage-v37-hitoyori-main.png",
   "image": "assets/ready/stage-v37-hitoyori-main-8c30056fded12a07.webp",
   "width": 1529,
   "height": 261,
   "surfaceLeft": 30,
   "surfaceRight": 1502,
   "walkY": 11,
   "verticalScale": 0.64
  },
  "small": {
   "source": "assets/stage-v37-hitoyori-small.png",
   "image": "assets/ready/stage-v37-hitoyori-small-fca454d754bb9935.webp",
   "width": 787,
   "height": 189,
   "surfaceLeft": 36,
   "surfaceRight": 752,
   "walkY": 13
  }
 },
 "rockymountain": {
  "backgroundSource": "assets/stage-v37-rockymountain-background.png",
  "background": "assets/ready/stage-v37-rockymountain-background-2fc7ee37114d28de.webp",
  "preview": "assets/ready/stage-picker-rockymountain-dac362d4d16156ec.webp",
  "main": {
   "source": "assets/stage-v37-rockymountain-main.png",
   "image": "assets/ready/stage-v37-rockymountain-main-70b1694b30dad701.webp",
   "width": 1496,
   "height": 261,
   "surfaceLeft": 17,
   "surfaceRight": 1478,
   "walkY": 12,
   "verticalScale": 0.62
  },
  "small": {
   "source": "assets/stage-v37-rockymountain-small.png",
   "image": "assets/ready/stage-v37-rockymountain-small-808d31397fc0f027.webp",
   "width": 764,
   "height": 204,
   "surfaceLeft": 22,
   "surfaceRight": 744,
   "walkY": 12
  }
 },
 "defenseacademy": {
  "backgroundSource": "assets/stage-v37-defenseacademy-background.png",
  "background": "assets/ready/stage-v37-defenseacademy-background-14e8680dc68c7461.webp",
  "preview": "assets/ready/stage-picker-defenseacademy-36ff79b48ad7ee19.webp",
  "main": {
   "source": "assets/stage-v37-defenseacademy-main.png",
   "image": "assets/ready/stage-v37-defenseacademy-main-48d7281e905b0d07.webp",
   "width": 1536,
   "height": 243,
   "surfaceLeft": 46,
   "surfaceRight": 1489,
   "walkY": 17,
   "verticalScale": 0.56
  },
  "small": {
   "source": "assets/stage-v37-defenseacademy-small.png",
   "image": "assets/ready/stage-v37-defenseacademy-small-f2388c9bf60290bb.webp",
   "width": 745,
   "height": 205,
   "surfaceLeft": 30,
   "surfaceRight": 715,
   "walkY": 14
  }
 },
 "steambison": {
  "backgroundSource": "assets/stage-v37-steambison-background.png",
  "background": "assets/ready/stage-v37-steambison-background-c1a87b22dc69aa11.webp",
  "preview": "assets/ready/stage-picker-steambison-0dafe624a9176e9b.webp",
  "main": {
   "source": "assets/stage-v37-steambison-main.png",
   "image": "assets/ready/stage-v37-steambison-main-f50bd9e03580bbf1.webp",
   "width": 1536,
   "height": 285,
   "surfaceLeft": 48,
   "surfaceRight": 1487,
   "walkY": 10,
   "verticalScale": 0.61
  },
  "small": {
   "source": "assets/stage-v37-steambison-small.png",
   "image": "assets/ready/stage-v37-steambison-small-13e85207a19b1ee1.webp",
   "width": 818,
   "height": 197,
   "surfaceLeft": 15,
   "surfaceRight": 802,
   "walkY": 9
  }
 },
 "demoncastle": {
  "backgroundSource": "assets/stage-v38-demoncastle-background.png",
  "background": "assets/ready/stage-v38-demoncastle-background-c0544ce1f8404c98.webp",
  "preview": "assets/ready/stage-picker-demoncastle-5dbcbac4875c5a6e.webp",
  "main": {
   "source": "assets/stage-v38-demoncastle-main.png",
   "image": "assets/ready/stage-v38-demoncastle-main-588dd740781b62be.webp",
   "width": 1487,
   "height": 242,
   "surfaceLeft": 38,
   "surfaceRight": 1448,
   "walkY": 10,
   "verticalScale": 0.59
  },
  "small": {
   "source": "assets/stage-v38-demoncastle-small.png",
   "image": "assets/ready/stage-v38-demoncastle-small-89d031e3d4af36cd.webp",
   "width": 773,
   "height": 202,
   "surfaceLeft": 27,
   "surfaceRight": 746,
   "walkY": 8
  }
 },
 "hendonmyre": {
  "backgroundSource": "assets/stage-v38-hendonmyre-background.png",
  "background": "assets/ready/stage-v38-hendonmyre-background-15d867c9409aa9e3.webp",
  "preview": "assets/ready/stage-picker-hendonmyre-8b34ce47e01b8bbc.webp",
  "main": {
   "source": "assets/stage-v38-hendonmyre-main.png",
   "image": "assets/ready/stage-v38-hendonmyre-main-76ab7ab94a169e92.webp",
   "width": 1527,
   "height": 246,
   "surfaceLeft": 40,
   "surfaceRight": 1486,
   "walkY": 9,
   "verticalScale": 0.62
  },
  "small": {
   "source": "assets/stage-v38-hendonmyre-small.png",
   "image": "assets/ready/stage-v38-hendonmyre-small-45b42a43488e2d0c.webp",
   "width": 801,
   "height": 184,
   "surfaceLeft": 21,
   "surfaceRight": 779,
   "walkY": 9
  }
 },
 "scarletmansion": {
  "backgroundSource": "assets/stage-v38-scarletmansion-background.png",
  "background": "assets/ready/stage-v38-scarletmansion-background-23e5390a017e6cdd.webp",
  "preview": "assets/ready/stage-picker-scarletmansion-2976aefe240e811b.webp",
  "main": {
   "source": "assets/stage-v38-scarletmansion-main.png",
   "image": "assets/ready/stage-v38-scarletmansion-main-0d4c3dd6f9c35ba6.webp",
   "width": 1480,
   "height": 303,
   "surfaceLeft": 11,
   "surfaceRight": 1468,
   "walkY": 8,
   "verticalScale": 0.6
  },
  "small": {
   "source": "assets/stage-v38-scarletmansion-small.png",
   "image": "assets/ready/stage-v38-scarletmansion-small-0f822b83b6ca597f.webp",
   "width": 756,
   "height": 196,
   "surfaceLeft": 13,
   "surfaceRight": 743,
   "walkY": 11
  }
 },
 "mobliz": {
  "backgroundSource": "assets/stage-v38-mobliz-background.png",
  "background": "assets/ready/stage-v38-mobliz-background-2616669ff6f40052.webp",
  "preview": "assets/ready/stage-picker-mobliz-450d5c0807dd0acb.webp",
  "main": {
   "source": "assets/stage-v38-mobliz-main.png",
   "image": "assets/ready/stage-v38-mobliz-main-70cf845d8eee9517.webp",
   "width": 1522,
   "height": 285,
   "surfaceLeft": 14,
   "surfaceRight": 1507,
   "walkY": 22,
   "verticalScale": 0.57
  },
  "small": {
   "source": "assets/stage-v38-mobliz-small.png",
   "image": "assets/ready/stage-v38-mobliz-small-5259625957402760.webp",
   "width": 793,
   "height": 130,
   "surfaceLeft": 20,
   "surfaceRight": 772,
   "walkY": 8
  }
 },
 "luli": {
  "backgroundSource": "assets/stage-v39-luli-background.png",
  "background": "assets/ready/stage-v39-luli-background-6b622954df8ca83e.webp",
  "preview": "assets/ready/stage-picker-luli-42964952e8967860.webp",
  "main": {
   "source": "assets/stage-v39-luli-main.png",
   "image": "assets/ready/stage-v39-luli-main-ca63067f34979980.webp",
   "width": 1512,
   "height": 276,
   "surfaceLeft": 39,
   "surfaceRight": 1472,
   "walkY": 9,
   "verticalScale": 0.61
  },
  "small": {
   "source": "assets/stage-v39-luli-small.png",
   "image": "assets/ready/stage-v39-luli-small-c5f932ab0b39d816.webp",
   "width": 791,
   "height": 187,
   "surfaceLeft": 23,
   "surfaceRight": 768,
   "walkY": 10
  }
 },
 "miltia": {
  "backgroundSource": "assets/stage-v39-miltia-background.png",
  "background": "assets/ready/stage-v39-miltia-background-88d28c5693bf8475.webp",
  "preview": "assets/ready/stage-picker-miltia-3107716e4e328798.webp",
  "main": {
   "source": "assets/stage-v39-miltia-main.png",
   "image": "assets/ready/stage-v39-miltia-main-79e8d0fb6777a2cd.webp",
   "width": 1517,
   "height": 206,
   "surfaceLeft": 67,
   "surfaceRight": 1447,
   "walkY": 9,
   "verticalScale": 0.55
  },
  "small": {
   "source": "assets/stage-v39-miltia-small.png",
   "image": "assets/ready/stage-v39-miltia-small-735224877fea7a41.webp",
   "width": 792,
   "height": 123,
   "surfaceLeft": 38,
   "surfaceRight": 753,
   "walkY": 9
  }
 },
 "airyglyph": {
  "backgroundSource": "assets/stage-v39-airyglyph-background.png",
  "background": "assets/ready/stage-v39-airyglyph-background-956429fe7661b0a9.webp",
  "preview": "assets/ready/stage-picker-airyglyph-d89493f5e1ba7341.webp",
  "main": {
   "source": "assets/stage-v39-airyglyph-main.png",
   "image": "assets/ready/stage-v39-airyglyph-main-fa384ff1a458be68.webp",
   "width": 1515,
   "height": 207,
   "surfaceLeft": 38,
   "surfaceRight": 1476,
   "walkY": 12,
   "verticalScale": 0.63
  },
  "small": {
   "source": "assets/stage-v39-airyglyph-small.png",
   "image": "assets/ready/stage-v39-airyglyph-small-9e16099c9cd7bfda.webp",
   "width": 760,
   "height": 166,
   "surfaceLeft": 28,
   "surfaceRight": 732,
   "walkY": 12
  }
 },
 "macanu": {
  "backgroundSource": "assets/stage-v39-macanu-background.png",
  "background": "assets/ready/stage-v39-macanu-background-862ffe4b78404aab.webp",
  "preview": "assets/ready/stage-picker-macanu-63197cd9b24e6247.webp",
  "main": {
   "source": "assets/stage-v39-macanu-main.png",
   "image": "assets/ready/stage-v39-macanu-main-cb88bd8ab02818fb.webp",
   "width": 1498,
   "height": 319,
   "surfaceLeft": 19,
   "surfaceRight": 1480,
   "walkY": 11,
   "verticalScale": 0.6
  },
  "small": {
   "source": "assets/stage-v39-macanu-small.png",
   "image": "assets/ready/stage-v39-macanu-small-5a6abf1142fedfd8.webp",
   "width": 766,
   "height": 164,
   "surfaceLeft": 18,
   "surfaceRight": 747,
   "walkY": 9
  }
 },
 "ravendome": {
  "backgroundSource": "assets/stage-v40-ravendome-background.png",
  "background": "assets/ready/stage-v40-ravendome-background-e3140edba52b819c.webp",
  "preview": "assets/ready/stage-picker-ravendome-03f5b60ff5d39c36.webp",
  "main": {
   "source": "assets/stage-v40-ravendome-main.png",
   "image": "assets/ready/stage-v40-ravendome-main-18bd361007612dbc.webp",
   "width": 1526,
   "height": 220,
   "surfaceLeft": 27,
   "surfaceRight": 1499,
   "walkY": 9,
   "verticalScale": 0.58
  },
  "small": {
   "source": "assets/stage-v40-ravendome-small.png",
   "image": "assets/ready/stage-v40-ravendome-small-2a736c0d3b331c9f.webp",
   "width": 901,
   "height": 144,
   "surfaceLeft": 13,
   "surfaceRight": 887,
   "walkY": 9
  }
 },
 "omikocity": {
  "backgroundSource": "assets/stage-v40-omikocity-background.png",
  "background": "assets/ready/stage-v40-omikocity-background-c43ccce713a8865a.webp",
  "preview": "assets/ready/stage-picker-omikocity-f321fcb673cd48fc.webp",
  "main": {
   "source": "assets/stage-v40-omikocity-main.png",
   "image": "assets/ready/stage-v40-omikocity-main-79479b09a4a3c8e2.webp",
   "width": 1507,
   "height": 199,
   "surfaceLeft": 45,
   "surfaceRight": 1461,
   "walkY": 9,
   "verticalScale": 0.61
  },
  "small": {
   "source": "assets/stage-v40-omikocity-small.png",
   "image": "assets/ready/stage-v40-omikocity-small-70b3efc38d0463e2.webp",
   "width": 774,
   "height": 174,
   "surfaceLeft": 32,
   "surfaceRight": 741,
   "walkY": 10
  }
 },
 "istrakan": {
  "backgroundSource": "assets/stage-v40-istrakan-background.png",
  "background": "assets/ready/stage-v40-istrakan-background-726f78cdfd979136.webp",
  "preview": "assets/ready/stage-picker-istrakan-ace2ae08b8959684.webp",
  "main": {
   "source": "assets/stage-v40-istrakan-main.png",
   "image": "assets/ready/stage-v40-istrakan-main-71741e3343bd674c.webp",
   "width": 1496,
   "height": 276,
   "surfaceLeft": 32,
   "surfaceRight": 1464,
   "walkY": 11,
   "verticalScale": 0.63
  },
  "small": {
   "source": "assets/stage-v40-istrakan-small.png",
   "image": "assets/ready/stage-v40-istrakan-small-4db5a53ed02c0ce7.webp",
   "width": 777,
   "height": 180,
   "surfaceLeft": 21,
   "surfaceRight": 758,
   "walkY": 11
  }
 },
 "lahan": {
  "backgroundSource": "assets/stage-v40-lahan-background.png",
  "background": "assets/ready/stage-v40-lahan-background-4bf0b887d712aba4.webp",
  "preview": "assets/ready/stage-picker-lahan-074eedc5cb8e8ac6.webp",
  "main": {
   "source": "assets/stage-v40-lahan-main.png",
   "image": "assets/ready/stage-v40-lahan-main-3656e3614a1fa4d1.webp",
   "width": 1498,
   "height": 279,
   "surfaceLeft": 25,
   "surfaceRight": 1473,
   "walkY": 10,
   "verticalScale": 0.6
  },
  "small": {
   "source": "assets/stage-v40-lahan-small.png",
   "image": "assets/ready/stage-v40-lahan-small-146f430331e45e08.webp",
   "width": 777,
   "height": 179,
   "surfaceLeft": 29,
   "surfaceRight": 744,
   "walkY": 10
  }
 },
 "spacepirates": {
  "backgroundSource": "assets/stage-v41-spacepirates-background.png",
  "background": "assets/ready/stage-v41-spacepirates-background-1c219ee92759b56f.webp",
  "preview": "assets/ready/stage-picker-spacepirates-3341b43124e98604.webp",
  "main": {
   "source": "assets/stage-v41-spacepirates-main.png",
   "image": "assets/ready/stage-v41-spacepirates-main-a65a64b7ab9d6297.webp",
   "width": 1520,
   "height": 224,
   "surfaceLeft": 36,
   "surfaceRight": 1483,
   "walkY": 9,
   "verticalScale": 0.61
  },
  "small": {
   "source": "assets/stage-v41-spacepirates-small.png",
   "image": "assets/ready/stage-v41-spacepirates-small-3a5aafcfa4d9a4ab.webp",
   "width": 760,
   "height": 138,
   "surfaceLeft": 30,
   "surfaceRight": 729,
   "walkY": 10
  }
 },
 "iga": {
  "backgroundSource": "assets/stage-v41-iga-background.png",
  "background": "assets/ready/stage-v41-iga-background-41888e64a4ab5fd1.webp",
  "preview": "assets/ready/stage-picker-iga-14b882cdc690c3ae.webp",
  "main": {
   "source": "assets/stage-v41-iga-main.png",
   "image": "assets/ready/stage-v41-iga-main-20f80a355073c5df.webp",
   "width": 1520,
   "height": 318,
   "surfaceLeft": 44,
   "surfaceRight": 1478,
   "walkY": 11,
   "verticalScale": 0.62
  },
  "small": {
   "source": "assets/stage-v41-iga-small.png",
   "image": "assets/ready/stage-v41-iga-small-fa20c55908628891.webp",
   "width": 787,
   "height": 249,
   "surfaceLeft": 25,
   "surfaceRight": 762,
   "walkY": 10
  }
 },
 "edf251": {
  "backgroundSource": "assets/stage-v41-edf251-background.png",
  "background": "assets/ready/stage-v41-edf251-background-9c5611d769fec0ef.webp",
  "preview": "assets/ready/stage-picker-edf251-db3824d585721bfd.webp",
  "main": {
   "source": "assets/stage-v41-edf251-main.png",
   "image": "assets/ready/stage-v41-edf251-main-d00e321b96bed2fa.webp",
   "width": 1483,
   "height": 217,
   "surfaceLeft": 37,
   "surfaceRight": 1445,
   "walkY": 9,
   "verticalScale": 0.58
  },
  "small": {
   "source": "assets/stage-v41-edf251-small.png",
   "image": "assets/ready/stage-v41-edf251-small-084fe9661ae03da1.webp",
   "width": 761,
   "height": 168,
   "surfaceLeft": 31,
   "surfaceRight": 728,
   "walkY": 9
  }
 },
 "grid086": {
  "backgroundSource": "assets/stage-v41-grid086-background.png",
  "background": "assets/ready/stage-v41-grid086-background-f47ba3a0775c785f.webp",
  "preview": "assets/ready/stage-picker-grid086-e3d442238a3895d7.webp",
  "main": {
   "source": "assets/stage-v41-grid086-main.png",
   "image": "assets/ready/stage-v41-grid086-main-e0290c9775d9908d.webp",
   "width": 1526,
   "height": 299,
   "surfaceLeft": 38,
   "surfaceRight": 1488,
   "walkY": 9,
   "verticalScale": 0.57
  },
  "small": {
   "source": "assets/stage-v41-grid086-small.png",
   "image": "assets/ready/stage-v41-grid086-small-f3f2324f2b02f19c.webp",
   "width": 765,
   "height": 157,
   "surfaceLeft": 25,
   "surfaceRight": 738,
   "walkY": 9
  }
 },
 "megafloat": {
  "backgroundSource": "assets/stage-v42-megafloat-background.png",
  "background": "assets/ready/stage-v42-megafloat-background-7cace8e006b488cd.webp",
  "preview": "assets/ready/stage-picker-megafloat-834efb9cf98b5777.webp",
  "main": {
   "source": "assets/stage-v42-megafloat-main.png",
   "image": "assets/ready/stage-v42-megafloat-main-7acb9e9e14bb8ba3.webp",
   "width": 1525,
   "height": 198,
   "surfaceLeft": 41,
   "surfaceRight": 1483,
   "walkY": 8
  },
  "small": {
   "source": "assets/stage-v42-megafloat-small.png",
   "image": "assets/ready/stage-v42-megafloat-small-8228622f98a42918.webp",
   "width": 773,
   "height": 112,
   "surfaceLeft": 29,
   "surfaceRight": 742,
   "walkY": 9
  }
 },
 "greatwallterraces": {
  "backgroundSource": "assets/stage-v42-greatwallterraces-background.png",
  "background": "assets/ready/stage-v42-greatwallterraces-background-48682a8d81de9c3e.webp",
  "preview": "assets/ready/stage-picker-greatwallterraces-060d24feebb04165.webp",
  "main": {
   "source": "assets/stage-v42-greatwallterraces-main.png",
   "image": "assets/ready/stage-v42-greatwallterraces-main-3403f28e472b672f.webp",
   "width": 1507,
   "height": 283,
   "surfaceLeft": 54,
   "surfaceRight": 1453,
   "walkY": 11
  },
  "small": {
   "source": "assets/stage-v42-greatwallterraces-small.png",
   "image": "assets/ready/stage-v42-greatwallterraces-small-db1a2f8213fc752e.webp",
   "width": 778,
   "height": 204,
   "surfaceLeft": 38,
   "surfaceRight": 739,
   "walkY": 10
  }
 },
 "churchcity": {
  "backgroundSource": "assets/stage-v42-churchcity-background.png",
  "background": "assets/ready/stage-v42-churchcity-background-fda8b66f0a81deb3.webp",
  "preview": "assets/ready/stage-picker-churchcity-e7039396e74459b2.webp",
  "main": {
   "source": "assets/stage-v42-churchcity-main.png",
   "image": "assets/ready/stage-v42-churchcity-main-52e7568d648e514c.webp",
   "width": 1523,
   "height": 367,
   "surfaceLeft": 20,
   "surfaceRight": 1504,
   "walkY": 10
  },
  "small": {
   "source": "assets/stage-v42-churchcity-small.png",
   "image": "assets/ready/stage-v42-churchcity-small-bf9e7d723dd1aceb.webp",
   "width": 756,
   "height": 227,
   "surfaceLeft": 18,
   "surfaceRight": 737,
   "walkY": 10
  }
 },
 "fallentower": {
  "backgroundSource": "assets/stage-v42-fallentower-background.png",
  "background": "assets/ready/stage-v42-fallentower-background-92fc5ec639c71131.webp",
  "preview": "assets/ready/stage-picker-fallentower-d91b496767b44705.webp",
  "main": {
   "source": "assets/stage-v42-fallentower-main.png",
   "image": "assets/ready/stage-v42-fallentower-main-3a6602f6a72f15bc.webp",
   "width": 1507,
   "height": 223,
   "surfaceLeft": 51,
   "surfaceRight": 1456,
   "walkY": 9
  },
  "small": {
   "source": "assets/stage-v42-fallentower-small.png",
   "image": "assets/ready/stage-v42-fallentower-small-97c9f1083448070d.webp",
   "width": 722,
   "height": 147,
   "surfaceLeft": 39,
   "surfaceRight": 682,
   "walkY": 61
  }
 },
 "tamagotland": {
  "backgroundSource": "assets/stage-v43-tamagotland-background.png",
  "background": "assets/ready/stage-v43-tamagotland-background-7dcf9c8aef37498e.webp",
  "preview": "assets/ready/stage-picker-tamagotland-e1bfc1c6614d3551.webp",
  "main": {
   "source": "assets/stage-v43-tamagotland-main.png",
   "image": "assets/ready/stage-v43-tamagotland-main-ea2b8173f6d80e96.webp",
   "width": 1504,
   "height": 303,
   "surfaceLeft": 24,
   "surfaceRight": 1481,
   "walkY": 9
  },
  "small": {
   "source": "assets/stage-v43-tamagotland-small.png",
   "image": "assets/ready/stage-v43-tamagotland-small-ea0c0b63054382bb.webp",
   "width": 771,
   "height": 179,
   "surfaceLeft": 17,
   "surfaceRight": 752,
   "walkY": 9
  }
 },
 "nyankocastle": {
  "backgroundSource": "assets/stage-v43-nyankocastle-background.png",
  "background": "assets/ready/stage-v43-nyankocastle-background-94861977b5d564aa.webp",
  "preview": "assets/ready/stage-picker-nyankocastle-ffc63fa99f61681c.webp",
  "main": {
   "source": "assets/stage-v43-nyankocastle-main.png",
   "image": "assets/ready/stage-v43-nyankocastle-main-efe00286437d4aeb.webp",
   "width": 1518,
   "height": 288,
   "surfaceLeft": 35,
   "surfaceRight": 1483,
   "walkY": 9
  },
  "small": {
   "source": "assets/stage-v43-nyankocastle-small.png",
   "image": "assets/ready/stage-v43-nyankocastle-small-1ba7b6f1af8989b0.webp",
   "width": 776,
   "height": 148,
   "surfaceLeft": 20,
   "surfaceRight": 755,
   "walkY": 9
  }
 },
 "cojiclass": {
  "backgroundSource": "assets/stage-v43-cojiclass-background.png",
  "background": "assets/ready/stage-v43-cojiclass-background-392fe6bb5b3e93d8.webp",
  "preview": "assets/ready/stage-picker-cojiclass-c6cdbb2b7730b17f.webp",
  "main": {
   "source": "assets/stage-v43-cojiclass-main.png",
   "image": "assets/ready/stage-v43-cojiclass-main-094548d5cbd8f164.webp",
   "width": 1536,
   "height": 222,
   "surfaceLeft": 69,
   "surfaceRight": 1466,
   "walkY": 9
  },
  "small": {
   "source": "assets/stage-v43-cojiclass-small.png",
   "image": "assets/ready/stage-v43-cojiclass-small-b4c6a14a30f6b8b9.webp",
   "width": 796,
   "height": 141,
   "surfaceLeft": 35,
   "surfaceRight": 760,
   "walkY": 9
  }
 },
 "ochaland": {
  "backgroundSource": "assets/stage-v43-ochaland-background.png",
  "background": "assets/ready/stage-v43-ochaland-background-aba67e004292f40c.webp",
  "preview": "assets/ready/stage-picker-ochaland-ba25bb4c7991aec5.webp",
  "main": {
   "source": "assets/stage-v43-ochaland-main.png",
   "image": "assets/ready/stage-v43-ochaland-main-d9a4e0aa61cfd745.webp",
   "width": 1524,
   "height": 267,
   "surfaceLeft": 85,
   "surfaceRight": 1432,
   "walkY": 9
  },
  "small": {
   "source": "assets/stage-v43-ochaland-small.png",
   "image": "assets/ready/stage-v43-ochaland-small-592576dc00c2639d.webp",
   "width": 813,
   "height": 172,
   "surfaceLeft": 34,
   "surfaceRight": 778,
   "walkY": 10
  }
 },
 "donburi": {
  "backgroundSource": "assets/stage-v44-donburi-background.png",
  "background": "assets/ready/stage-v44-donburi-background-bf5644d9139687ab.webp",
  "preview": "assets/ready/stage-picker-donburi-f496f2321ec7a8f2.webp",
  "main": {
   "source": "assets/stage-v44-donburi-main.png",
   "image": "assets/ready/stage-v44-donburi-main-eff0756a0abefc7b.webp",
   "width": 1502,
   "height": 345,
   "surfaceLeft": 54,
   "surfaceRight": 1458,
   "walkY": 10
  },
  "small": {
   "source": "assets/stage-v44-donburi-small.png",
   "image": "assets/ready/stage-v44-donburi-small-98ad820d74b75d6e.webp",
   "width": 753,
   "height": 223,
   "surfaceLeft": 31,
   "surfaceRight": 717,
   "walkY": 13
  }
 },
 "movieland": {
  "backgroundSource": "assets/stage-v44-movieland-background.png",
  "background": "assets/ready/stage-v44-movieland-background-41f2873f7282d340.webp",
  "preview": "assets/ready/stage-picker-movieland-947c7288f65d5dbf.webp",
  "main": {
   "source": "assets/stage-v44-movieland-main.png",
   "image": "assets/ready/stage-v44-movieland-main-a0ac27bee573f35d.webp",
   "width": 1490,
   "height": 186,
   "surfaceLeft": 34,
   "surfaceRight": 1456,
   "walkY": 10
  },
  "small": {
   "source": "assets/stage-v44-movieland-small.png",
   "image": "assets/ready/stage-v44-movieland-small-1b408aeef9bc8f3b.webp",
   "width": 771,
   "height": 142,
   "surfaceLeft": 32,
   "surfaceRight": 738,
   "walkY": 9
  }
 },
 "medaropolis": {
  "backgroundSource": "assets/stage-v44-medaropolis-background.png",
  "background": "assets/ready/stage-v44-medaropolis-background-7a8b62c3bd1b4e9b.webp",
  "preview": "assets/ready/stage-picker-medaropolis-d4fb904a974c51c6.webp",
  "main": {
   "source": "assets/stage-v44-medaropolis-main.png",
   "image": "assets/ready/stage-v44-medaropolis-main-5f1fa91777ed5765.webp",
   "width": 1495,
   "height": 228,
   "surfaceLeft": 40,
   "surfaceRight": 1454,
   "walkY": 9
  },
  "small": {
   "source": "assets/stage-v44-medaropolis-small.png",
   "image": "assets/ready/stage-v44-medaropolis-small-d0762b6f3679b25d.webp",
   "width": 765,
   "height": 164,
   "surfaceLeft": 28,
   "surfaceRight": 737,
   "walkY": 8
  }
 },
 "hachihachi": {
  "backgroundSource": "assets/stage-v44-hachihachi-background.png",
  "background": "assets/ready/stage-v44-hachihachi-background-14ba16fb95f7f306.webp",
  "preview": "assets/ready/stage-picker-hachihachi-0e9623020691bb8c.webp",
  "main": {
   "source": "assets/stage-v44-hachihachi-main.png",
   "image": "assets/ready/stage-v44-hachihachi-main-f3ad4e94ba3c90d2.webp",
   "width": 1502,
   "height": 205,
   "surfaceLeft": 24,
   "surfaceRight": 1478,
   "walkY": 9
  },
  "small": {
   "source": "assets/stage-v44-hachihachi-small.png",
   "image": "assets/ready/stage-v44-hachihachi-small-c752423cd4dd3cbb.webp",
   "width": 788,
   "height": 166,
   "surfaceLeft": 14,
   "surfaceRight": 773,
   "walkY": 9
  }
 }
};
