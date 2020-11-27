# World Facet
The 'world' facet is a special facet that is applied to a single entity, representing the world itself. This entity is used as the source for actions that have no other physical source -- such as the passage of time.

## State

* **`time`**: The current value of the game simulation's timer, in seconds.

## Selectors

* **`getTime`**: Retrieves the simulation's current time.

## Recognized Actions

* **`spawn-entity`**: This action adds a new entity to the world.
* **`tick`**: This action advances the world's time by one tick. (TBD: While currently 5 seconds, how is the tick length determined?)

## Recognized Transformations

* None defined.