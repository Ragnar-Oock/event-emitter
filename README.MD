# Event-emitter

What if your classes could emit event to be listned by the rest of your app like native [Event Target](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget) can ? 

## What ?

This library aims to implement the behavior of the native [Event Target](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget) outside of the context of the tree of the DOM. You might see that some part of the API is not one to one to the native one, for example there's no implementation of the capture mechanisme as event don't travel in any tree and there's no bubbling mechanisme either.

## Why ?

When you build application using JavaScript it often comes a point where you need different parts of your application to communicate but you either don't want a strong binding between them (that can be for a variety of reasons and is outside the scope of this document) or you just don't know what other part of the application might be interested in the whereabouts of the part you are currently working on.

When they find themself in those kinds of situations, developpers allways end up creating complexe system to try and abstract away the link between every part of the code base from the others. In so doing intruducing a lot of complexity, thus making it harder for new comers to the project and opening the door to hard to find bugs.

This library aims at preventing this by providing a feature that all JavaScript developpers are custom to, Events, in a package they already know, the [Event Target](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget) API.

Using a well known API has 2 adventages : 
- it makes it easier to onboard new developpers in a project as the API is close to what they already know
- it makes it harder for the maintainer (that's me) to create weird and unexpected behavior in the library's API as it is just a subset of an already existing one that is documented at lenght and for which exists a very precise spec.

## How ?

✨ Magic ! ✨ 

Not convinced ? Well that's all I can tell for now as it's far from finished yet.

## TypeScript

This library is written in TypeScript, that means it comes with it own type declarations. That also means that, if you are using typescript, every event that is emitted or handled is typed with the payload that you provided when emiting it, leading to less guessing and thus making it easier to use the events emitted in you code.

## Deviations from the native API

### Capture and Bubbling
As there is not DOM tree for the events to propagate in there is no way or need for capture or bubbling mecanism. For this reason all methods, properties and parameters solely dedicated to those mecanisms are omited from the API of this library.