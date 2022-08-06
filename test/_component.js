let root,
  _1,
  _2_val,
  _2,
  _2_update,
  _1_props,
  _1_update_props,
  _3,
  _4,
  _5_val,
  _5,
  _5_update,
  _4_props,
  _4_update_props,
  _3_props,
  _3_update_props,
  _6,
  _7_val,
  _7,
  _7_update,
  _6_props,
  _6_update_props;

root = create("App");

_1 = create("h1");

_1_props = () => {
  setProps(_1, {});
};

_1_props();

setEvents(
  _1,

  {}
);

_1_update_props = _1_props;

_2_val = () => `Test if the component is working`;

_2 = createText(_2_val());

_2_update = () => {
  _2.textContent = _2_val();
};

mount(_1, root);

mount(_2, _1);

function block__3_create($item) {}

_4 = create("p");

_4_props = () => {
  setProps(_4, {});
};

_4_props();

setEvents(
  _4,

  {}
);

_4_update_props = _4_props;

_5_val = () => `ITEM ` + $item + ``;

_5 = createText(_5_val());

_5_update = () => {
  _5.textContent = _5_val();
};

mount(_4, _3);

mount(_5, _4);

block__3_create();

_6 = create("style");

_6_props = () => {
  setProps(_6, {});
};

_6_props();

setEvents(
  _6,

  {}
);

_6_update_props = _6_props;

_7_val = () =>
  `body{background-color:#1a1a1a;color:#fff;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif}.gray{color:gray}.underlined{text-decoration:underline}`;

_7 = createText(_7_val());

_7_update = () => {
  _7.textContent = _7_val();
};

mount(_6, root);

mount(_7, _6);

mount(root, render);

function __$item__() {
  _5_update();
  _3_update_props();
}