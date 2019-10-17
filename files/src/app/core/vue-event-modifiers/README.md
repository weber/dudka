That said, here are the Vue.js event-modifiers that I'm interesting in:

- .stop - calls .stopPropagation().
- .prevent - calls .preventDefault().
- .capture - binds to the capturing phase.
- .self - requires event-target to be the host element.
- .once - unbinds itself after first invocation.
- .passive - binds a passive event-handler (not supported in all browsers).

To be clear, this is not the entirety of the Vue.js event-modifiers; but, these are the ones that pertain to non-key-based DOM events. And, these are the ones that I'm accounting for in my Event Manager Plugin.

In Vue.js, the order in which these modifiers are applied is meaningful. However, in my implementation, the order is irrelevant. Which means that the following event-bindings are equivalent:

(click.prevent.self)="handleClick()"
(click.self.prevent)="handleClick()"
In all cases, the event-modifier simply enables a Boolean flag in an underlying configuration object which is then used to drive the event-binding logic.

```
<ul
			(click.capture)="logEvent( $event )"
			(click)="logEvent( $event )">
			<li>
				<a (click.once)="logClick( 'Testing .once' )">
					Testing <code>.once</code>
				</a>
			</li>
			<li>
				<a (click.self)="logClick( 'Testing .self' )">
					Testing <code>.self</code>
				</a>
			</li>
			<li>
				<a (click.once.self)="logClick( 'Testing .once.self' )">
					Testing <code>.once.self</code>
				</a>
			</li>
			<li>
				<a (click.stop)="logClick( 'Testing .stop' )">
					Testing <code>.stop</code>
				</a>
			</li>
			<li>
				<a href="https://google.com" (click.prevent)="logClick( 'Testing .prevent' )">
					Testing <code>.prevent</code>
				</a>
			</li>
			<li>
				<a
					href="https://google.com"
					target="_blank"
					(click.once.self.prevent)="logClick( 'Testing .once.self.prevent' )">
					Testing <code>.once.self.prevent</code>
				</a>
			</li>
			<li>
				<a (click.prevent.passive)="logClick( 'Testing .prevent.passive' )">
					Testing <code>.prevent.passive</code>
				</a>
			</li>
		</ul>
```

