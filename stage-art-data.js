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
 }
};
