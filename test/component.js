{
  "children": [
    {
      "type": "h1",
      "id": "_3",
      "children": {
        "children": [
          {
            "type": "Text",
            "id": "_2",
            "value": "Test if the component is working",
            "create": "\n                            const _2 = createText(\"Test if the component is working\");\n                        ",
            "mount": "\n                            mount(_2, _1);\n                        ",
            "unmount": "\n                            destroy(_2);\n                        "
          }
        ],
        "codes": {
          "id": "_1",
          "create": "\n                    const _1 = create(\"h1\");\n\n                    setProps(_1, {});\n                ",
          "mount": "\n                    mount(_1, root);\n                    ",
          "unmount": "\n                    destroy(_1);\n                "
        }
      },
      "create": "\n                            const _3 = create(\"h1\");\n                        ",
      "mount": "\n                            mount(_3, _0);\n\n                        ",
      "unmount": "\n                            destroy(_3);\n\n                        "
    },
    {
      "type": "button",
      "id": "_6",
      "children": {
        "children": [
          {
            "type": "Text",
            "id": "_5",
            "value": "Click me to see if the component is working correctly",
            "create": "\n                            const _5 = createText(\"Click me to see if the component is working correctly\");\n                        ",
            "mount": "\n                            mount(_5, _4);\n                        ",
            "unmount": "\n                            destroy(_5);\n                        "
          }
        ],
        "codes": {
          "id": "_4",
          "create": "\n                    const _4 = create(\"button\");\n\n                    setProps(_4, {});\n                ",
          "mount": "\n                    mount(_4, root);\n                    ",
          "unmount": "\n                    destroy(_4);\n                "
        }
      },
      "create": "\n                            const _6 = create(\"button\");\n                        ",
      "mount": "\n                            mount(_6, _0);\n\n                        ",
      "unmount": "\n                            destroy(_6);\n\n                        "
    },
    {
      "type": "pre",
      "id": "_9",
      "children": {
        "children": [
          {
            "type": "Text",
            "id": "_8",
            "value": "Clicked {{ \"0\"+20+1 }} times",
            "create": "\n                            const _8 = createText(\"Clicked {{ \"0\"+20+1 }} times\");\n                        ",
            "mount": "\n                            mount(_8, _7);\n                        ",
            "unmount": "\n                            destroy(_8);\n                        "
          }
        ],
        "codes": {
          "id": "_7",
          "create": "\n                    const _7 = create(\"pre\");\n\n                    setProps(_7, {});\n                ",
          "mount": "\n                    mount(_7, root);\n                    ",
          "unmount": "\n                    destroy(_7);\n                "
        }
      },
      "create": "\n                            const _9 = create(\"pre\");\n                        ",
      "mount": "\n                            mount(_9, _0);\n\n                        ",
      "unmount": "\n                            destroy(_9);\n\n                        "
    },
    {
      "type": "div",
      "id": "_e",
      "children": {
        "children": [
          {
            "type": "p",
            "id": "_d",
            "children": {
              "children": [
                {
                  "type": "Text",
                  "id": "_c",
                  "value": "{{ \"0\"+20+1 }}",
                  "create": "\n                            const _c = createText(\"{{ \"0\"+20+1 }}\");\n                        ",
                  "mount": "\n                            mount(_c, _b);\n                        ",
                  "unmount": "\n                            destroy(_c);\n                        "
                }
              ],
              "codes": {
                "id": "_b",
                "create": "\n                    const _b = create(\"p\");\n\n                    setProps(_b, {\"class\":\"gray\"});\n                ",
                "mount": "\n                    mount(_b, root);\n                    ",
                "unmount": "\n                    destroy(_b);\n                "
              }
            },
            "create": "\n                            const _d = create(\"p\");\n                        ",
            "mount": "\n                            mount(_d, _a);\n\n                        ",
            "unmount": "\n                            destroy(_d);\n\n                        "
          }
        ],
        "codes": {
          "id": "_a",
          "create": "\n                    const _a = create(\"div\");\n\n                    setProps(_a, {});\n                ",
          "mount": "\n                    mount(_a, root);\n                    ",
          "unmount": "\n                    destroy(_a);\n                "
        }
      },
      "create": "\n                            const _e = create(\"div\");\n                        ",
      "mount": "\n                            mount(_e, _0);\n\n                        ",
      "unmount": "\n                            destroy(_e);\n\n                        "
    }
  ],
  "codes": {
    "id": "_0",
    "create": "\n                    const _0 = create(\"App\");\n\n                    setProps(_0, {});\n                ",
    "mount": "\n                    mount(_0, root);\n                    ",
    "unmount": "\n                    destroy(_0);\n                "
  }
}