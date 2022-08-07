const render = document.getElementById('root');

    let $count = 0
    let $list = ["test", "test2", "test3"]


    /**
     * 
    **/
    function create(tagName) {
      return document.createElement(tagName);
    }

    function createText(text) {
      return document.createTextNode(text);
    }

    function mount(element, parent) {
      parent.appendChild(element);
    }

    function setProps(element, props) {
      for (const key in props) {
        element.setAttribute(key, props[key]);
      }
    }

    function update(element, newProps) {
      for (const key in newProps) {
        element.setAttribute(key, newProps[key]);
      }
    }

    function setEvents(element, events) {
      for (const key in events) {
        element[key] = events[key]
      }
    }


const __$item__updates__ = {
    items: [],
    push: (item) => {
      __$item__updates__.items.push(item);
    },
    emit: () => {
      __$item__updates__.items.forEach((item) => {
        item();
      });
    },
  };
  const __$count__updates__ = {
    items: [],
    push: (item) => {
      __$count__updates__.items.push(item);
    },
    emit: () => {
      __$count__updates__.items.forEach((item) => {
        item();
      });
    },
  };
  const __$list__updates__ = {
    items: [],
    push: (item) => {
      __$list__updates__.items.push(item);
    },
    emit: () => {
      __$list__updates__.items.forEach((item) => {
        item();
      });
    },
  };
  root = create("App");
  
  const _1 = create("h1");
  
  let _1_mounted = false;
  
  const _1_props = () => {
    if (_1_mounted) {
      setProps(_1, {});
    }
  };
  
  _1_props();
  
  setEvents(
    _1,
  
    {}
  );
  
  const _1_update_props = _1_props;
  
  const _2_val = () => `Test if the component is working`;
  
  let _2_mounted = false;
  
  const _2 = createText(_2_val());
  
  const _2_update = () => {
    if (_2_mounted) {
      _2.textContent = _2_val();
    }
  };
  
  mount(_1, root);
  
  mount(_2, _1);
  _2_mounted = true;
  
  _3 = create("div");
  
  function block__3_create($item) {
    /** Create Children */
    const _4 = create("p");
  
    let _4_mounted = false;
  
    const _4_props = () => {
      if (_4_mounted) {
        setProps(_4, {});
      }
    };
  
    _4_props();
  
    setEvents(
      _4,
  
      {}
    );
  
    const _4_update_props = _4_props;
    const _5_val = () => `ITEM ` + $item + ``;
  
    let _5_mounted = false;
  
    const _5 = createText(_5_val());
  
    const _5_update = () => {
      if (_5_mounted) {
        _5.textContent = _5_val();
      }
    };
  
    __$item__updates__.push(_5_update);
    const _6 = create("button");
  
    let _6_mounted = false;
  
    const _6_props = () => {
      if (_6_mounted) {
        setProps(_6, {});
      }
    };
  
    _6_props();
  
    setEvents(
      _6,
  
      {
        onclick: () => {
          (() => $count++)();
  
          __$count__updates__.emit();
        },
      }
    );
  
    const _6_update_props = _6_props;
    const _7_val = () =>
      `Delete Item ` +
      $item +
      `
  
          ` +
      $count +
      ``;
  
    let _7_mounted = false;
  
    const _7 = createText(_7_val());
  
    const _7_update = () => {
      if (_7_mounted) {
        _7.textContent = _7_val();
      }
    };
  
    __$item__updates__.push(_7_update);
  
    __$count__updates__.push(_7_update);
    const _8 = create("b");
  
    let _8_mounted = false;
  
    const _8_props = () => {
      if (_8_mounted) {
        setProps(_8, {
          style: `font-size:` + (10 + 20) + ``,
        });
      }
    };
  
    _8_props();
  
    setEvents(
      _8,
  
      {}
    );
  
    const _8_update_props = _8_props;
    const _9_val = () => `` + (" " + $item) + ``;
  
    let _9_mounted = false;
  
    const _9 = createText(_9_val());
  
    const _9_update = () => {
      if (_9_mounted) {
        _9.textContent = _9_val();
      }
    };
  
    __$item__updates__.push(_9_update);
  
    const mount__3 = () => {
      mount(_4, _3);
  
      mount(_5, _4);
      _5_mounted = true;
      mount(_6, _3);
  
      mount(_7, _6);
      _7_mounted = true;
      mount(_8, _6);
  
      mount(_9, _8);
      _9_mounted = true;
    };
  
    const unmount__3 = () => {
      destroy(_4);
  
      destroy(_5);
      _5_mounted = false;
      destroy(_6);
  
      destroy(_7);
      _7_mounted = false;
      destroy(_8);
  
      destroy(_9);
      _9_mounted = false;
    };
  
    const update__3 = () => {};
  
    return {
      mount: mount__3,
      unmount: unmount__3,
      update: update__3,
    };
  }
  
  mount(_3, root);
  
  const _3_items = $list;
  const _3_items_added = [];
  let _3_item_index = 0;
  
  for (_3_item_index = 0; _3_item_index < _3_items.length; _3_item_index++) {
    const _3_item = _3_items[_3_item_index];
  
    _3_item_created = block__3_create(_3_item);
  
    _3_items_added.push(_3_item_created);
  
    _3_item_created.mount();
  }
  
  const _a = create("style");
  
  let _a_mounted = false;
  
  const _a_props = () => {
    if (_a_mounted) {
      setProps(_a, {});
    }
  };
  
  _a_props();
  
  setEvents(
    _a,
  
    {}
  );
  
  const _a_update_props = _a_props;
  
  const _b_val = () =>
    `body{background-color:#1a1a1a;color:#fff;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif}.gray{color:gray}.underlined{text-decoration:underline}`;
  
  let _b_mounted = false;
  
  const _b = createText(_b_val());
  
  const _b_update = () => {
    if (_b_mounted) {
      _b.textContent = _b_val();
    }
  };
  
  mount(_a, root);
  
  mount(_b, _a);
  _b_mounted = true;
  
  mount(root, render);