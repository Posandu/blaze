const root = create("App");

setProps(root, {});

const _1 = create("h1");

const _2 = createText("Test if the component is working");

const _2_dependencies = [null];

mount(_1, root);

mount(_2, _1);

const _3 = create("button");

const _4 = createText("Click me to see if the component is working correctly");

const _4_dependencies = [null];

mount(_3, root);

mount(_4, _3);

const _5 = create("pre");

const _6 = createText('Clicked {{ "0"+20+1 }} times');

const _6_dependencies = [null];

mount(_5, root);

mount(_6, _5);

const _7 = create("div");

const _8 = create("p");

const _9 = createText("{{ state.count }}");

const _9_dependencies = [state.count];

mount(_8, _7);

mount(_9, _8);

const _a = create("b");

const _b = create("p");

const _c = createText("😃");

const _c_dependencies = [null];

mount(_b, _a);

mount(_c, _b);

mount(_a, _7);

mount(_b, _a);

mount(_c, _b);

mount(_7, root);

mount(_8, _7);

mount(_9, _8);
mount(_a, _7);

mount(_b, _a);

mount(_c, _b);

mount(root, render);