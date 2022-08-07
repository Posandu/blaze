let t = 0,
	n = ["Hello", "World", "!"];
function s(t, e) {
	e.appendChild(t);
}
function c(t, e) {
	for (const n in e) t.setAttribute(n, e[n]);
}
function i(t, e) {
	for (const n in e) t[n] = e[n];
}
function u(t) {
	t.remove();
}
const r = {
		items: [],
		push: (t) => {
			r.items.push(t);
		},
		emit: () => {
			r.items.forEach((t) => {
				t();
			});
		},
	},
	l = {
		items: [],
		push: (t) => {
			l.items.push(t);
		},
		emit: () => {
			l.items.forEach((t) => {
				t();
			});
		},
	},
	m = {
		items: [],
		push: (t) => {
			m.items.push(t);
		},
		emit: () => {
			m.items.forEach((t) => {
				t();
			});
		},
	},
	h = document.createElement("App"),
	p = document.createElement("h1"),
	f = () => {
		c(p, {});
	};
c(p, {}), i(p, {});
let a = false;
const d = document.createTextNode("Test if the component is working");
s(p, h), s(d, p), (a = true);
const y = document.createElement("p"),
	x = () => {
		c(y, {});
	};
c(y, {}), i(y, {});
const k = () => "" + t;
let b = false;
const E = document.createTextNode(k());
r.push(() => {
	b && (E.textContent = k());
}),
	s(y, h),
	s(E, y),
	(b = true);
const g = document.createElement("pre"),
	C = () => {
		c(g, {});
	};
c(g, {}), i(g, {});
const T = document.createElement("b"),
	v = () => {
		c(T, {});
	};
c(T, {}), i(T, {});
let z = false;
const A = document.createTextNode("Hello World");
s(T, g), s(A, T), (z = true), s(g, h), s(T, g), s(A, T), (z = true);
const H = document.createElement("h1"),
	I = () => {
		c(H, { style: "font-size: " + t + "px;" });
	};
I(), i(H, {});
const O = I;
r.push(O);
let W = false;
const w = document.createTextNode("😀");
s(H, h), s(w, H), (W = true);
const G = document.createElement("div");
s(G, h);
const M = n,
	N = [],
	R = () => {
		M.forEach((h) => {
			const p = (function (h) {
					const p = document.createElement("p");
					c(p, {}), i(p, {});
					const f = () => "ITEM " + h;
					let a = false;
					const d = document.createTextNode(f());
					l.push(() => {
						a && (d.textContent = f());
					});
					const y = document.createElement("button");
					c(y, {}),
						i(y, {
							onclick: () => {
								t++, n.push("item " + n.length), r.emit(), m.emit(), m.emit();
							},
						});
					const g = () => "This is " + h + "\n\n        " + t;
					let T = false;
					const k = document.createTextNode(g()),
						x = () => {
							T && (k.textContent = g());
						};
					l.push(x), r.push(x);
					const b = document.createElement("b");
					c(b, { style: "font-size:30" }), i(b, {});
					const E = () => " " + h;
					let C = false;
					const H = document.createTextNode(E());
					l.push(() => {
						C && (H.textContent = E());
					});
					const N = document.createElement("button");
					c(N, {}),
						i(N, {
							onclick: () => {
								n.splice(n.indexOf(h), 1),
									m.emit(),
									m.emit(),
									l.emit(),
									r.emit();
							},
						});
					const S = () => "Remove " + h;
					let v = false;
					const z = document.createTextNode(S());
					return (
						l.push(() => {
							v && (z.textContent = S());
						}),
						{
							mount: () => {
								s(p, G),
									s(d, p),
									(a = true),
									s(y, G),
									s(k, y),
									(T = true),
									s(b, y),
									s(H, b),
									(C = true),
									s(N, G),
									s(z, N),
									(v = true);
							},
							unmount: () => {
								u(p),
									u(d),
									(a = false),
									u(y),
									u(k),
									(T = false),
									u(b),
									u(H),
									(C = false),
									u(N),
									u(z),
									(v = false);
							},
							update: () => {},
							key: h,
						}
					);
				})(h),
				f = p.key;
			N.find((t) => t.key === f) || (N.push({ key: f, created: p }), p.mount());
		}),
			N.forEach((t) => {
				M.find((e) => e === t.key) ||
					(t.created.unmount(), N.splice(N.indexOf(t), 1));
			});
	};
R(), l.push(R), m.push(R);
const S = document.createElement("style"),
	U = () => {
		c(S, {});
	};
c(S, {}), i(S, {});
let V = false;
const j = document.createTextNode(
	"body{background-color:#1a1a1a;color:#fff;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif}.gray{color:gray}.underlined{text-decoration:underline}"
);
s(S, h), s(j, S), (V = true), s(h, render);
