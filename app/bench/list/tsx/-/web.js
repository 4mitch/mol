"use strict"
/// Fake namespace for optional overrides
///
/// 	namespace $ { export var x = 1 , y = 1 } // defaults
/// 	namespace $.$$ { export var x = 2 } // overrides
/// 	namespace $.$$ { console.log( x , y ) } // usage
///
var $ = $ || ( typeof window === 'object' ) && window || ( typeof module === 'object' ) && module['export'+'s']
$.$$ = $

$.$mol = $  // deprecated

;

var $node = $node || {}
void function( module ) { var exports = module.exports = this; function require( id ) { return $node[ id.replace( /^.\// , "../mol/" ) + ".js" ] }; 

;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//mol.js.map
;

$node[ "../mol/mol.js" ] = $node[ "../mol/mol.js" ] = module.exports }.call( {} , {} )

;
"use strict";
var $;
(function ($) {
    $.$mol_func_name_dict = new WeakMap();
    function $mol_func_name(func) {
        let name = $.$mol_func_name_dict.get(func);
        if (name != null)
            return name;
        name = func.name || Function.prototype.toString.call(func).match(/([a-z0-9_$]*) ?(\(|\{|extends)/)[1];
        $.$mol_func_name_dict.set(func, name);
        return name;
    }
    $.$mol_func_name = $mol_func_name;
})($ || ($ = {}));
//name.js.map
;
"use strict";
var $;
(function ($_1) {
    let $$;
    (function ($$) {
        let $;
    })($$ = $_1.$$ || ($_1.$$ = {}));
    class $mol_object2 {
        constructor() {
            this.$ = this.constructor['$'];
        }
        static make(config) {
            const instance = new this;
            for (let key in config)
                instance[key] = config[key];
            return instance;
        }
        static toString() {
            return $_1.$mol_func_name(this);
        }
        destructor() { }
    }
    $mol_object2.$ = $;
    $_1.$mol_object2 = $mol_object2;
})($ || ($ = {}));
//object2.js.map
;
"use strict";
var $;
(function ($) {
    $.$mol_fiber_stack = [];
    function $mol_fiber_make(handler, abort) {
        if ($mol_fiber.current)
            $mol_fiber.current.step();
        let master = $mol_fiber.current && $mol_fiber.current.master;
        if (master)
            return master;
        return new $mol_fiber($mol_fiber.current, handler, abort);
    }
    $.$mol_fiber_make = $mol_fiber_make;
    function $mol_fiber_start(handler) {
        return $mol_fiber_make(handler).start();
    }
    $.$mol_fiber_start = $mol_fiber_start;
    function $mol_fiber_defer(handler) {
        const defer = $mol_fiber.$.requestAnimationFrame || $mol_fiber.$.setTimeout;
        defer($mol_fiber_func(handler));
    }
    $.$mol_fiber_defer = $mol_fiber_defer;
    function $mol_fiber_func(handler) {
        return function $mol_fiber_func_wrapper(...args) {
            return $mol_fiber_make(handler.bind(this, ...args)).start();
        };
    }
    $.$mol_fiber_func = $mol_fiber_func;
    function $mol_fiber_method(obj, name, descr) {
        descr.value = $mol_fiber_func(descr.value);
    }
    $.$mol_fiber_method = $mol_fiber_method;
    function $mol_fiber_sync(request) {
        const fiber = $mol_fiber_make(() => {
            throw request().then(res => { fiber.done(res); }, error => { fiber.fail(error); });
        });
        return fiber.start();
    }
    $.$mol_fiber_sync = $mol_fiber_sync;
    function $mol_fiber_async(request) {
        const fiber = $mol_fiber_make(() => {
            const promise = new Promise((done, fail) => {
                fiber.abort = request(response => (...args) => {
                    if (!fiber.masters)
                        return;
                    new Promise(() => {
                        fiber.done(response(...args));
                    }).catch(error => {
                        fiber.fail(error);
                    });
                    if (fiber.slave)
                        fiber.slave.start();
                });
            });
            throw promise;
        });
        return fiber.start();
    }
    $.$mol_fiber_async = $mol_fiber_async;
    function $mol_fiber_warp() {
        while ($mol_fiber.queue.length)
            $mol_fiber.tick();
    }
    $.$mol_fiber_warp = $mol_fiber_warp;
    function $mol_fiber_catch(catcher) {
        $mol_fiber.current.catcher = catcher;
    }
    $.$mol_fiber_catch = $mol_fiber_catch;
    class $mol_fiber extends $.$mol_object2 {
        constructor(slave, handler, abort) {
            super();
            this.slave = slave;
            this.handler = handler;
            this.abort = abort;
            this.masters = [];
            this.cursor = -1;
            this.error = undefined;
            this.result = undefined;
            if (slave) {
                slave.master = this;
                this.$ = slave.$;
            }
        }
        static tick() {
            const now = Date.now();
            let elapsed = Math.max(0, now - $mol_fiber.deadline);
            $mol_fiber.deadline = now + $mol_fiber.quant + Math.min(elapsed, 1000) / 10;
            if ($mol_fiber.queue.length == 0)
                return;
            $mol_fiber.schedule();
            const resolve = $mol_fiber.queue.shift();
            if (resolve)
                resolve();
        }
        static schedule() {
            if ($mol_fiber.scheduled)
                return;
            const schedule = this.$.requestAnimationFrame || this.$.setTimeout;
            $mol_fiber.scheduled = schedule(() => {
                $mol_fiber.scheduled = 0;
                $mol_fiber.tick();
            });
        }
        destructor() {
            if (!this.masters)
                return;
            for (let master of this.masters)
                master.destructor();
            this.masters = null;
            if (this.abort)
                this.abort();
        }
        done(result) {
            if (!this.masters)
                return;
            this.result = result;
            this.abort = null;
            this.destructor();
            return result;
        }
        fail(error) {
            if (!this.masters)
                return;
            if (error instanceof Promise) {
                const self = this;
                const listener = function $mol_fiber_listener() {
                    return self.start();
                };
                return error.then(listener, listener);
            }
            else {
                if (!$mol_fiber.catched.has(error)) {
                    if (error.stack)
                        error.stack = error.stack.replace(/.*\$mol_fiber.*[\n\r]*/g, '');
                    console.error(error);
                    $mol_fiber.catched.add(error);
                }
            }
            if (this.catcher) {
                const value = this.catcher(error);
                if (!(value instanceof Error)) {
                    this.done(value);
                    return error;
                }
            }
            this.error = error;
            this.abort = null;
            this.destructor();
            return error;
        }
        limit() {
            if (Date.now() <= $mol_fiber.deadline)
                return;
            if (!$mol_fiber.current && $mol_fiber.queue.length === 0) {
                $mol_fiber.deadline = Date.now() + $mol_fiber.quant;
                return;
            }
            throw new Promise(done => {
                $mol_fiber.queue.push(done);
                $mol_fiber.schedule();
            });
        }
        start() {
            if (this.masters) {
                if ($mol_fiber.current) {
                    this.execute();
                }
                else {
                    const self = this;
                    new Promise(function $mol_fiber_catcher() {
                        self.execute();
                    }).catch(error => {
                        let fiber = this;
                        while (fiber.masters && fiber.master && fiber.master.masters)
                            fiber = fiber.master;
                        while (fiber) {
                            error = fiber.fail(error);
                            if (error instanceof Promise)
                                return;
                            if (error instanceof Error) {
                                fiber = fiber.slave;
                                continue;
                            }
                            else {
                                if (fiber.slave)
                                    fiber.slave.start();
                                break;
                            }
                        }
                    });
                }
            }
            if (this.error)
                throw this.error;
            return this.result;
        }
        execute() {
            const slave = $mol_fiber.current;
            this.limit();
            this.cursor = -1;
            try {
                $mol_fiber.current = this;
                var res = this.handler();
                this.done(res);
                if (this.slave)
                    this.slave.start();
            }
            finally {
                $mol_fiber.current = slave;
            }
            return res;
        }
        step() {
            ++this.cursor;
        }
        get master() {
            return this.masters[this.cursor];
        }
        set master(next) {
            this.masters[this.cursor] = next;
        }
        toString() {
            if (!this.slave)
                return '';
            return this.slave + '/' + this.slave.masters.indexOf(this);
        }
    }
    $mol_fiber.quant = 8;
    $mol_fiber.scheduled = 0;
    $mol_fiber.deadline = Date.now() + $mol_fiber.quant;
    $mol_fiber.queue = [];
    $mol_fiber.catched = new WeakSet;
    $.$mol_fiber = $mol_fiber;
})($ || ($ = {}));
//fiber.js.map
;
"use strict";
var $;
(function ($) {
})($ || ($ = {}));
//context.js.map
;
"use strict";
var $;
(function ($) {
    $.$mol_dom_context = window;
})($ || ($ = {}));
//context.web.js.map
;
"use strict";
var $;
(function ($) {
    function $mol_dom_make(id, localName = 'span', namespaceURI = 'http://www.w3.org/1999/xhtml') {
        const document = $.$mol_dom_context.document;
        let node = id && document.getElementById(id);
        if (!node) {
            node = document.createElementNS(namespaceURI, localName);
            if (id)
                node.id = id;
        }
        return node;
    }
    $.$mol_dom_make = $mol_dom_make;
})($ || ($ = {}));
//make.js.map
;
"use strict";
var $;
(function ($) {
    function $mol_log(path, ...values) {
        if ($.$mol_log_filter() == null)
            return;
        path = String(path);
        if (path.indexOf($.$mol_log_filter()) === -1)
            return;
        if ($.$mol_log_context())
            $.$mol_log_context()();
        console.debug(path, ...values);
        if ($.$mol_log_debug() == null)
            return;
        if (path.indexOf($.$mol_log_debug()) === -1)
            return;
        debugger;
    }
    $.$mol_log = $mol_log;
})($ || ($ = {}));
//log.js.map
;
"use strict";
var $;
(function ($) {
    let context = null;
    function $mol_log_context(next = context) {
        return context = next;
    }
    $.$mol_log_context = $mol_log_context;
})($ || ($ = {}));
//log_context.js.map
;
"use strict";
var $;
(function ($) {
    function $mol_log_debug(next) {
        if (next !== undefined) {
            if (next == null) {
                sessionStorage.removeItem('$mol_log_debug()');
            }
            else {
                sessionStorage.setItem('$mol_log_debug()', next);
            }
        }
        return sessionStorage.getItem('$mol_log_debug()');
    }
    $.$mol_log_debug = $mol_log_debug;
})($ || ($ = {}));
//log_debug.web.js.map
;
"use strict";
var $;
(function ($) {
    let filter;
    function $mol_log_filter(next) {
        if (next !== undefined) {
            if (next == null) {
                sessionStorage.removeItem('$mol_log_filter()');
            }
            else {
                sessionStorage.setItem('$mol_log_filter()', next);
            }
            filter = next;
        }
        if (filter !== undefined)
            return filter;
        return filter = sessionStorage.getItem('$mol_log_filter()');
    }
    $.$mol_log_filter = $mol_log_filter;
})($ || ($ = {}));
//log_filter.web.js.map
;
"use strict";
var $;
(function ($) {
    function $mol_log_group(name, task) {
        return function $mol_log_group_wrapper(...args) {
            const filter = $.$mol_log_filter();
            if (filter == null)
                return task.apply(this, args);
            let started = false;
            let prev = $.$mol_log_context();
            $.$mol_log_context(() => {
                if (prev)
                    prev();
                started = true;
                if (filter)
                    console.group(name);
                else
                    console.groupCollapsed(name);
                $.$mol_log_context(prev = null);
            });
            try {
                return task.apply(this, args);
            }
            finally {
                if (started)
                    console.groupEnd();
                $.$mol_log_context(prev);
            }
        };
    }
    $.$mol_log_group = $mol_log_group;
})($ || ($ = {}));
//log_group.js.map
;
"use strict";
var $;
(function ($) {
    function $mol_dom_render_fields(el, fields) {
        for (let key in fields) {
            const val = fields[key];
            if (val === undefined)
                continue;
            if (el[key] === val)
                continue;
            el[key] = val;
        }
    }
    $.$mol_dom_render_fields = $mol_dom_render_fields;
    function $mol_dom_render_children(el, childNodes) {
        const node_list = [];
        const node_set = new Set();
        for (let i = 0; i < childNodes.length; ++i) {
            let node = childNodes[i];
            if (node == null)
                continue;
            if (Object(node) === node) {
                if (node['dom_tree'])
                    node = node['dom_tree']();
                node_list.push(node);
                node_set.add(node);
            }
            else {
                node_list.push(String(node));
            }
        }
        let nextNode = el.firstChild;
        for (let view_ of node_list) {
            const view = view_.valueOf();
            if (view instanceof $.$mol_dom_context.Node) {
                while (true) {
                    if (!nextNode) {
                        el.appendChild(view);
                        break;
                    }
                    if (nextNode == view) {
                        nextNode = nextNode.nextSibling;
                        break;
                    }
                    else {
                        if (node_set.has(nextNode)) {
                            el.insertBefore(view, nextNode);
                            break;
                        }
                        else {
                            const nn = nextNode.nextSibling;
                            el.removeChild(nextNode);
                            nextNode = nn;
                        }
                    }
                }
            }
            else {
                if (nextNode && nextNode.nodeName === '#text') {
                    nextNode.nodeValue = String(view);
                    nextNode = nextNode.nextSibling;
                }
                else {
                    const textNode = $.$mol_dom_context.document.createTextNode(String(view));
                    el.insertBefore(textNode, nextNode);
                }
            }
        }
        while (nextNode) {
            const currNode = nextNode;
            nextNode = currNode.nextSibling;
            el.removeChild(currNode);
        }
    }
    $.$mol_dom_render_children = $mol_dom_render_children;
    function $mol_dom_render_attributes(el, attrs) {
        for (let name in attrs) {
            let val = attrs[name];
            if (val === null || val === false)
                el.removeAttribute(name);
            else
                el.setAttribute(name, String(val));
        }
    }
    $.$mol_dom_render_attributes = $mol_dom_render_attributes;
    function $mol_dom_render_styles(el, styles) {
        for (let name in styles) {
            let val = styles[name];
            const style = el.style;
            const cur = style[name];
            if (typeof val === 'number') {
                if (parseFloat(cur) == val)
                    continue;
                style[name] = `${val}px`;
            }
            if (cur !== val)
                style[name] = val;
        }
    }
    $.$mol_dom_render_styles = $mol_dom_render_styles;
    function $mol_dom_render_events(el, events) {
        for (let name in events) {
            el.addEventListener(name, $.$mol_log_group(el.id + ' ' + name, events[name]), { passive: false });
        }
    }
    $.$mol_dom_render_events = $mol_dom_render_events;
    function $mol_dom_render_events_async(el, events) {
        for (let name in events) {
            el.addEventListener(name, $.$mol_log_group(el.id + ' ' + name, events[name]), { passive: true });
        }
    }
    $.$mol_dom_render_events_async = $mol_dom_render_events_async;
})($ || ($ = {}));
//render.js.map
;
"use strict";
var $;
(function ($) {
    $.$mol_dom_jsx = $.$mol_fiber_func(function $mol_dom_jsx(Elem, props, ...children) {
        let node;
        if (typeof Elem === 'string') {
            node = $.$mol_dom_make(props && props['id'], Elem);
            if (props && props['childNodes']) {
                children = props['childNodes'];
                props['childNodes'] = undefined;
            }
            $.$mol_dom_render_children(node, [].concat.apply([], children));
            $.$mol_dom_render_fields(node, props);
        }
        else if (typeof Elem === 'function') {
            const props2 = props;
            node = Elem(Object.assign({ childNodes: children }, props2));
            if (node['render'])
                node = node['render']();
        }
        return node;
    });
})($ || ($ = {}));
//jsx.js.map
;
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var $;
(function ($) {
    class $mol_app_bench_list_tsx {
        static onClick(item, event) {
            this.selected = item.id;
            this.render();
        }
        static render() {
            $.$mol_fiber_start(() => {
                if (this.rendering)
                    this.rendering.destructor();
            });
            this.rendering = $.$mol_fiber.current;
            let Item = ({ id, item }) => ($.$mol_dom_jsx("div", { id: id, className: `list-item list-item-selected-${this.selected === item.id}`, onclick: this.onClick.bind(this, item) },
                $.$mol_dom_jsx("div", { id: `${id}.title`, className: "list-item-title" }, item.title),
                $.$mol_dom_jsx("div", { id: `${id}.content`, className: "list-item-content" }, item.content)));
            return ($.$mol_dom_jsx("div", { id: "list", className: "list" }, this.data.items.map(item => $.$mol_dom_jsx(Item, { id: `list.item[${item.id}]`, item: item }))));
        }
    }
    $mol_app_bench_list_tsx.data = {
        sample: '',
        items: []
    };
    $mol_app_bench_list_tsx.selected = null;
    __decorate([
        $.$mol_fiber_method
    ], $mol_app_bench_list_tsx, "render", null);
    $.$mol_app_bench_list_tsx = $mol_app_bench_list_tsx;
})($ || ($ = {}));
//index.js.map
//# sourceMappingURL=web.js.map