namespace $ {

	declare function requestIdleCallback( handler : ()=> any ) : number

	export let $mol_task_current : $mol_task_state
	export let $mol_task_deadline = 0
	
	export class $mol_task_state< Result = any > {
		
		constructor(
			public handler : ()=> Result ,
			public slave : $mol_task_state = undefined ,
		) {
			if( slave ) slave.master = this
		}

		masters = [] as $mol_task_state[]
		cursor = -1
		result : Result

		done( res : Result ) {
			this.result = res
			if( this.slave ) this.slave.notify()
		}

		error( error : any ) : Result {

			if( typeof error.then === 'function' ) {
				error.then(
					( val: any )=> this.done( val ) ,
					( error : any )=> this.done( this.error( error ) ) ,
				)
				error = new Error( 'Wait...' )
			}
	
			return new Proxy<Error>( error , {
				get() { throw error } ,
				apply() { throw error } ,
			} ) as any as Result
	
		}

		notify() {
			if( this.cursor === -1 ) return
			this.cursor = -1
			
			if( this.slave ) this.slave.notify()
			else this.run()
		}

		run() {
			const slave = $mol_task_current
			if( slave ) slave.step()
			
			if( this.cursor !== -1 ) return this.result

			this.cursor = 0
			
			if( $mol_task_deadline ) {
				if( Date.now() > $mol_task_deadline ) {
					$mol_task_deadline = 0
					requestIdleCallback( ()=> {
						this.notify()
					} )
					const error = new Error( 'Defer...' )
					this.result = this.error( error )
					
					if( slave ) throw error
					else return this.result
				}
			} else {
				$mol_task_deadline = Date.now() + 10
			}

			try {
				$mol_task_current = this
				this.result = this.handler()
			} catch( error ) {
				this.result = this.error( error )
			} finally {
				$mol_task_current = slave
			}			

			return this.result
		}

		step() {
			++ this.cursor
		}

		get master() {
			return this.masters[ this.cursor ]
		}
		set master( next : $mol_task_state ) {
			this.masters[ this.cursor ] = next
		}

	}

	export function $mol_task_wrap< Handler extends ( ... args : any[] )=> Result , Result = void >( handler : Handler ) {
		
		return function $mol_task_wrapper( ... args : any[] ) {
			let master = $mol_task_current && $mol_task_current.master
			if( !master ) master = new $mol_task_state< Result >( handler.bind( this , ... args ) , $mol_task_current )
			return master.run()
		} as Handler

	}

	export function $mol_task< Host , Result >(
		obj : Host ,
		name : string ,
		descr : TypedPropertyDescriptor< ( ... args : any[] )=> Result >
	) {
		descr.value = $mol_task_wrap( descr.value )
	}

}