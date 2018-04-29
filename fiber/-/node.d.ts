declare namespace $ {
}
export = $;
declare namespace $ {
    var $mol_func_name_dict: WeakMap<Function, string>;
    function $mol_func_name(func: Function): string;
}
declare namespace $ {
    namespace $$ {
    }
    class $mol_object2 {
        static $: typeof $ & Window;
        $: typeof $ & Window;
        static make<Instance>(this: {
            new (): Instance;
        }, config: Partial<Instance>): Instance;
        static toString(): string;
        destructor(): void;
    }
}
declare namespace $ {
    let $mol_fiber_stack: $mol_fiber<any>[];
    function $mol_fiber_make<Result = void>(handler: () => Result, abort?: void | (() => void)): $mol_fiber<Result>;
    function $mol_fiber_start<Result = void>(handler: () => Result): Result;
    function $mol_fiber_defer<Result = void>(handler: () => Result): void;
    function $mol_fiber_func<Handler extends (...args: any[]) => Result, Result = void>(handler: Handler): Handler;
    function $mol_fiber_method<Host, Result>(obj: Host, name: string, descr: TypedPropertyDescriptor<(...args: any[]) => Result>): void;
    function $mol_fiber_sync<Result = void>(request: () => PromiseLike<Result>): Result;
    function $mol_fiber_async<Result = void>(request: (back: (response: (...args: any[]) => Result) => (...args: any[]) => void) => {
        (): any;
    } | void): Result;
    function $mol_fiber_warp(): void;
    function $mol_fiber_catch(catcher: (error: Error) => any): void;
    class $mol_fiber<Result = any> extends $mol_object2 {
        slave: $mol_fiber;
        handler: () => Result;
        abort: void | (() => void);
        static $: typeof $mol_object2.$ & {
            Promise: PromiseConstructor;
        };
        $: typeof $mol_object2.$ & {
            Promise: PromiseConstructor;
        };
        static quant: number;
        static current: $mol_fiber;
        static scheduled: number;
        static deadline: number;
        catcher: (error: Error) => any;
        static tick(): void;
        static schedule(): void;
        static queue: (() => void)[];
        constructor(slave: $mol_fiber, handler: () => Result, abort?: void | (() => void));
        destructor(): void;
        masters: $mol_fiber<any>[];
        cursor: number;
        error: Error;
        result: Result;
        protected _done: (result: Result) => void;
        done(result: Result): Result;
        static catched: WeakSet<object>;
        fail(error: Error | Promise<Result>): Error | Promise<Result>;
        limit(): void;
        start(): Result;
        execute(): Result;
        step(): void;
        master: $mol_fiber;
        toString(): string;
    }
}
