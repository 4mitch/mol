require( "source-map-support" ).install()

;
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
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//mol.js.map
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
//# sourceMappingURL=node.test.js.map